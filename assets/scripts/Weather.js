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

      console.log(response)

    }).catch((error) => {
      console.error(error)
    })
  }
}
