import { baseUrl, getAllLocations, getSubSubCategoryByID } from "../../../utils/shared.js"
import { getParamFromURL, getToken, showSwal } from "../../../utils/utils.js"



window.addEventListener('load', () => {
    const loadingContainer = document.querySelector('#loading-container')
    const categoryDetailsTitle = document.querySelector('#subCategory-title')
    const dynamicFiltersContainer = document.querySelector('#dynamic-fields')
    const citySelectBox = document.querySelector('#city-select')
    const neighborhoodSelectBox = document.querySelector('#neighborhood-select')
    const inputUploader = document.querySelector('#uploader')
    const imagesContainer = document.querySelector('#images-container')
    const registerBtn = document.querySelector('#register-btn')

    const subCategoryID = getParamFromURL('subCategoryID')

    let categoryFields = {}
    let pics = []

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


    getAllLocations().then(data => {
        const cityChoices = new Choices(citySelectBox)
        const neighborhoodChoices = new Choices(neighborhoodSelectBox)

        const tehranNeighborhood = data.neighborhoods.filter(neighborhood => neighborhood.city_id === 301)

        const neighborhoodChoicesConfigs = [
            {
                value: 'default',
                label: 'انتخاب محله',
                disabled: true,
                selected: true
            },
            ...tehranNeighborhood.map(neighborhood => ({
                value: neighborhood.id,
                label: neighborhood.name,
            }))
        ]

        neighborhoodChoices.setChoices(neighborhoodChoicesConfigs, 'value', 'label', false)

        cityChoices.setChoices(
            data.cities.map(city => ({
                value: city.id,
                label: city.name,
                customProperties: { id: city.id },
                selected: city.name === 'تهران' ? true : false
            })), 'value', 'label', false)


        // Connect City Selectbox to Neighborhood Selectbox to Show neighborhoods Dynamicly
        citySelectBox.addEventListener('addItem', (event) => {
            neighborhoodChoices.clearStore()  // Delete all Options of neighborhoodChoices Selectbox

            const neighborhoods = data.neighborhoods.filter(neighborhood => neighborhood.city_id === event.detail.customProperties.id)

            if (neighborhoods.length) {
                const neighborhoodChoicesConfigs = [{
                    value: 'default',
                    label: 'انتخاب محله',
                    disabled: true,
                    selected: true
                },
                ...neighborhoods.map(neighborhood => ({
                    value: neighborhood.id,
                    label: neighborhood.name,
                }))
                ]

                neighborhoodChoices.setChoices(neighborhoodChoicesConfigs, 'value', 'label', false)

            } else {
                neighborhoodChoices.setChoices([{
                    value: 0,
                    label: 'محله ای یافت نشد',
                    disabled: true,
                    selected: true
                }], 'value', 'label', false)
            }

        })

    })


    const generateImages = (pics) => {
        imagesContainer.innerHTML = ''
        pics.forEach(pic => {
            let reader = new FileReader()
            reader.onloadend = function () {
                let src = reader.result

                imagesContainer.insertAdjacentHTML('beforeend', `
                    <div class="image-box">
                      <div onclick="deleteImage('${pic.name}')">
                        <i class="bi bi-trash"></i>
                      </div>
                      <img src="${src}" alt="post-image" />
                    </div>  
                `)
            }

            reader.readAsDataURL(pic)

        })
    }


    window.deleteImage = (picName) => {
        pics = pics.filter(pic => pic.name !== picName)
        generateImages(pics)
    }



    //! Events

    inputUploader.addEventListener('change', (event) => {
        if (event.target.files.length) {
            let file = event.target.files[0]

            // Validation for Type & Size
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
                if (file.size < 10000000) {
                    pics.push(file)
                    generateImages(pics)

                } else {
                    showSwal(
                        "سایز فایل آپلودی مجاز نیست ",
                        "error",
                        "تلاش مجدد",
                        () => { }
                    );
                }

            } else {
                showSwal(
                    "فرمت فایل آپلودی مجاز نیست ",
                    "error",
                    "تلاش مجدد",
                    () => { }
                );
            }
        }
    })


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