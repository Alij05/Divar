import { getArticleDetails } from "../../../utils/shared.js";



window.addEventListener('load', () => {
    const loading = document.querySelector('#loading-container')
    const breadcumb = document.querySelector('#breadcumb span')
    const articleTitle = document.querySelector('#article-title')
    const articleBody = document.querySelector('#article-body')
    
    
    getArticleDetails().then(article => {
        console.log(article);

        // Website Loader
        loading.style.display = 'none'

        document.title = article.title
        breadcumb.innerHTML = article.title
        articleTitle.innerHTML = article.title
        articleBody.innerHTML = article.body
            
        
    })


})