import { baseUrl, getCategories, getPosts } from "../../utils/shared.js"
import { addParamToURL, removeParamFromURL, getParamFromURL, calculateRelativeTimeDifference, getFromLocalStorage, pagination } from "../../utils/utils.js"

window.addEventListener('load', () => {
  const loadingContainer = document.querySelector('#loading-container')
  const paginationItemsContainer = document.querySelector(".pagination-items");
  const categoryID = getParamFromURL('categoryID')

  let page = getParamFromURL('page')
  !page ? page = 1 : null

  const cities = getFromLocalStorage('cities')

  let posts = null
  let backupPosts = null
  let appliedDynamicFilters = {}


  // Title of Tab
  if (cities.length === 1) {
    document.title = `دیوار ${cities[0].name} : مرجع خرید و فروش اجناس نو و دسته دو`
  } else {
    document.title = `دیوار ${cities.length} شهر : مرجع خرید و فروش اجناس نو و دسته دو`
  }

  const citiesIDs = cities.map(city => city.id).join('|')
  getPosts(citiesIDs, page).then(response => {
    // Website Loader
    loadingContainer.style.display = 'none'

    // Pagination
    if (categoryID) {
      pagination(`/pages/posts.html?categoryID=${categoryID}`, paginationItemsContainer, page, response.data.pagination.totalPosts, 12)
    } else {
      pagination("/pages/posts.html", paginationItemsContainer, page, response.data.pagination.totalPosts, 12)
    }

    posts = response.data.posts
    backupPosts = response.data.posts
    generatePosts(posts)

  })



  getCategories().then(response => {
    // Website Loader
    loadingContainer.style.display = 'none'

    const categories = response.data.categories
    generateCategories(categories)

  })


  const justPhotoController = document.querySelector('#just_photo_controll')
  const exchangeControll = document.querySelector('#exchange_controll')
  const minPriceSelectbox = document.querySelector('#min-price-selectbox')
  const maxPriceSelectbox = document.querySelector('#max-price-selectbox')

  justPhotoController.addEventListener('change', (event) => {
    applyFilters()
  })

  exchangeControll.addEventListener('change', (event) => {
    applyFilters()
  })


  minPriceSelectbox.addEventListener('change', (event) => {
    applyFilters()
  })

  maxPriceSelectbox.addEventListener('change', (event) => {
    applyFilters()
  })


  //! Functions

  const applyFilters = () => {
    let filteredPosts = backupPosts

    if (justPhotoController.checked) {
      filteredPosts = filteredPosts.filter(post => post.pics.length)
    }

    if (exchangeControll.checked) {
      filteredPosts = filteredPosts.filter(post => post.exchange)
    }

    // Min / Max Price Filtering
    const minPrice = minPriceSelectbox.value
    const maxPrice = maxPriceSelectbox.value

    if (maxPrice !== "default") {
      if (minPrice !== 'default') {
        filteredPosts = filteredPosts.filter(post => post.price <= maxPrice && post.price >= minPrice)
      } else {
        filteredPosts = filteredPosts.filter(post => post.price <= maxPrice)
      }
    } else {
      if (minPrice !== 'default') {
        filteredPosts = filteredPosts.filter(post => post.price >= minPrice)
      }
    }

    // Dynamic Filtering
    for (const slug in appliedDynamicFilters) {
      if (appliedDynamicFilters[slug] !== 'default') {
        filteredPosts = filteredPosts.filter(post => {
          return post.dynamicFields.some(field => field.slug === slug && field.data === appliedDynamicFilters[slug])
        })
      }
    }



    generatePosts(filteredPosts)

  }


  const generatePosts = async (posts) => {

    const postsContainer = document.querySelector('#posts-container')
    postsContainer.innerHTML = ''

    if (posts.length) {
      posts.forEach(post => {
        const date = calculateRelativeTimeDifference(post.createdAt)

        postsContainer.insertAdjacentHTML('beforeend', `
            <div class="col-4">
              <a href="post.html?id=${post._id}" class="product-card">
                <div class="product-card__right">
                  <div class="product-card__right-top">
                    <p class="product-card__link">${post.title}</p>
                  </div>
                  <div class="product-card__right-bottom">
                    <span class="product-card__condition">${post.dynamicFields[0].data}</span>
                    <span class="product-card__price">
                      ${post.price === 0
            ? "توافقی"
            : post.price.toLocaleString() + " تومان"}</span>
                    <span class="product-card__time">${date}</span>
                  </div>
                </div>
                <div class="product-card__left">
                ${post.pics.length
            ? `
                      <img class="product-card__img img-fluid" src="${baseUrl}/${post.pics[0].path}"/>`
            : `
                      <img class="product-card__img img-fluid" src="/public/images/main/noPicture.PNG"/>`
          }
                  
                </div>
              </a>
            </div>          
                `)
      })

    } else {
      postsContainer.innerHTML = '<p class="empty">هیچ آگهی برای شهر های شما وجود ندارد</p>'
    }

  }


  const generateCategories = (categories) => {
    const sidebarCategoriesList = document.querySelector('#sidebar__category-list')

    sidebarCategoriesList.innerHTML = ''


    if (categoryID) {
      const categoryInfos = categories.filter(category => category._id === categoryID)  // check is a Main Category or Sub Category

      // if be a Sub Category
      if (!categoryInfos.length) {
        const subCategory = findSubCategoryByID(categories, categoryID)
        const subCategoryParent = findCategoryByID(categories, subCategory?.parent)

        // if be a Main Sub Category (layer 3)
        if (subCategory) {
          console.log('sub');

          subCategory.filters.forEach(filter => filterGenerator(filter))

          sidebarCategoriesList.insertAdjacentHTML('beforeend', `
              <div class="all-categories" onclick="backToAllCategories()">
                <p>همه اگهی ها</p>
                <i class="bi bi-arrow-right"></i>
              </div>

              <div class="sidebar__category-link" id="category-${subCategoryParent._id}">
                <div class="sidebar__category-link_details" onclick="categoryClickHandler('${subCategoryParent._id}')">
                  <i class="sidebar__category-icon bi bi-house"></i>
                  <p>${subCategoryParent.title}</p>
                </div>
              </div>

              <div class="sidebar__category-link active-category" href="#" id="category-${subCategory._id}" style="margin-right:15px;">
                <div class="sidebar__category-link_details" onclick="categoryClickHandler('${subCategory._id}')">
                  <i class="sidebar__category-icon bi bi-house"></i>
                  <p>${subCategory.title}</p>
                </div>
                <ul class="subCategory-list" style="margin-right:10px;">
                  ${subCategory.subCategories.map(createSubCategoryHtml).join("")}
                </ul>
              </div>
          `)

          // if be a Sub Sub Category (layer 4)
        } else {
          console.log('sub sub');

          const subSubCategory = findSubSubCategoryByID(categories, categoryID)
          const subSubCategoryParent = findSubCategoryByID(categories, subSubCategory?.parent)

          subSubCategory.filters.forEach(filter => filterGenerator(filter))

          sidebarCategoriesList.insertAdjacentHTML('beforeend', `
          <div class="all-categories" onclick="backToAllCategories()">
            <p>همه اگهی ها</p>
            <i class="bi bi-arrow-right"></i>
          </div>

          <div class="sidebar__category-link active-category" href="#" id="category-${subSubCategoryParent._id}">
            <div class="sidebar__category-link_details" onclick="categoryClickHandler('${subSubCategoryParent._id}')">
              <i class="sidebar__category-icon bi bi-house"></i>
              <p>${subSubCategoryParent.title}</p>
            </div>
            <ul class="subCategory-list" style="margin-right:10px;">
              ${subSubCategoryParent.subCategories.map(createSubCategoryHtml).join("")}
            </ul>
          </div>
      `)

        }

        // if be a selected Main Category (layer 2)
      } else {
        sidebarCategoriesList.innerHTML = ''
        categoryInfos.forEach(category => {
          sidebarCategoriesList.insertAdjacentHTML('beforeend', `
              <div class="all-categories" onclick="backToAllCategories()">
                <p>همه اگهی ها</p>
                <i class="bi bi-arrow-right"></i>
              </div>

              <div class="sidebar__category-link active-category" href="#">
                <div class="sidebar__category-link_details" onclick="categoryClickHandler('${category._id}')">
                  <i class="sidebar__category-icon bi bi-house"></i>
                  <p>${category.title}</p>
                </div>
                <ul class="subCategory-list" style="margin-right: 15px;">
                  ${category.subCategories.map(createSubCategoryHtml).join("")}
                </ul>
              </div>

        `)
        })

      }


      // if just have Main Categories (layer 1)
    } else {
      categories.forEach(category => {
        sidebarCategoriesList.insertAdjacentHTML('beforeend', `
            <div class="sidebar__category-link" id="category-${category._id}">
              <div class="sidebar__category-link_details" onclick="categoryClickHandler('${category._id}')">
                <i class="sidebar__category-icon bi bi-house"></i>
                <p>${category.title}</p>
              </div>
            </div>
  
              `)
      })

    }


  }


  const createSubCategoryHtml = (subCategory) => {
    return `
    <li class="${categoryID === subCategory._id ? 'active-subCategory' : ''}" onclick="categoryClickHandler('${subCategory._id}')">
      ${subCategory.title}
    </li>
    `
  }


  const findCategoryByID = (categories, categoryID) => {
    const category = categories.find(category => category._id === categoryID)

    return category

  }


  const findSubCategoryByID = (categories, categoryID) => {
    const allSubCategories = categories.flatMap(category => category.subCategories)
    const subCategory = allSubCategories.find(subCategory => subCategory._id === categoryID)

    return subCategory

  }


  const findSubSubCategoryByID = (categories, categoryID) => {
    const allSubCategories = categories.flatMap(category => category.subCategories)
    const allSubSubCategories = allSubCategories.flatMap(subCategory => subCategory.subCategories)

    const subSubCategory = allSubSubCategories.find(subSubCategory => subSubCategory._id === categoryID)

    return subSubCategory
  }


  const filterGenerator = (filter) => {
    const sidebarFiltersContainer = document.querySelector('#sidebar__fitlers-dynamic')

    sidebarFiltersContainer.insertAdjacentHTML('beforeend',
      `
     ${filter.type === 'selectbox' ? `
       <div class="accordion accordion-flush" id="accordionFlushExample">
         <div class="accordion-item">
           <h2 class="accordion-header">
             <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-${filter.slug}" aria-expanded="false" aria-controls="accordion-${filter.name}">
               <span class="sidebar__filter-title">${filter.name}</span>
             </button>
           </h2>
           <div id="accordion-${filter.slug}" class="accordion-collapse collapse" aria-labelledby="accordion-${filter.name}" data-bs-parent="#accordionFlushExample">
             <div class="accordion-body">
               <select class="selectbox" onchange="selectboxDynamicFilterHandler(event.target.value, '${filter.slug}')">
               <option value='default'>پیش فرض</option>
                 ${filter.options.sort((a, b) => b - a).map((option) => `<option value='${option}'>${option}</option>`)}
               </select>
             </div>
           </div>
         </div>
       </div>
      `
        :
        ""}

      ${filter.type === 'checkbox' ? `
        <div class="sidebar__filter">
         <label class="switch">
             <input id="exchange_controll" class="icon-controll" type="checkbox">
             <span class="slider round"></span>
         </label>
         <p>${filter.name}</p>
       </div>
       `
        :
        ""}


  `)

  }


  const categoryClickHandler = (categoryID) => {
    addParamToURL('categoryID', categoryID)
  }


  const backToAllCategories = () => {
    removeParamFromURL('categoryID')
  }


  const selectboxDynamicFilterHandler = (value, slug) => {
    appliedDynamicFilters[slug] = value
    applyFilters()
  }




  // Bind
  window.categoryClickHandler = categoryClickHandler
  window.backToAllCategories = backToAllCategories
  window.selectboxDynamicFilterHandler = selectboxDynamicFilterHandler


})
