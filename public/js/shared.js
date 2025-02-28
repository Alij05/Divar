import { getAndShowHeaderCityLocations, showSocialMedias } from "../../utils/shared.js";
import { addParamToURL, getFromLocalStorage, getParamFromURL, hideModal, removeParamFromURL, showModal } from "../../utils/utils.js";


window.addEventListener('load', () => {
    showSocialMedias()
    getAndShowHeaderCityLocations()


    const globalSearchInput = document.querySelector('#global_search_input')
    const removeSearchValueIcon = document.querySelector('#remove-search-value-icon')
    const searchbarModalOverlay = document.querySelector(".searchbar__modal-overlay")
    const mostSearchedList = document.querySelector('#most_searched')
    const headerCityContainer = document.querySelector('.header__city')
    const cityModalOverlay = document.querySelector('.city-modal__overlay')

    let selectedCities = []

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
        const deleteCitiesBtn = document.querySelector('#delete-all-cities')
        deleteCitiesBtn.style.display = 'block'

        selectedCities = cities
        addCityToModal(selectedCities)

    })

    const addCityToModal = (selectedCities) => {
        const modalSelectedCitiesCotainer = document.querySelector('#city-selected')
        modalSelectedCitiesCotainer.innerHTML = ''

        selectedCities.forEach(city => {
            console.log(city.name);
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


    const removeCityFromModal = (cityID) => {
        // selectedCities = selectedCities.filter(city => city.id === cityID)
        // addCityToModal(selectedCities)
        console.log('Remove');
        

    }


    cityModalOverlay.addEventListener('click', () => {
        hideModal('city-modal', 'city-modal--active')
    })




    // Bind
    window.removeCityFromModal = removeCityFromModal

})