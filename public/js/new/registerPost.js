import { baseUrl, getSubSubCategoryByID } from "../../../utils/shared.js"
import { getParamFromURL, getToken } from "../../../utils/utils.js"



window.addEventListener('load', () => {
    const loadingContainer = document.querySelector('#loading-container')
    const categoryDetailsTitle = document.querySelector('.category_details p')
    const dynamicFiltersContainer = document.querySelector('#dynamic-fields')
    const registerBtn = document.querySelector('#register-btn')

    const subCategoryID = getParamFromURL('subCategoryID')

    let categoryFields = {}

    // Website Loader
    loadingContainer.style.display = 'none'

    getSubSubCategoryByID(subCategoryID).then(subCategory => {
        categoryDetailsTitle.innerHTML = subCategory.title

        // Define Falsy Value for Each Dynamic Field
        subCategory.productFields.forEach(field => {
            if (field.type === 'checkbox') {
                categoryFields[field.slug] = false
            } else {
                categoryFields[field.slug] = null
            }
        })

        console.log(subCategory);



        dynamicFiltersContainer.innerHTML = ''
        subCategory.productFields.map(field => {
            dynamicFiltersContainer.insertAdjacentHTML('beforeend', `
                ${field.type === 'selectbox' ?
                    `
                     <div class="group">
                        <p class="field-title">${field.name}</p>
                        <div class="field-box">
                          <select required="required" onchange="fieldChangeHandler('${field.slug}', event.target.value)">
                            <option value=null>انتخاب</option>
                            ${field.options.map(option =>
                        `<option value="${option}">${option}</option>`
                    )}
                          </select>
                          <svg>
                            <use xlink:href="#select-arrow-down"></use>
                          </svg>
                        </div>
                        <svg class="sprites">
                          <symbol id="select-arrow-down" viewbox="0 0 10 6">
                            <polyline points="1 1 5 5 9 1"></polyline>
                          </symbol>
                        </svg>
                    </div>

                    `
                    :

                    `
                    <div class="group checkbox-group">
                      <input class="checkbox" type="checkbox" onchange="fieldChangeHandler('${field.slug}', event.target.checked)" />
                      <p>${field.name}</p>
                    </div>     
                    `}
                `)

        })

    })


    window.fieldChangeHandler = (slug, value) => {
        categoryFields[slug] = value
    }


    //! Events

    registerBtn.addEventListener('click', async () => {
        // Check 2 Validation ==> 1) Static Fields Validation   2) Dynamic Fields Validation

        const formData = new FormData()
        // formData.append()

        const res = await fetch(`${baseUrl}/v1/post/${subCategoryID}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`
            },
            body: formData
        })

        if (res.status === 200) {

        } else {

        }

    })

})