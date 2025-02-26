import { showSocialMedias } from "../../utils/shared.js";
import { addParamToURL, getParamFromURL, hideModal, removeParamFromURL, showModal } from "../../utils/utils.js";


window.addEventListener('load', () => {
    showSocialMedias()

    const globalSearchInput = document.querySelector('#global_search_input')
    const removeSearchValueIcon = document.querySelector('#remove-search-value-icon')
    const searchbarModalOverlay = document.querySelector(".searchbar__modal-overlay")
    const mostSearchedList = document.querySelector('#most_searched')
    const minPriceSelectbox = document.querySelector('#min-price-selectbox')
    const maxPriceSelectbox = document.querySelector('#max-price-selectbox')

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


    // Handle Min Price and Max Price Filtering 
    const amounts = [
        { value: 10000, label: "10 هزار" },
        { value: 50000, label: "50 هزار" },
        { value: 200000, label: "200 هزار" },
        { value: 500000, label: "500 هزار" },
        { value: 1000000, label: "1 میلیون" },
        { value: 5000000, label: "5 میلیون" },
        { value: 10000000, label: "10 میلیون" },
        { value: 20000000, label: "20 میلیون" },
        { value: 50000000, label: "50 میلیون" },
        { value: 100000000, label: "100 میلیون" },
        { value: 150000000, label: "150 میلیون" },
        { value: 200000000, label: "200 میلیون" }
    ];
    let minPrice = 0
    let maxPrice = 0
    

    minPriceSelectbox.addEventListener('change', (event) => {
        minPrice = event.target.value
        showMaxPriceOptions(minPrice)

    })

    maxPriceSelectbox.addEventListener('change', (event) => {
        maxPrice = event.target.value
        showMinPriceOptions(maxPrice)
    })



    //! Functions
    const showMinPriceOptions = (maxPrice) => {
        if(!minPrice) {
            minPriceSelectbox.innerHTML = ''
    
            const filteredPriceOptions = amounts.filter(amount => amount.value <= maxPrice)
            filteredPriceOptions.forEach(amount => {
                minPriceSelectbox.insertAdjacentHTML('beforeend', `
                    <option value="${amount.value}">${amount.label}</option>
                    `)
    
            })
        }
    }

    const showMaxPriceOptions = (minPrice) => {
        if(!maxPrice) {
            maxPriceSelectbox.innerHTML = ''
    
            const filteredPriceOptions = amounts.filter(amount => amount.value >= minPrice)
            filteredPriceOptions.forEach(amount => {
                maxPriceSelectbox.insertAdjacentHTML('beforeend', `
                    <option value="${amount.value}">${amount.label}</option>
                    `)
            })
        }

        }


})