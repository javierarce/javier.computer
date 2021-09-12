const CITY = 'Madrid'
const COORDINATES='40.416729,-3.703339'
const WEATHER_ENDPOINT = `//last.javierarce.com/api/weather?coordinates=${COORDINATES}`

class Weather extends HTMLParagraphElement {
  constructor () {
    super()
  }

  connectedCallback () {
    this.get()
  }

  get () {
    const headers = { 'Content-Type': 'application/json' }
    const method = 'GET'
    const options = { method, headers }

    fetch(WEATHER_ENDPOINT).then(response => response.json()).then((json) => {
      if (json.error) {
        return console.error(json)
      }

      let weather = json.weather.current
      let description = this.capitalizeFirstLetter(weather.description)
      let uvi = weather.uvi
      let temperature = weather.temp
      let feelsLike = weather.feels_like
      let humidity = weather.humidity
      let sunset = new Date(weather.sunset).toLocaleTimeString()

      this.weatherDescription = `${description}. The temperature in ${CITY} is ${temperature}ºC (feels like ${feelsLike}ºC). UVI: ${uvi}. Humidity: ${humidity}%. Sunset time is ${sunset}.`
      this.render(this.weatherDescription)

    }).catch((error) => {
      console.error(error)
    })
  }

  render (description) {
    const text = document.createElement('span')
    text.textContent = description
    let shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(text)
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

customElements.define('weather-description', Weather, { extends: 'p' })
