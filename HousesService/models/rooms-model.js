const mongoose = require("mongoose")

const RoomSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String },
    houseId: { type: String },
   
    
  },
  {
    timestamps: { currentTime: () => Date.now() },
  }
  
)

module.exports = mongoose.model("Room", RoomSchema)
