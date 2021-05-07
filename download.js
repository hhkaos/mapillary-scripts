'use strict'

const parse = require('parse-link-header')
const config = require('./config.json')
const axios = require('axios')
const fs = require('fs')

const output = { type: 'FeatureCollection', features: [] }

let pageCounter = 1

const writeResponse = function () {
  const outputFilename =`downloads/images_downloaded_${Date.now()}.json`
  fs.writeFile(outputFilename, JSON.stringify(output, null, 2), err => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Download finished: ${output.features.length} photos`)
  })
}

const loadPage = function (url) {
  axios.get(url)
  .then(function (response) {
    output.features = output.features.concat(response.data.features)
    console.log(`Page ${pageCounter} received`)
    pageCounter++


    if (response.headers.link) {
      const parsed = parse(response.headers.link)
      if (parsed.next) {
        loadPage(parsed.next.url)
      } else {
        writeResponse()
      }
    } else {
      console.log('No link header')
    }
  })
  .catch(function (error) {
    console.log(error)
  })
}

const u = new URLSearchParams({
  client_id: config.client_id,
  // bbox: "-2.480185,36.835700,-2.424809,36.862369",
  bbox: '-2.487948,36.814208,-2.405207,36.87273',
  pano: true
}).toString()

loadPage(`https://a.mapillary.com/v3/images?${u}`)
