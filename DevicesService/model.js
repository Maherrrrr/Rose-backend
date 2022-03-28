const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String },
    infraredCodes: [
      {
        function: String,
        value: String,
      },
    ],
    roomId: { type: String },
  },
  {
    timestamps: { currentTime: () => Date.now() },
  }
);

module.exports = mongoose.model("Device", DeviceSchema);
