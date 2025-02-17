import { getAllCities } from "../../utils/shared.js";
import { getFromLocalStorage, saveInLocalStorage } from "../../utils/utils.js";


let cities = null
let searchedCitites = null


window.addEventListener("load", () => {
  const loadingContainer = document.querySelector('#loading-container')
  const searchInput = document.querySelector('#search-input')

  // let isCitySelected = getFromLocalStorage('city')
  // console.log(isCitySelected);
  // if (isCitySelected) {
  //   location.href = './pages/posts.html'
  // }


  getAllCities().then((response) => {
    cities = response.data.cities

    // Website Loader
    loadingContainer.style.display = 'none'

    const popularCitiesContainer = document.querySelector("#popular-cities");
    const popularCities = response.data.cities.filter((city) => city.popular);


    popularCities.forEach((city) => {
      popularCitiesContainer.insertAdjacentHTML("beforeend", `
        <li class="main__cities-item" onclick="cityClickHandler('${city.name}', ${city.id})">
            <p  class="main__cities-link">${city.name}</p>
        </li>
      `
      )
    })

  })

  // City Search
  searchInput.addEventListener('keyup', (event) => {
    searchedCitites = [...cities].filter(city => city.name.startsWith(event.target.value))
    searchCity(event)
  })


})



const searchCity = (event) => {
  const searchResultCitiesList = document.querySelector('#search-result-cities')

  if (event.target.value === '') {
    searchResultCitiesList.classList.remove('active')
  } else {
    searchResultCitiesList.classList.add('active')
  }

  searchResultCitiesList.innerHTML = ''
  if (searchedCitites.length) {
    searchedCitites.forEach(city => {
      if (city.name.startsWith(event.target.value)) {
        searchResultCitiesList.insertAdjacentHTML('beforeend', `
          <li onclick="cityClickHandler('${city.name}', ${city.id})">${city.name}</li>
          `)
      }

    })
  } else {
    searchResultCitiesList.insertAdjacentHTML('beforeend', `
      <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg"></img>
      <p>شهر مورد نظر یافت نشد</p>
      `)
  }

}


const cityClickHandler = (cityName, cityID) => {
  saveInLocalStorage('cities', [{ name: cityName, id: cityID }])
  location.href = './pages/posts.html'
}






// Bind
window.cityClickHandler = cityClickHandler