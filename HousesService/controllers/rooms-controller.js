let Room = require("../models/rooms-model");

exports.get = async (req, res) => {
  res.send({ room: await Room.findById(req.body._id) });
};

exports.getAll = async (req, res) => {
  res.send({ rooms: await Room.find() });
};

exports.add = async (req, res) => {
  const { name, type } = req.body;
  let room = await new Room({ name: name, type: type }).save();
  return res.send({ message: "Room added successfully", room });
};

exports.update = async (req, res) => {
  const { _id, name, type } = req.body;
  let room = await Room.findById(_id);
  if (room) {
    await room.update({ $set: { name: name, type: type } });
    return res.send({ message: "Room updated successfully" });
  } else {
    return res.send({ message: "Room does not exist" });
  }
};

exports.delete = async (req, res) => {
  let room = await Room.findById(req.body._id);
  if (room) {
    await room.remove();
    return res.send({ message: "Rooms" + room._id + " have been deleted" });
  } else {
    return res.send({ message: "Room does not exist" });
  }
};

exports.deleteAll = async (req, res) => {
  await Room.remove({});
  res.send({ message: "All rooms have been deleted" });
};
