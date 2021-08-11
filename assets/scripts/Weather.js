const WEATHER_ENDPOINT = '//last.javierarce.com/api/weather'

class Weather {
  constructor () {
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

    let description = json.weather[0].description
    let temperature = json.main.temp
    let feelsLike = json.main.feels_like
    let humidity = json.main.humidity
    let sunset = new Date(json.sys.sunset).toLocaleTimeString()

    let weatherDescription = `${description}. The temperature in Madrid is ${temperature}ºC (feels like ${feelsLike}ºC). Humidity: ${humidity}%. Sunset time is ${sunset}.`
      console.log(weatherDescription)

    }).catch((error) => {
      console.error(error)
    })
  }
}
