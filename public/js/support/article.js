import { getArticleDetails, getAllArticlesOfCategory } from "../../../utils/shared.js";
import { getParamFromURL } from "../../../utils/utils.js";



window.addEventListener('load', () => {
    const loading = document.querySelector('#loading-container')
    const breadcumb = document.querySelector('#breadcumb span')
    const articleTitle = document.querySelector('#article-title')
    const articleBody = document.querySelector('#article-body')
    const sameArticles = document.querySelector('#same-articles')

    let articleID = getParamFromURL('id')
    
    getArticleDetails().then(article => {
        // Website Loader
        loading.style.display = 'none'

        document.title = article.title
        breadcumb.innerHTML = article.title
        articleTitle.innerHTML = article.title
        articleBody.innerHTML = article.body

        getAllArticlesOfCategory(article.categories[0]).then(categoryArticles => {
            // FIlter that Article Which we are in that Page
            const filteredCategoryArticles = categoryArticles.filter(categoryArticle => categoryArticle._id !== articleID)
            filteredCategoryArticles.forEach(article => {
                sameArticles.insertAdjacentHTML('beforeend', `
                    <a href="/pages/support/article.html?id=${article._id}">${article.title}</a>
                `)            
            })
        })

    })

})