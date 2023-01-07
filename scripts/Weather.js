class Weather extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback () {
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

    const music = document.createElement('music-snitch')
    music.dataset.username = 'javierarce'
    music.dataset.key = '78b4ae34c84de1d5fc6510338300bd78'

    let shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(text)
    shadow.appendChild(music)

    this.classList.add('is-visible')
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

customElements.define('weather-snitch', Weather)
