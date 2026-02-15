const https = require('https')

class GeoCoder {
  constructor(location) {
    this.location = location
    this.apiUrlSearch = `https://geocode.maps.co/search?q=${encodeURIComponent(this.location)}&api_key=${process.env.GEOCODE_API_KEY}`
  }

  formatYAML(result) {
    return `
---
layout: place
pid: "${result.permalink}"
title: "${result.title || this.location}"
description: "${result.description || this.location}"
address: "${result.address}"
latlng: 
  - ${result.latlng[0]}
  - ${result.latlng[1]}
location: "${result.location}"
---`
}

  getGeoCode() {
    https.get(this.apiUrlSearch, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        const jsonData = JSON.parse(data)

        jsonData.forEach((result) => {
          setTimeout(() => {
            this.getReverseGeoCode(result)
          }, 4000)
        })
      })

    }).on("error", (err) => {
      console.log("Error: " + err.message)
    })
  }

  getReverseGeoCode(location) {
    console.log('GeoCoding: ', location)
    const apiUrlReverse = `https://geocode.maps.co/reverse?lat=${location.lat}&lon=${location.lon}&api_key=${process.env.GEOCODE_API_KEY}`

    https.get(apiUrlReverse, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        const result = JSON.parse(data)
        const address = [result.address.road, result.address.house_number,  result.address.neighbourhood, result.address.city_district].filter(Boolean).join(', ')

        const amenity = result.address.amenity
        const permalink = amenity ? amenity.toLowerCase().replace(/ /g, '-'): this.location.toLowerCase().replace(/ /g, '-')

        const city = address.city ? address.city.toLowerCase() : ''

        const formattedResult = {
          title: amenity,
          permalink,
          description: amenity,
          address,
          latlng: [result.lat, result.lon],
          location: city
        }

        console.log(this.formatYAML(formattedResult))
      })

    }).on("error", (err) => {
      console.log("Error: " + err.message)
    })
  }
}

const locationString = process.argv.slice(2).join(" ")
const geoCoder = new GeoCoder(locationString)
geoCoder.getGeoCode()
