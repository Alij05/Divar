import { baseUrl, getPosts } from "../../utils/shared.js"
import { getFromLocalStorage } from "../../utils/utils.js"

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



})



const generatePosts = async (posts) => {

    const postsContainer = document.querySelector('#posts-container')

    if (posts.length) {
        posts.forEach(post => {
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
                    <span class="product-card__time">Date</span>
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
