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


export {
    saveInLocalStorage,
    getFromLocalStorage,
    addParamToURL,
}