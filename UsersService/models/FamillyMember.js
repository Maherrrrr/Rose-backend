const mongoose = require("mongoose");

const FamillyMemberSchema = new mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    birthdate: { type: Date },
    gender: { type: String },
    pictureId: { type: String },
    isVerified: { type: Boolean },
    role: { 
      type: String, 
      enum: {
        values: ['ROLE_PARENT', 'ROLE_CHILD', 'ROLE_OTHER'],
        message: '{VALUE} is not supported'
      }
    },
    houseId: { type: String },
  },
  {
    timestamps: { currentTime: () => Date.now() },
  }
);
module.exports = mongoose.model("FamillyMember", FamillyMemberSchema);
