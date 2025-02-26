import { showSocialMedias } from "../../utils/shared.js";
import { addParamToURL, getParamFromURL, hideModal, removeParamFromURL, showModal } from "../../utils/utils.js";


window.addEventListener('load', () => {
    showSocialMedias()

    const globalSearchInput = document.querySelector('#global_search_input')
    const removeSearchValueIcon = document.querySelector('#remove-search-value-icon')
    const searchbarModalOverlay = document.querySelector(".searchbar__modal-overlay")
    const mostSearchedList = document.querySelector('#most_searched')

    const searchValue = getParamFromURL('search')

    if (searchValue) {
        removeSearchValueIcon.style.display = 'block'
        globalSearchInput.value = searchValue
    }

    removeSearchValueIcon.addEventListener('click', () => {
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


})