class Weather extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.getWeatherFor(USER_LOCATION.city, USER_LOCATION.coordinates);
  }

  getWeatherFor(city, coordinates) {
    const WEATHER_ENDPOINT = `https://api.javier.computer/api/weather?coordinates=${coordinates}`;

    fetch(WEATHER_ENDPOINT)
      .then((response) => response.json())
      .then((weather) => {
        if (weather.error) {
          return console.error(weather);
        }

        const description = this.capitalizeFirstLetter(
          weather.weather[0].description,
        );

        const temperature = weather.main.temp;
        const feelsLike = weather.main.feels_like;
        const humidity = weather.main.humidity;
        const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString(
          ["en-US"],
          { hour: "2-digit", minute: "2-digit" },
        );

        let parts = [description];
        parts.push(
          `The temperature in ${city} is ${temperature}ºC (feels like ${feelsLike}ºC)`,
        );

        parts.push(`Humidity: ${humidity}%`);
        parts.push(`Sunset time is ${sunset}.`);

        this.weatherDescription = parts.join(". ");
        this.render(this.weatherDescription);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render(description) {
    const text = document.createElement("span");
    text.textContent = description;

    let shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(text);
    this.classList.add("is-visible");
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

customElements.define("weather-snitch", Weather);
