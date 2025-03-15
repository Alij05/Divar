import { getAllCategories } from "../../utils/shared.js"
import { isLogin } from "../../utils/utils.js"

window.addEventListener('load', async () => {
    const loadingContainer = document.querySelector('#loading-container')
    const categoriesContainer = document.querySelector('#categories-container')
    const categoriesSection = document.querySelector('#categories')
    const descriptionCheckbox = document.querySelector('#description-checkbox')

    console.log(categoriesContainer);


    const isUserLogin = await isLogin()
    if (!isUserLogin) {
        return location.href = '/pages/posts.html'
    }

    // Website Loader
    loadingContainer.style.display = 'none'

    getAllCategories().then(categories => {
        showCategories(categories)

        descriptionCheckbox?.addEventListener('change', () => {
            showCategories(categories)
        })
    })




    //! Functions

    const showCategories = (categories) => {
        categoriesSection.innerHTML = ''

        categories.forEach(category => {
            categoriesSection.insertAdjacentHTML('beforeend', `
                <div class="box">
                    <div class="details">
                        <div>
                          <i class="bi bi-house-door"></i>
                          <p>${category.title}</p>
                        </div>
                        ${descriptionCheckbox.checked ? `<span>${category.description}</span>` : ''}
                        </div>
                        <i class="bi bi-chevron-left"></i>
                </div>
                `)
        })
    }


})