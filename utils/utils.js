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



export {
    saveInLocalStorage,
    getFromLocalStorage,
    addParamToURL,
    removeParamFromURL,
    getParamFromURL,
    calculateRelativeTimeDifference,
}