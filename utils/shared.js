import { getFromLocalStorage, getMe, getParamFromURL, getToken, isLogin, saveInLocalStorage, showModal } from "./utils.js"

const baseUrl = "https://divarapi.liara.run"


const getAllCities = async () => {
  const res = await fetch(`${baseUrl}/v1/location`)
  const cities = await res.json()

  return cities
}


const getAllLocations = async () => {
  const res = await fetch(`${baseUrl}/v1/location`)
  const response = await res.json()

  return response.data
}


const showSocialMedias = async () => {
  const footerSocialMedia = document.querySelector('#footer__social-media')

  const res = await fetch(`${baseUrl}/v1/social`)
  const socialMedias = await res.json()

  socialMedias.data.socials.forEach(social => {
    footerSocialMedia?.insertAdjacentHTML('beforeend', `
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

  if (headerCityTitle) {
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

}


const getPostDetails = async () => {
  const postID = getParamFromURL('id')
  const token = getToken()

  // Fix the Backend Bug
  let headers = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(`${baseUrl}/v1/post/${postID}`, {
    headers
  })

  const response = await res.json()

  return response.data.post
}


const showUserPanelLinks = async () => {
  const headerDropdownMenu = document.querySelector('.header_dropdown_menu')
  headerDropdownMenu.innerHTML = ''

  const isUserLogin = await isLogin()
  const user = await getMe()

  if (headerDropdownMenu) {
    if (isUserLogin) {
      headerDropdownMenu.insertAdjacentHTML('beforeend', `
              <li class="header__left-dropdown-item header_dropdown-item_account">
                <a
                  href="/pages/userPanel/posts.html"
                  class="header__left-dropdown-link login_dropdown_link"
                >
                  <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                  <div>
                    <span>کاربر دیوار </span>
                    <p>تلفن ${user.phone}</p>
                  </div>
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="/pages/userPanel/verify.html">
                  <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                  تایید هویت
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="/pages/userPanel/bookmarks.html">
                  <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                  نشان ها
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="/pages/userPanel/notes.html">
                  <i class="header__left-dropdown-icon bi bi-journal"></i>
                  یادداشت ها
                </a>
              </li>
              <li class="header__left-dropdown-item logout-link" id="login_btn">
                <p class="header__left-dropdown-link" href="#">
                  <i class="header__left-dropdown-icon bi bi-shop"></i>
                  خروج
                </p>
              </li>
          
            `)
    } else {
      headerDropdownMenu.insertAdjacentHTML('beforeend', `
              <li class="header__left-dropdown-item">
                <span id="login-btn" class="header__left-dropdown-link login_dropdown_link">
                  <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                  ورود
                </span>
              </li>
              <li class="header__left-dropdown-item">
                <div class="header__left-dropdown-link" href="#">
                  <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                  نشان ها
                </div>
              </li>
              <li class="header__left-dropdown-item">
                <div class="header__left-dropdown-link" href="#">
                  <i class="header__left-dropdown-icon bi bi-journal"></i>
                  یادداشت ها
                </div>
              </li>
              <li class="header__left-dropdown-item">
                <div class="header__left-dropdown-link" href="#">
                  <i class="header__left-dropdown-icon bi bi-clock-history"></i>
                  بازدید های اخیر
                </div>
              </li>

            `)

      headerDropdownMenu.addEventListener('click', () => {
        showModal('login-modal', 'login-modal--active')
      })

    }
  }

}


const getSupportCategoriesArticles = async () => {
  const res = await fetch(`${baseUrl}/v1/support/category-articles`)
  const response = await res.json()

  return response.data.categories
}


const getArticleDetails = async () => {
  const articleID = getParamFromURL('id')

  const res = await fetch(`${baseUrl}/v1/support/articles/${articleID}`)
  const response = await res.json()

  return response.data.article

}


const getAllArticlesOfCategory = async (categoryID) => {
  const res = await fetch(`${baseUrl}/v1/support/categories/${categoryID}/articles`)
  const response = await res.json()

  return response.data.articles
}


const getArticles = async () => {
  const res = await fetch(`${baseUrl}/v1/support/category-articles`)
  const response = await res.json()

  return response.data.categories

}


const getAllArticles = async () => {
  const res = await fetch(`${baseUrl}/v1/support/articles`)
  const response = await res.json()

  return response.data.articles
}


const searchKeyonAllArticles = async (key) => {
  const res = await fetch(`${baseUrl}/v1/support/articles/search?s=${key}`)
  const response = await res.json()

  return response.data.articles
}


const getAllCategories = async () => {
  const res = await fetch(`${baseUrl}/v1/category`)
  const response = await res.json()

  return response.data.categories
}


const getSubSubCategoryByID = async (categoryID) => {
  const res = await fetch(`${baseUrl}/v1/category/sub/${categoryID}`)
  const response = await res.json()

  return response.data.category
}



export {
  baseUrl,
  getAllCities,
  getAllLocations,
  showSocialMedias,
  getPosts,
  getCategories,
  getAndShowHeaderCityLocations,
  getPostDetails,
  showUserPanelLinks,
  getSupportCategoriesArticles,
  getArticleDetails,
  getAllArticlesOfCategory,
  getArticles,
  getAllArticles,
  searchKeyonAllArticles,
  getAllCategories,
  getSubSubCategoryByID,
}