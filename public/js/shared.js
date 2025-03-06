import { getAllLocations, getAndShowHeaderCityLocations, showSocialMedias } from "../../utils/shared.js";
import { addParamToURL, getFromLocalStorage, getParamFromURL, hideModal, removeParamFromURL, saveInLocalStorage, showModal } from "../../utils/utils.js";


window.addEventListener('load', () => {
    showSocialMedias()
    getAndShowHeaderCityLocations()


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


    let selectedCities = []
    let allCities = []

    const searchValue = getParamFromURL('search')

    if (searchValue) {
        removeSearchValueIcon.style.display = 'block'
        globalSearchInput.value = searchValue
    }

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
    globalSearchInput.addEventListener('focus', () => {
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

    searchbarModalOverlay.addEventListener('click', () => {
        hideModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')
        mostSearchedList.innerHTML = ''
    })


    // Handle City Modal 
    headerCityContainer.addEventListener('click', (event) => {
        showModal('city-modal', 'city-modal--active')

        const cities = getFromLocalStorage('cities')
        deleteAllSelectedCitiesBtn.style.display = 'block'

        selectedCities = cities
        addCityToModal(selectedCities)

    })

    const addCityToModal = (selectedCities) => {
        const modalSelectedCitiesCotainer = document.querySelector('#city-selected')
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


    const showProvinces = (cities) => {
        const citiesModalList = document.querySelector('#city_modal_list')
        citiesModalList.innerHTML = ''

        cities.provinces.forEach(province => {
            citiesModalList.insertAdjacentHTML('beforeend', `
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
                    <li class="city-modal__cities-item select-all-city city-item">
                      <span>همه شهر های ${provinceName} </span>
                      <div id="checkboxShape"></div>
                      <input type="checkbox" />
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
        const checkboxShapeElement = cityElement.querySelector('div')

        checkboxShapeElement.classList.remove('active')
        selectedCities = selectedCities.filter(city => city.id !== cityID)
        addCityToModal(selectedCities)
        toggleCityModalBtns(selectedCities)

    }



//! Events

    cityModalOverlay.addEventListener('click', () => {
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


    // Bind
    window.removeCityFromModal = removeCityFromModal
    window.cityItemClickHandler = cityItemClickHandler

})