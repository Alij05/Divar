import { showSocialMedias } from "../../utils/shared.js";
import { addParamToURL, getParamFromURL, removeParamFromURL } from "../../utils/utils.js";


window.addEventListener('load', () => {
    showSocialMedias()

    const globalSearchInput = document.querySelector('#global_search_input')
    const removeSearchValueIcon = document.querySelector('#remove-search-value-icon')
    const searchValue = getParamFromURL('value')

    if (searchValue) {
        removeSearchValueIcon.style.display = 'block'
        globalSearchInput.value = searchValue
    }
    removeSearchValueIcon.addEventListener('click', () => {
        removeParamFromURL('value')
    })

    globalSearchInput?.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            if (event.target.value.trim()) {
                addParamToURL('value', event.target.value.trim())
            }
        }


    })


})