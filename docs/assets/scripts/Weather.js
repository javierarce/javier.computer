const WEATHER_ENDPOINT = '//last.javierarce.com/api/weather'

class Weather extends HTMLParagraphElement {
  constructor () {
    super()

    if (this.weatherDescription) {
      this.render(this.weatherDescription)
    } else {
      this.get()
    }
  }

  get () {
    const headers = { 'Content-Type': 'application/json' }
    const method = 'GET'
    const options = { method, headers }

    fetch(WEATHER_ENDPOINT).then(response => response.json()).then((json) => {
      if (json.error) {
        return console.error(json)
      }

      let description = json.weather[0].description
      let temperature = json.main.temp
      let feelsLike = json.main.feels_like
      let humidity = json.main.humidity
      let sunset = new Date(json.sys.sunset).toLocaleTimeString()

      this.weatherDescription = `${description}. The temperature in Madrid is ${temperature}ºC (feels like ${feelsLike}ºC). Humidity: ${humidity}%. Sunset time is ${sunset}.`

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
}

customElements.define('weather-description', Weather, { extends: 'p' })
