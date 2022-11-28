const express = require('express')
const {
    importPhotos,
} = require('../controllers/importController')
const router = express.Router()

router.get("/", importPhotos)

module.exports = router