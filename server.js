require('dotenv').config()
const express = require('express')
const cors = require("cors")
const app = express()

const photosRoutes = require('./routes/photos')

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port: ' + port);
});

// Routes
app.use('/photos', photosRoutes)
