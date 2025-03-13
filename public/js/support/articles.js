import { baseUrl, getArticles } from "../../../utils/shared.js"
import { getParamFromURL } from "../../../utils/utils.js"

window.addEventListener('load', () => {

    const loadingContainer = document.querySelector('#loading-container')
    const articlesContainer = document.querySelector('#articles')
    const breadcumb = document.querySelector('#breadcrumb span')
    const categoryInfo = document.querySelector('#category-info')

    let categoryID = getParamFromURL('id')


    getArticles().then(categories => {
        // Website Loader
        loadingContainer.style.display = 'none'

        const category = categories.find(category => category._id === categoryID)
        console.log(category);

        document.title = category.name
        breadcumb.innerHTML = category.name
        categoryInfo.insertAdjacentHTML('beforeend', `
            <img src="${baseUrl}/${category.pic.path}" class="category-info-icon" />
            <p class="category-info-title">${category.name}</p>
            `)
        
        category.articles.map(article => {
            articlesContainer.insertAdjacentHTML("beforeend", `
                <a href="/pages/support/article.html?id=${article._id}" class="article">
                    <div>
                        <p>${article.title}</p>
                        <span>${article.body.slice(0, 180)} ...</span>
                    </div>
                    <i class="bi bi-arrow-left"></i>
                </a>
                `)
        })
        
        
    })

})