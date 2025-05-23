import { baseUrl } from "./shared.js"


const saveInLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

const getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

const addParamToURL = (param, value) => {
    const url = new URL(location.href)
    const searchParams = url.searchParams

    searchParams.set(param, value)
    url.search = searchParams.toString()

    location.href = url.toString()
}

const removeParamFromURL = (param) => {
    const url = new URL(location.href)
    const searchParams = url.searchParams

    searchParams.delete(param)
    window.history.replaceState(null, null, url)

    location.reload()
}

const getParamFromURL = (param) => {
    const urlParams = new URLSearchParams(location.search)
    return urlParams.get(param)
}

const calculateRelativeTimeDifference = (createdAt) => {
    let currentTime = new Date();
    let createdTime = new Date(createdAt);

    const timeDifference = currentTime - createdTime;
    const minutes = Math.floor(timeDifference / (60 * 1000));
    const hours = Math.floor(timeDifference / (60 * 60 * 1000));
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const weeks = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
    const months = Math.floor(timeDifference / (30 * 24 * 60 * 60 * 1000));
    const years = Math.floor(timeDifference / (365 * 24 * 60 * 60 * 1000));

    if (minutes < 60) {
        return `${minutes} دقیقه پیش`;
    } else if (hours < 24) {
        return `${hours} ساعت پیش`;
    } else if (days < 7) {
        return `${days} روز پیش`;
    } else if (weeks < 4) {
        return `${weeks} هفته پیش`;
    } else if (months < 12) {
        return `${months} ماه پیش`;
    } else {
        return `${years} سال پیش`;
    }
}

const showModal = (id, className) => {
    const element = document.querySelector(`#${id}`)
    element.classList.add(className)

}

const hideModal = (id, className) => {
    const element = document.querySelector(`#${id}`)
    element.classList.remove(className)

}

const showSwal = (title, icon, buttons, callback) => {
    swal({
        title,
        icon,
        buttons
    }).then((result) => {
        callback(result)
    })
}

const getToken = () => {
    const token = getFromLocalStorage('token')
    return token
}

const isLogin = async () => {
    const token = getToken()

    if (!token) {
        return false
    }

    const res = await fetch(`${baseUrl}/v1/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.status === 200 ? true : false
}

const getMe = async () => {
    const token = getToken()

    if (!token) {
        return false
    }

    const res = await fetch(`${baseUrl}/v1/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const response = await res.json()

    return response.data.user

}

const pagination = (href, paginationContainer, currentPage, totalItems, itemsPerPage) => {
    paginationContainer.innerHTML = ''
    const pagesCount = Math.ceil(totalItems / itemsPerPage)


    for (let i = 1; i <= pagesCount; i++) {
        paginationContainer.insertAdjacentHTML('beforeend', `
            <li class="${i === Number(currentPage) ? "active" : ""}">
              <a href="${href.includes('?') ? `${href}&page=${i}` : `${href}?page=${i}`}">${i}</a>
            </li>
            `)
    }

}


export {
    saveInLocalStorage,
    getFromLocalStorage,
    addParamToURL,
    removeParamFromURL,
    getParamFromURL,
    calculateRelativeTimeDifference,
    showModal,
    hideModal,
    showSwal,
    getToken,
    isLogin,
    getMe,
    pagination,
}