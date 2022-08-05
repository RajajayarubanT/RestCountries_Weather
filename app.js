
let result_container = document.querySelector('#result_container')

const API_KEY = "84f751899f1ce4d738e0225efb8b5c1c"
let weather_URL = "https://api.openweathermap.org/data/2.5/weather"
let resCountry_URL = "https://raw.githubusercontent.com/rvsp/restcountries-json-data/master/res-countries.json"
let resCountryImage_Url = "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/"


let createCard = (data, weather) => {

    let container = document.createElement('div')
    container.classList.add('col-lg-3', 'col-sm-12', 'm-4')

    let image = resCountryImage_Url + data.alpha2Code + '.svg'

    let _weather = ''

    let verify_weather = weather.cod != 400

    if (verify_weather) weather.weather.forEach(w => _weather += w.description + ' ')

    _weather.trim()



    container.innerHTML = `
        <div class="card" style="width:300px">
            <span class="card-header text-white bg-dark">${data.name}</span>
            <div class="card-body">
                <img class="card-img" src="${image}"
                    alt="Card image" style="width:100%">
            </div>
            <div class="card-body text-white">
                <p class="card-text">Capital: ${data.capital}</p>
                <p class="card-text">Regian: ${data.region}</p>
                <p class="card-text">Country Code: ${data.alpha3Code}</p>
                <p class="card-text">Lat Lng: ${data.latlng}</p>

                <div class="card-body" id='weather_details'>
                    <span class="card-text text-dark bg-warning pb-2 pt-2 pl-5 pr-5">Weather Details</span>
                    <p class="card-text mt-4">Weather: ${_weather}</p>
                    <p class="card-text">Temperature: ${verify_weather ? weather.main.temp : ''}°C</p>
                    <p class="card-text">Humidity: ${verify_weather ? weather.main.humidity : ''}%rh</p>
                    <p class="card-text">Pressure: ${verify_weather ? weather.main.pressure : ''}Pa</p>
                    <p class="card-text">Wind Speed: ${verify_weather ? weather.wind.speed : ''} Kmph</p>
                </div>  
                <button id='weather_btn'class="btn btn-outline-light">Click for Weather</button>
            </div>
            
        </div>
    `

    let weather_container = container.querySelector('#weather_details')
    let weather_btn = container.querySelector('#weather_btn')

    weather_btn.addEventListener('click', (e) => {
        weather_container.classList.toggle('weather_active')
    })

    return container
}

async function getCountryData() {
    let res = await fetch(resCountry_URL)

    res = await res.json()

    return res
}
async function getWeatherData(latlng) {

    // console.log(weather_URL + `?lat=${lat}&lon=${lng}&appid=${API_KEY}`);
    let URl = weather_URL + `?lat=${latlng[0]}&lon=${latlng[1]}&appid=${API_KEY}`
    let res = await fetch(URl)

    res = await res.json()

    return res

}

async function init() {

    let countryData = await getCountryData()

    if (!countryData.length) return
    countryData.forEach(async cunt => {

        let weatherData = await getWeatherData(cunt.latlng)


        let container = createCard(cunt, weatherData)

        result_container.appendChild(container)
    })


}

init()