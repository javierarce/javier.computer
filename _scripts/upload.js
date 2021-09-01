'use strict'
require('dotenv').config()

const fs = require('fs')
const prettyBytes = require('pretty-bytes')
const sharp = require('sharp')

const path = require('path')
const AWS = require('aws-sdk')
const S3_ID = process.env.S3_ID
const S3_SECRET = process.env.S3_SECRET

const BUCKET_NAME = 'reading.systems'

const s3 = new AWS.S3({
  accessKeyId: S3_ID,
  secretAccessKey: S3_SECRET
})

const uploadFile = (fileName, ext) => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(fileName)

    const params = {
      Bucket: BUCKET_NAME,
      Key: path.basename(fileName),
      Body: fileContent,
      ContentType:`image/${ext}`
    }

    s3.upload(params, (error, data) => {
      if (error) {
        throw error
        reject(error)
      }
      resolve(data)
    })
  })
}

function start (directory) {
  fs.readdir(directory, (error, files) => {
    if (error) {
      retrurn
    }

    files.forEach((fileName) => {
      upload(`${directory}/${fileName}`)
    })
  }) 
}

async function upload (fileName) {
  let ext = path.extname(fileName)
  let name = path.basename(fileName).replace(ext, '')
  const inputBuffer = fs.readFileSync(fileName)
  const today = new Date()

  const prefix = `${today.getFullYear()}-${(today.getMonth() + 1)
  .toString()
  .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}-${name}`

  fs.renameSync(fileName, `${prefix}_original.jpg`)

  for (let res of [128, 640, 1280, 2880]) {
    const jpgOutputFilename = `${prefix}_${res}.jpg`
    const webpOutputFilename = `${prefix}_${res}.webp`

    await sharp(inputBuffer).resize(res).toFile(jpgOutputFilename)

    await sharp(inputBuffer).resize(res).toFile(webpOutputFilename)

    let jpg = await uploadFile(jpgOutputFilename, 'jpg')
    let webp = await uploadFile(webpOutputFilename, 'webp')

    if (jpg && webp) {
      console.log(
        `${res}x webp ${prettyBytes(
          fs.readFileSync(webpOutputFilename).byteLength
        )}`
      )

      console.log(
        `${res}x jpg ${prettyBytes(
          fs.readFileSync(jpgOutputFilename).byteLength
        )}`
      )
    }
  }
}

if (process.argv.length !== 3) {
  console.error('usage: node upload.js directory')
  process.exit(0)
}

start(process.argv[2])
