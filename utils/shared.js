import { getFromLocalStorage, getParamFromURL, saveInLocalStorage } from "./utils.js"

const baseUrl = "https://divarapi.liara.run"


const getAllCities = async () => {
    const res = await fetch(`${baseUrl}/v1/location`)
    const cities = await res.json()

    return cities
}


const showSocialMedias = async () => {
    const footerSocialMedia = document.querySelector('#footer__social-media')

    const res = await fetch(`${baseUrl}/v1/social`)
    const socialMedias = await res.json()

    socialMedias.data.socials.forEach(social => {
        footerSocialMedia.insertAdjacentHTML('beforeend', `
            <a href="${social.link}" class="sidebar__icon-link">
                <img src="${baseUrl}/${social.icon.path}" alt="${social.name}" width="18px" height="18px" class="sidebar__icon bi bi-twitter">
            </a>
            `)
    })

}


const getPosts = async (citiesIDs) => {
    let url = `${baseUrl}/v1/post/?city=${citiesIDs}`;
    const categoryID = getParamFromURL('categoryID')
    const searchValue = getParamFromURL('search')

    if (categoryID) {
        url += `&categoryId=${categoryID}`
    }

    if (searchValue) {
        url += `&search=${searchValue}`
    }

    const res = await fetch(url)
    const posts = await res.json()

    return posts
}


const getCategories = async () => {
    const res = await fetch(`${baseUrl}/v1/category`)
    const categories = await res.json()

    return categories
}


const getAndShowHeaderCityLocations = () => {
    const headerCityTitle = document.querySelector('#header-city-title')

    const cities = getFromLocalStorage('cities')
    // Default City
    if (!cities.length) {
        saveInLocalStorage('cities', [{ name: 'تهران', id: 301 }])
    } else {
        if (cities.length === 1) {
            headerCityTitle.innerHTML = cities[0].name;

        } else {
            headerCityTitle.innerHTML = `${cities.length} شهر`;
        }
    }

}


const addCityToModal = (selectedCities) => {
    const modalSelectedCitiesCotainer = document.querySelector('#city-selected')
    modalSelectedCitiesCotainer.innerHTML = ''

    selectedCities.forEach(city => {
        console.log(city.name);
        modalSelectedCitiesCotainer.insertAdjacentHTML('beforeend', `
            <div class="city-modal__selected-item">
                <span class="city-modal__selected-text">${city.name}</span>
                <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}', ${selectedCities})">
                  <i class="city-modal__selected-icon bi bi-x"></i>
                </button>
            </div>
            `)

    })
}


const removeCityFromModal = (cityID, selectedCities) => {
    selectedCities = selectedCities.filter(city => city.id === cityID)

    addCityToModal(selectedCities)

}


export {
    baseUrl,
    getAllCities,
    showSocialMedias,
    getPosts,
    getCategories,
    getAndShowHeaderCityLocations,
    addCityToModal,
}