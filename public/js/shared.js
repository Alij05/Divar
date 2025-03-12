import { requestNewOTP, submitPhoneNumber, verifyOTP } from "../../utils/auth.js";
import { getAllLocations, getAndShowHeaderCityLocations, getCategories, showSocialMedias, showUserPanelLinks } from "../../utils/shared.js";
import { addParamToURL, getFromLocalStorage, getParamFromURL, hideModal, removeParamFromURL, saveInLocalStorage, showModal } from "../../utils/utils.js";


window.addEventListener('load', () => {
    showSocialMedias()
    showUserPanelLinks()
    getAndShowHeaderCityLocations()


    const citiesModalList = document.querySelector('#city_modal_list')
    const modalSelectedCitiesCotainer = document.querySelector('#city-selected')
    const globalSearchInput = document.querySelector('#global_search_input')
    const removeSearchValueIcon = document.querySelector('#remove-search-value-icon')
    const searchbarModalOverlay = document.querySelector(".searchbar__modal-overlay")
    const mostSearchedList = document.querySelector('#most_searched')
    const headerCityContainer = document.querySelector('.header__city')
    const deleteAllSelectedCitiesBtn = document.querySelector('#delete-all-cities')
    const cityModalOverlay = document.querySelector('.city-modal__overlay')
    const cityModalAcceptBtn = document.querySelector('.city-modal__accept')
    const cityModalCancelBtn = document.querySelector('.city-modal__close')
    const cityModalError = document.querySelector('#city_modal_error')
    const cityModalSearchInput = document.querySelector('#city-modal-search-input')

    const headerCategoryBtn = document.querySelector('.header__category-btn')
    const categoryModalOverlay = document.querySelector('.category_modal_overlay')
    const headerCategoryMenu = document.querySelector('#header__category-menu')
    const allModalCategoriesPosts = document.querySelector('#all-categories-posts')
    const categoriesList = document.querySelector('#categories-list')
    const categoryResults = document.querySelector('#category-results')

    const loginModalOverlay = document.querySelector(".login_modal_overlay");
    const loginModalHeaderBtn = document.querySelector(".login-modal__header-btn");
    const submitPhoneNumberBtn = document.querySelector(".submit_phone_number_btn");
    const loginBtn = document.querySelector(".login_btn");
    const reqNewCodeBtn = document.querySelector(".req_new_code_btn");


    let selectedCities = []
    let allCities = []
    let allCategories = []

    const searchValue = getParamFromURL('search')
    if (searchValue) {
        removeSearchValueIcon.style.display = 'block'
        globalSearchInput.value = searchValue
    }

    const addCityToModal = (selectedCities) => {
        modalSelectedCitiesCotainer.innerHTML = ''

        selectedCities.forEach(city => {
            modalSelectedCitiesCotainer.insertAdjacentHTML('beforeend', `
                <div class="city-modal__selected-item">
                    <span class="city-modal__selected-text">${city.name}</span>
                    <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}')">
                      <i class="city-modal__selected-icon bi bi-x"></i>
                    </button>
                </div>
                `)

        })
    }

    getAllLocations().then(data => {
        allCities = data
        showProvinces(allCities)
    })


    getCategories().then(response => {
        allCategories = response.data.categories
        showCategories(allCategories)

        // to Show the First Category and SubCategories By Default, We Call the Function for First Category
        showActiveCategorySubs(allCategories[0]._id)
    })


    const showProvinces = (cities) => {
        const citiesModalCities = document.querySelector('.city-modal__cities')
        citiesModalCities?.scrollTo(0, 0)
        citiesModalList ? citiesModalList.innerHTML = '' : null

        cities.provinces.forEach(province => {
            citiesModalList?.insertAdjacentHTML('beforeend', `
                <li 
                    class="city-modal__cities-item province-item" 
                    data-province-id="${province.id}"
                >
                    <span>${province.name}</span>
                    <i class="city-modal__cities-icon bi bi-chevron-left"></i>
                </li>
            `)
        })

        const provinceItems = document.querySelectorAll('.province-item')
        provinceItems.forEach(province => {

            province.addEventListener('click', (event) => {
                const provinceID = event.target.dataset.provinceId
                const provinceName = event.target.querySelector('span').innerHTML

                citiesModalList.innerHTML = ''
                citiesModalList.insertAdjacentHTML('beforeend', `
                    <li id="city_modal_all_province" class="city_modal_all_province">
                      <span>همه شهر ها</span>
                      <i class="bi bi-arrow-right-short"></i>
                    </li>
                    <li class="city-modal__cities-item select-all-city city-item" id="province-${provinceID}" onclick="selectAllCitiesOfProvince('${provinceID}')">
                      <span>همه شهر های ${provinceName} </span>
                      <div id="checkboxShape"></div>
                      <input type="checkbox" checked=""/>
                    </li>
                `)

                const provinceCities = cities.cities.filter(provinceCity => provinceCity.province_id === Number(provinceID))

                provinceCities.forEach(city => {
                    const isCitySelected = selectedCities.some(selectedCity => selectedCity.name === city.name)

                    citiesModalList.insertAdjacentHTML('beforeend', `
                        <li class="city-modal__cities-item city-item" id="city-${city.id}">
                          <span>${city.name}</span>
                          <div id="checkboxShape" class="${isCitySelected && "active"}"></div>
                          <input id="city-item-checkbox" type="checkbox" checked="${isCitySelected}" onchange="cityItemClickHandler('${city.id}')"/>
                        </li>
                    `)
                })

                const backToCityModalAllProvinces = document.querySelector('#city_modal_all_province')
                backToCityModalAllProvinces.addEventListener('click', () => {
                    citiesModalList.innerHTML = ''
                    showProvinces(cities)
                })

            })
        })



    }


    window.selectAllCitiesOfProvince = (provinceID) => {
        const provinceElement = document.querySelector(`#province-${provinceID}`)
        const checkbox = provinceElement.querySelector('input')
        const checkboxShapeElement = provinceElement.querySelector('div')
        const provinceName = provinceElement.querySelector('span').innerHTML

        const allCitiesOfProvinceElements = document.querySelectorAll('.city-item')

        modalSelectedCitiesCotainer.innerHTML = ''

        checkbox.checked = !checkbox.checked

        if (checkbox.checked) {
            checkboxShapeElement.classList.add('active')
            checkbox.checked = false

            selectedCities.forEach(city => {
                modalSelectedCitiesCotainer.insertAdjacentHTML('beforeend', `
                    <div class="city-modal__selected-item">
                        <span class="city-modal__selected-text">${city.name}</span>
                        <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}')">
                        <i class="city-modal__selected-icon bi bi-x"></i>
                        </button>
                    </div>
                    `)
            })

            let allCitiesOfProvince = []
            allCitiesOfProvince = allCities.cities.filter(city => city.province_id === Number(provinceID))
            selectedCities = selectedCities.concat(allCitiesOfProvince)

            modalSelectedCitiesCotainer.insertAdjacentHTML('beforeend', `
                <div class="city-modal__selected-item">
                    <span class="city-modal__selected-text">${provinceName}</span>
                    <button class="city-modal__selected-btn" onclick="removeAllCityOfProvincesFromModal('${provinceID}')">
                      <i class="city-modal__selected-icon bi bi-x"></i>
                    </button>
                </div>
                `)



            allCitiesOfProvinceElements.forEach(cityElement => {
                const checkboxCityShapeElement = cityElement.querySelector('div')

                checkboxCityShapeElement.classList.add('active')
            })

            toggleCityModalBtns(selectedCities)

        } else {
            checkboxShapeElement.classList.remove('active')
            checkbox.checked = true
            selectedCities = selectedCities.filter(city => city.province_id !== Number(provinceID))


            allCitiesOfProvinceElements.forEach(cityElement => {
                const checkboxCityShapeElement = cityElement.querySelector('div')

                checkboxCityShapeElement.classList.remove('active')
            })

            addCityToModal(selectedCities)
            toggleCityModalBtns(selectedCities)

        }

    }


    const cityItemClickHandler = (cityID) => {
        const cityElement = document.querySelector(`#city-${cityID}`)
        const checkbox = cityElement.querySelector('input')
        const checkboxShapeElement = cityElement.querySelector('div')
        const cityName = cityElement.querySelector('span').innerHTML

        selectedCities.forEach(city => {
            if (city.name === cityName) {
                checkbox.checked = true
                checkboxShapeElement.classList.add('active')
            }
        })

        checkbox.checked = !checkbox.checked

        if (checkbox.checked) {
            updateSelectedCities(cityName, cityID)
            checkboxShapeElement.classList.add('active')
        } else {
            selectedCities = selectedCities.filter(city => city.name !== cityName)
            checkbox.checked = true
            checkboxShapeElement.classList.remove('active')
            addCityToModal(selectedCities)
            toggleCityModalBtns(selectedCities)
        }


    }


    const updateSelectedCities = (cityName, cityID) => {
        const isCityExist = selectedCities.some(city => city.name === cityName)
        if (!isCityExist) {
            selectedCities.push({ name: cityName, id: cityID })
            addCityToModal(selectedCities)
            toggleCityModalBtns(selectedCities)
        }

    }


    const toggleCityModalBtns = (cities) => {
        if (cities.length) {
            cityModalAcceptBtn.classList.replace('city-modal__accept', "city-modal__accept--active")
            deleteAllSelectedCitiesBtn.style.display = 'block'
            cityModalError.style.display = 'none'

        } else {
            cityModalAcceptBtn.classList.replace('city-modal__accept--active', "city-modal__accept")
            deleteAllSelectedCitiesBtn.style.display = 'none'
            cityModalError.style.display = 'block'
        }

    }


    const removeCityFromModal = (cityID) => {
        const cityElement = document.querySelector(`#city-${cityID}`)

        if (cityElement) {
            const checkboxShapeElement = cityElement.querySelector('div')
            const checkbox = cityElement.querySelector('input')

            checkbox.checked = false
            checkboxShapeElement.classList.remove('active')
        }

        selectedCities = selectedCities.filter(city => city.id !== cityID)
        addCityToModal(selectedCities)
        toggleCityModalBtns(selectedCities)

    }

    window.removeAllCityOfProvincesFromModal = (provincID) => {
        selectedCities = selectedCities.filter(city => city.province_id ? city.province_id === provincID : {})
        // selectAllCitiesOfProvince(provincID)
    }


    const showCategories = (allCategories) => {
        allCategories.forEach(category => {
            categoriesList?.insertAdjacentHTML('beforeend', `
                <li class="header__category-menu-item" onmouseenter="showActiveCategorySubs('${category._id}')">
                    <div class="header__category-menu-link">
                      <div class="header__category-menu-link-right">
                        <i class="header__category-menu-icon bi bi-house"></i>
                        ${category.title}
                      </div>
                      <div class="header__category-menu-link-left">
                        <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
                      </div>
                    </div>
                </li>
                `)
        })

    }


    const showActiveCategorySubs = (categoryID) => {
        const category = allCategories.find(category => category._id === categoryID)

        categoryResults ? categoryResults.innerHTML = '' : null
        category.subCategories.forEach(subCategory => {
            categoryResults?.insertAdjacentHTML('beforeend', `
                <div>
                    <ul class="header__category-dropdown-list">
                        <div class="header__category-dropdown-title" onclick="categoryClickHandler('${subCategory._id}')">${subCategory.title}</div>
                        ${subCategory.subCategories.map(subSubCategory => `
                            <li class="header__category-dropdown-item">
                                <div class="header__category-dropdown-link" onclick="categoryClickHandler('${subSubCategory._id}')">${subSubCategory.title}</div>
                            </li>
                            `).join("")}
                    </ul>
                </div>
                `)
        })

    }


    window.categoryClickHandler = (categoryID) => {
        addParamToURL('categoryID', categoryID)
    }



    // Events // 

    //! Cities Modal

    removeSearchValueIcon?.addEventListener('click', () => {
        removeParamFromURL('search')
    })

    globalSearchInput?.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            if (event.target.value.trim()) {
                addParamToURL('search', event.target.value.trim())
            }
        }
    })

    // Handle User Category Search
    const mostSearchKeyWords = ["ماشین", "ساعت", "موبایل", "لپ تاپ", "تلویزیون"];
    globalSearchInput?.addEventListener('focus', () => {
        showModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')

        mostSearchKeyWords.forEach(keyWord => {
            const categoryID = getParamFromURL('categoryID')
            // handle the most searched value Seletion in Category
            let href = `posts.html?search=${keyWord}${categoryID ? `&categoryID=${categoryID}` : ``}
 `
            mostSearchedList.insertAdjacentHTML('beforeend', `
                 <li class="header__searchbar-dropdown-item" style="cursor: pointer;">
                     <a href="${href}" class="header__searchbar-dropdown-link">${keyWord}</a>
                 </li>
                 `)
        })
    })

    searchbarModalOverlay?.addEventListener('click', () => {
        hideModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')
        mostSearchedList.innerHTML = ''
    })

    // Handle City Modal 
    headerCityContainer?.addEventListener('click', (event) => {
        showModal('city-modal', 'city-modal--active')

        const cities = getFromLocalStorage('cities')
        deleteAllSelectedCitiesBtn.style.display = 'block'

        selectedCities = cities
        addCityToModal(selectedCities)

    })

    cityModalOverlay?.addEventListener('click', () => {
        hideModal('city-modal', 'city-modal--active')
        showProvinces(allCities)
        cityModalAcceptBtn.classList.replace('city-modal__accept--active', "city-modal__accept")
    })

    cityModalAcceptBtn?.addEventListener('click', () => {
        saveInLocalStorage('cities', selectedCities)
        // Get Cities ID's for Getting All Cities Post's From Server With CityID
        const citiesIDs = selectedCities.map(city => city.id).join('|')
        addParamToURL('cities', citiesIDs)
        getAndShowHeaderCityLocations()
        hideModal('city-modal', 'city-modal--active')
        showProvinces(allCities)
    })

    cityModalCancelBtn?.addEventListener('click', () => {
        hideModal('city-modal', 'city-modal--active')
        showProvinces(allCities)
        cityModalAcceptBtn.classList.replace('city-modal__accept--active', "city-modal__accept")
    })

    deleteAllSelectedCitiesBtn?.addEventListener('click', () => {
        selectedCities = []
        showProvinces(allCities)
        addCityToModal(selectedCities)
        deleteAllSelectedCitiesBtn.style.display = 'none'
        cityModalError.style.display = 'block'
    })

    cityModalSearchInput?.addEventListener('keyup', (event) => {
        const searchedCities = allCities.cities.filter(city => city.name.startsWith(event.target.value))
        console.log(searchedCities);

        if (event.target.value.trim() && searchedCities.length) {
            citiesModalList.innerHTML = ''

            searchedCities.forEach(city => {
                const isCitySelected = selectedCities.some(selectedCity => selectedCity.name === city.name)
                citiesModalList.insertAdjacentHTML('beforeend', `
                    <li class="city-modal__cities-item city-item" id="city-${city.id}">
                      <span>${city.name}</span>
                      <div id="checkboxShape" class="${isCitySelected && "active"}"></div>
                      <input id="city-item-checkbox" type="checkbox" checked="${isCitySelected}" onchange="cityItemClickHandler('${city.id}')"/>
                    </li>
                `)

            })

        } else if (event.target.value.trim() === "") {
            citiesModalList.innerHTML = ''
            showProvinces(allCities)

        } else {
            citiesModalList.innerHTML = '<div style="display: flex; align-items:center; justify-content: center; margin-top: 40px; font-size: 20px;">شهر مورد نظر یافت نشد :(</div>'
        }

    })


    //! Categories Modal

    headerCategoryBtn?.addEventListener('click', () => {
        showModal('header__category-menu', 'header__category-menu--active')
    })

    categoryModalOverlay?.addEventListener('click', () => {
        hideModal('header__category-menu', 'header__category-menu--active')
    })

    allModalCategoriesPosts?.addEventListener('click', () => {
        removeParamFromURL('categoryID')
    })


    //! Login Modal

    loginModalOverlay.addEventListener('click', () => {
        hideModal('login-modal', 'login-modal--active')
    })

    loginModalHeaderBtn.addEventListener('click', () => {
        hideModal('login-modal', 'login-modal--active')
    })

    submitPhoneNumberBtn.addEventListener('click', (event) => {
        event.preventDefault()
        submitPhoneNumber()
    })

    loginBtn.addEventListener('click', (event) => {
        event.preventDefault()
        verifyOTP()
    })

    reqNewCodeBtn.addEventListener('click', (event) => {
        event.preventDefault()
        requestNewOTP()
    })


    // Bind
    window.removeCityFromModal = removeCityFromModal
    window.cityItemClickHandler = cityItemClickHandler
    window.showActiveCategorySubs = showActiveCategorySubs

})