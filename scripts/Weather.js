class Weather extends HTMLElement {
  constructor () {
    super()
  }

    connectedCallback () {
        this.getWeatherFor(USER_LOCATION.city, USER_LOCATION.coordinates)
    }

  getWeatherFor (city, coordinates) {
    const WEATHER_ENDPOINT = `https://api.javier.computer/api/weather?coordinates=${coordinates}`

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
      const sunset = new Date(weather.sunset * 1000).toLocaleTimeString().substring(0,5)

      let parts = [description]
      parts.push(`The temperature in ${city} is ${temperature}ºC (feels like ${feelsLike}ºC)`)
      if (uvi > 2) {
        parts.push(`UVI: ${uvi}`)
      }
      parts.push(`Humidity: ${humidity}%`)
      parts.push(`Sunset time is ${sunset}.`)

      this.weatherDescription = parts.join('. ')
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

customElements.define('weather-snitch', Weather)
