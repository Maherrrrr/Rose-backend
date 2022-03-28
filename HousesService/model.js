const mongoose = require("mongoose")

const HouseSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String },
    rooms: { type: [String] }
  },
  {
    timestamps: { currentTime: () => Date.now() },
  }
)

module.exports = mongoose.model("House", HouseSchema)
