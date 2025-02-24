import { baseUrl, getCategories, getPosts } from "../../utils/shared.js"
import { addParamToURL, removeParamFromURL, getParamFromURL, calculateRelativeTimeDifference, getFromLocalStorage } from "../../utils/utils.js"

window.addEventListener('load', () => {
  const loadingContainer = document.querySelector('#loading-container')

  const cities = getFromLocalStorage('cities')
  cities.forEach(city => {
    getPosts(city.id).then(response => {
      // Website Loader
      loadingContainer.style.display = 'none'

      const posts = response.data.posts
      generatePosts(posts)

      // console.log(posts);
    })

  })
  

  getCategories().then(response => {
    // Website Loader
    loadingContainer.style.display = 'none'

    const categories = response.data.categories
    generateCategories(categories)

  })



})



const generatePosts = async (posts) => {

  const postsContainer = document.querySelector('#posts-container')
  postsContainer.innerHTML = ''

  if (posts.length) {
    posts.forEach(post => {
      const date = calculateRelativeTimeDifference(post.createdAt)

      postsContainer.insertAdjacentHTML('beforeend', `
            <div class="col-4">
              <a href="post.html/id=${post._id}" class="product-card">
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


const categoryID = getParamFromURL('categoryID')
const generateCategories = (categories) => {
  const sidebarCategoriesList = document.querySelector('#sidebar__category-list')
  sidebarCategoriesList.innerHTML = ''


  if (categoryID) {
    const categoryInfos = categories.filter(category => category._id === categoryID)

    // if be a Sub Category
    if (!categoryInfos.length) {
      const subCategory = findSubCategoryByID(categories, categoryID)

      if (subCategory) {
        console.log('sub');
        sidebarCategoriesList.insertAdjacentHTML('beforeend', `
              <div class="all-categories" onclick="backToAllCategories()">
                <p>همه اگهی ها</p>
                <i class="bi bi-arrow-right"></i>
              </div>

              <div class="sidebar__category-link active-category" href="#" id="category-${subCategory._id}">
                <div class="sidebar__category-link_details" onclick="categoryClickHandler('${subCategory._id}')">
                  <i class="sidebar__category-icon bi bi-house"></i>
                  <p>${subCategory.title}</p>
                </div>
                <ul class="subCategory-list">
                  ${subCategory.subCategories.map(createSubCategoryHtml).join("")}
                </ul>
              </div>

          `)
        
      } else {        // be a Sub Sub Category
        console.log('sub sub sub');
        
      }


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
                <ul class="subCategory-list">
                  ${category.subCategories.map(createSubCategoryHtml).join("")}
                </ul>
              </div>

        `)


      })



    }


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


const findSubCategoryByID = (categories, categoryID) => {
  const allSubCategories = categories.flatMap(category => category.subCategories)
  const subCategory = allSubCategories.find(subCategory => subCategory._id === categoryID)

  return subCategory

}



const categoryClickHandler = (categoryID) => {
  addParamToURL('categoryID', categoryID)
}


const backToAllCategories = () => {
  removeParamFromURL('categoryID')
}




// Bind
window.categoryClickHandler = categoryClickHandler
window.backToAllCategories = backToAllCategories