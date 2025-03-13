import { baseUrl, getAllArticles, getSupportCategoriesArticles } from "../../utils/shared.js"


window.addEventListener('load', () => {
    // Website Loader
    const loading = document.querySelector('#loading-container')
    loading.style.display = 'none'


    const popularArticlesContainer = document.querySelector('#popular-articles')
    const categoriesContainerElement = document.querySelector('#categories-container')
    const searchInput = document.querySelector('#search-input')
    const removeIcon = document.querySelector('#remove-icon')
    const searchResult = document.querySelector('#search-result')


    getSupportCategoriesArticles().then(supportArticlesCategories => {
        const popularArticles = supportArticlesCategories.find(category => category.shortName === 'popular_articles')

        showPopularArticles(popularArticles)
        showAllArticlesCategories(supportArticlesCategories)

    })


    getAllArticles().then(articles => {
        // Search in All Articles
        searchInput.addEventListener('keyup', (event) => {
            if (event.target.value.trim()) {
                // Redirect When Click Enter on Keyboard
                if (event.keyCode === 13) {
                    location.href = `/pages/support/search.html?key=${event.target.value.trim()}`
                }

                searchResult.classList.add('active')
                removeIcon.classList.add('active')

                let searchedArticles = articles.filter(article => article.title.includes(event.target.value))

                if (searchedArticles.length) {
                    searchResult.innerHTML = `
                        <a href="/pages/support/search.html?key=${event.target.value.trim()}">
                          <i class="bi bi-search"></i>
                          ${event.target.value.trim()}
                        </a>
                    `
                    searchedArticles.forEach(article => {
                        searchResult.insertAdjacentHTML('beforeend', `
                                <a href="/pages/support/article.html?id=${article._id}">
                                  <i class="bi bi-card-text"></i>
                                  ${article.title}
                                </a>
                                `)
                    })

                } else {
                    searchResult.innerHTML = `
                        <a href="/pages/support/search.html?key=${event.target.value.trim()}">
                          <i class="bi bi-search"></i>
                          ${event.target.value.trim()}
                        </a>
                    `
                }

            } else {
                searchResult.classList.remove('active')
                removeIcon.classList.remove('active')
            }

        })

        removeIcon.addEventListener('click', () => {
            searchInput.value = ''
            searchResult.classList.remove('active')
            removeIcon.classList.remove('active')
        })

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