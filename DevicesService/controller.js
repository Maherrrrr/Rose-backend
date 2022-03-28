let Device = require("./model");

exports.get = async (req, res) => {
  res.send({ device: await Device.findById(req.body._id) });
};

exports.getAll = async (req, res) => {
  res.send({ devices: await Device.find() });
};

exports.add = async (req, res) => {
  const { name, type } = req.body;
  let device = await new Device({ name: name, type: type }).save();
  return res.send({ message: "Device added successfully", device });
};

exports.addCode = async (req, res) => {
  const { _id, infraredCodes } = req.body;
  let device = await Device.findById(_id);
  if (device) {
    console.log(infraredCodes);
    await device.update({ $push: { infraredCodes: infraredCodes } });
    return res.send({ message: "Infrared code added successfully" });
  } else {
    return res.send({ message: "Device does not exist" });
  }
};

exports.update = async (req, res) => {
  const { _id, name, type } = req.body;
  let device = await Device.findById(_id);
  if (device) {
    await device.update({ $set: { name: name, type: type } });
    return res.send({ message: "Device updated successfully" });
  } else {
    return res.send({ message: "Device does not exist" });
  }
};

exports.delete = async (req, res) => {
  let device = await Device.findById(req.body._id);
  if (device) {
    await device.remove();
    return res.send({ message: "Devices" + device._id + " have been deleted" });
  } else {
    return res.send({ message: "Device does not exist" });
  }
};

exports.deleteAll = async (req, res) => {
  await Device.remove({});
  res.send({ message: "All devices have been deleted" });
};
