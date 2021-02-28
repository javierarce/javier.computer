const onLoad = () => {
  loadJSON('./data/movies.json').then((data) => {
    console.log(data)
  })
}

const loadJSON = (name) => {
  return new Promise((resolve, reject) => {

    let xobj = new XMLHttpRequest()
    xobj.overrideMimeType("application/json")
    xobj.open('GET', name, true)

    xobj.onreadystatechange = () => {
      if (xobj.readyState == 4 && xobj.status == "200") {
        resolve(JSON.parse(xobj.responseText))
      }
    }

    xobj.send(null)
  })
}

window.onload = onLoad
