import { baseUrl, getSupportCategoriesArticles } from "../../utils/shared.js"


window.addEventListener('load', () => {
    // Website Loader
    const loading = document.querySelector('#loading-container')
    loading.style.display = 'none'


    const popularArticlesContainer = document.querySelector('#popular-articles')
    const categoriesContainerElement = document.querySelector('#categories-container')


    getSupportCategoriesArticles().then(supportArticlesCategories => {
        const popularArticles = supportArticlesCategories.find(category => category.shortName === 'popular_articles')

        showPopularArticles(popularArticles)
        showAllArticlesCategories(supportArticlesCategories)

    })



    //!  Functions  !//

    const showPopularArticles = (popularArticles) => {
        popularArticles.articles.forEach(article => {
            popularArticlesContainer.insertAdjacentHTML('beforeend', `
                <a href="/pages/support/article.html?id=${article._id}" class="article">
                    <p>${article.title}</p>
                    <span>${article.body.slice(0, 180)} ...</span>
                    <div>
                        <i class="bi bi-arrow-left"></i>
                        <p>ادامه مقاله</p>
                    </div>
                </a>
                `)

        })
    }


    const showAllArticlesCategories = (categories) => {
        categories.forEach(category => {
            categoriesContainerElement.insertAdjacentHTML('beforeend', `
                <a href="/pages/support/articles.html?id=${category._id}">
                    <img src="${baseUrl}/${category.pic.path}" width="64" height="64" alt="" />
                    <div>
                        <p>${category.name}</p>
                        <span>نحوه انجام پرداخت، استفاده از کیف پول، افزایش بازدید، استفاده از</span>
                    </div>
                    <i class="bi bi-chevron-left"></i>
                </a>
                `)
        })

    }


})