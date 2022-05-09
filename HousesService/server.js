require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()
const port = process.env.PORT || 6000
const controller = require("./controllers/houses-controller")

// database
mongoose.Promise = global.Promise
mongoose
  .connect(process.env.MONGODB_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected")
    },
    (err) => {
      console.log("Database connection error", err)
    }
  )

// middlewares
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:6000',
      description: 'Development server',
    },
  ],
  
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['server.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// ROUTES
app.use("/houses", require("./routes/house-root"))
app.use("/rooms", require("./routes/room-route"))
app.use("/devices", require("./routes/device-route"))


app.listen(port, () => console.log(`Server up and running on port ${port} !`))
