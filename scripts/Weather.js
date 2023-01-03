class Weather extends HTMLParagraphElement {
  constructor () {
    super()
  }

  connectedCallback () {
    this.get()
  }

  get () {
    fetch('/location.json').then(response => response.json()).then((json) => {
      this.getWeatherFor(json.city, json.coordinates)
    })
  }

  getWeatherFor (city, coordinates) {
    const WEATHER_ENDPOINT = `https://last.javierarce.com/api/weather?coordinates=${coordinates}`

    fetch(WEATHER_ENDPOINT).then(response => response.json()).then((json) => {
      if (json.error) {
        return console.error(json)
      }

      const weather = json.current
      const description = this.capitalizeFirstLetter(weather.weather[0].description)
      const uvi = weather.uvi
      const temperature = weather.temp
      const feelsLike = weather.feels_like
      const humidity = weather.humidity
      const sunset = new Date(weather.sunset * 1000).toLocaleTimeString()

      this.weatherDescription = `${description}. The temperature in ${city} is ${temperature}ºC (feels like ${feelsLike}ºC). UVI: ${uvi}. Humidity: ${humidity}%. Sunset time is ${sunset}.`
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

    this.classList.add('is-visible')
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

customElements.define('weather-description', Weather, { extends: 'p' })
