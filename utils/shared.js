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
                <img src="${social.icon}" alt="${social.name}" width="18px" height="18px" class="sidebar__icon bi bi-twitter">
            </a>
            `)
    })

}



export {
    baseUrl,
    getAllCities,
    showSocialMedias,
}