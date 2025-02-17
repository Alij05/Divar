import { baseUrl, getCategories, getPosts } from "../../utils/shared.js"
import { addParamToURL, calculateRelativeTimeDifference, getFromLocalStorage } from "../../utils/utils.js"

window.addEventListener('load', () => {
    const loadingContainer = document.querySelector('#loading-container')

    const cities = getFromLocalStorage('cities')
    cities.forEach(city => {
        getPosts(city.id).then(response => {
            // Website Loader
            loadingContainer.style.display = 'none'

            const posts = response.data.posts
            generatePosts(posts)

        })

    })

    getCategories().then(response => {
        // Website Loader
        loadingContainer.style.display = 'none'

        const categories = response.data.categories
        generateCategories(categories)
        console.log();

    })



})



const generatePosts = async (posts) => {

    const postsContainer = document.querySelector('#posts-container')

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


const generateCategories = (categories) => {
    const sidebarCategoriesList = document.querySelector('#sidebar__category-list')

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

const categoryClickHandler = (categoryID) => {
    addParamToURL('categoryID', categoryID)    
}







// Bind
window.categoryClickHandler = categoryClickHandler