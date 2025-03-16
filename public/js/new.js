import { baseUrl } from "../../utils/shared.js"
import { addParamToURL, getParamFromURL, isLogin } from "../../utils/utils.js"

window.addEventListener('load', async () => {
    const loadingContainer = document.querySelector('#loading-container')
    const showCategoies = document.querySelector('#show-categoies')
    const categoriesContainer = document.querySelector('#categories-container')
    const categoriesSection = document.querySelector('#categories')
    const descriptionCheckbox = document.querySelector('#description-checkbox')
    const searchInput = document.querySelector('#search-input')
    const resultContainerModal = document.querySelector('#result-container')
    const removeIcon = document.querySelector('#remove-icon')


    const isUserLogin = await isLogin()
    if (!isUserLogin) {
        return location.href = '/pages/posts.html'
    }
    loadingContainer.style.display = 'none'


    //! Functions

    const generateCategoriesTemplate = (categories, title, id) => {
        categoriesSection.innerHTML = ''

        if (title) {
            categoriesSection.insertAdjacentHTML('beforeend', `
                <div class="back" onclick="${id ? `categoryClickHandler('${id}')` : `backToAllCategories()`}">
                     <i class="bi bi-arrow-right"></i>
                    <p>بازگشت به ${title}</p>
                </div>
            `)
        }

        categories.forEach(category => {
            categoriesSection.insertAdjacentHTML('beforeend', `
                <div class="box" onclick="categoryClickHandler('${category._id}')">
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


    window.categoryClickHandler = (categoryID) => {
        const category = categories.find(category => category._id === categoryID)

        if (category) {
            //* Main Category
            generateCategoriesTemplate(category.subCategories, 'همه دسته ها', null)
        } else {
            const allSubCategories = categories.flatMap(category => category.subCategories)
            const subCategory = allSubCategories.find(subCategory => subCategory._id === categoryID)

            if (subCategory) {
                //* Sub Category
                const subCategoryParent = categories.find(category => category._id === subCategory.parent)
                generateCategoriesTemplate(subCategory.subCategories, subCategoryParent.title, subCategoryParent._id)
            } else {
                //* Sub Sub Category
                location.href = `/pages/new/registerPost.html?subCategoryID=${categoryID}`
            }
        }

    }


    window.backToAllCategories = () => {
        generateCategoriesTemplate(categories)
    }




    //! Events
    const subCategoriesResult = await fetch(`${baseUrl}/v1/category/sub`)
    const subCategoriesResponse = await subCategoriesResult.json()
    const subCategories = subCategoriesResponse.data.categories

    searchInput.addEventListener('keyup', async (event) => {
        if (event.target.value.trim()) {
            resultContainerModal.innerHTML = ''
            resultContainerModal.classList.add('active')
            removeIcon.classList.add('active')

            const searchedCategories = subCategories.filter(subCategory => subCategory.title.includes(event.target.value.trim()))

            if (searchedCategories.length) {
                searchedCategories.forEach(category => {
                    resultContainerModal.insertAdjacentHTML('beforeend', `
                         <a href="/pages/new/registerPost.html?subCategoryID=${category._id}" class="search-result">
                          <p>${category.title}</p>
                          <i class="bi bi-chevron-left"></i>
                        </a>      
                    `)
                })

            } else {
                resultContainerModal.insertAdjacentHTML('beforeend', `
                    <div class="empty">
                      <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg" />
                      <p>نتیجه‌ای برای جستجوی شما یافت نشد</p>
                    </div>
                    `)
            }

        } else {
            searchInput.value = ''
            resultContainerModal.innerHTML = ''
            resultContainerModal.classList.remove('active')
            removeIcon.classList.remove('active')
        }

    })

    removeIcon.addEventListener('click', () => {
        searchInput.value = ''
        resultContainerModal.innerHTML = ''
        resultContainerModal.classList.remove('active')
        removeIcon.classList.remove('active')
    })

    showCategoies?.addEventListener('click', () => {
        categoriesContainer.style.display = 'block'
        showCategoies.style.display = 'none'
    })


    // ===========================================================================================================================

    const res = await fetch(`${baseUrl}/v1/category`)
    const response = await res.json()
    const categories = response.data.categories

    generateCategoriesTemplate(categories)
    descriptionCheckbox?.addEventListener('change', () => {
        generateCategoriesTemplate(categories)
    })


})