import { getPostDetails } from "../../utils/shared.js"
import { calculateRelativeTimeDifference } from "../../utils/utils.js"

window.addEventListener('load', () => {
    const loadingContainer = document.querySelector('#loading-container')
    // Website Loader
    loadingContainer.style.display = 'none'

    getPostDetails().then(post => {
        console.log(post);


        const postTitle = document.querySelector('#post-title')
        const postDescription = document.querySelector('#post-description')
        const postLocation = document.querySelector('#post-location')
        const postBreadcrumb = document.querySelector('#breadcrumb')
        const shareIcon = document.querySelector('#share-icon')


        postTitle.innerHTML = post.title
        postDescription.innerHTML = post.description
        const date = calculateRelativeTimeDifference(post.createdAt)
        postLocation.innerHTML = `${date} در ${post.city.name} ${post.neighborhood ? `، ${post.neighborhood.name}` : ''}`
        postBreadcrumb.insertAdjacentHTML('beforeend', `
            <li class="main__breadcrumb-item">
              <a href='/pages/posts.html?categoryID=${post.breadcrumbs.category._id}' id="category-breadcrumb">${post.breadcrumbs.category.title}</a>
              <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
            </li>
            <li class="main__breadcrumb-item">
              <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subCategory.title}</a>
              <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
            </li>
            <li class="main__breadcrumb-item">
              <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subSubCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subSubCategory.title}</a>
              <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
            </li>
            <li class="main__breadcrumb-item">${post.title}</li>  
        `)

    })


    //! Events

    shareIcon.addEventListener('click', async () => {
      await navigator.share(location.href)
    })

})