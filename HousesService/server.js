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

// ROUTES
app.use("/houses", require("./routes/room-route"))
app.use("/rooms", require("./routes/device-route"))
app.use("/devices", require("./routes/house-root"))

app.listen(port, () => console.log(`Server up and running on port ${port} !`))
