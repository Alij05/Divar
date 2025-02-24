import { getParamFromURL } from "./utils.js"

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
    const categoryID = getParamFromURL('categoryID')
    let url = `${baseUrl}/v1/post/?city=${citiesIDs}`;

    if (categoryID) {
        url += `&categoryId=${categoryID}`
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


export {
    baseUrl,
    getAllCities,
    showSocialMedias,
    getPosts,
    getCategories,
}