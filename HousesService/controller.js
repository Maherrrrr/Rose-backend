let House = require("./model");

exports.get = async (req, res) => {
  res.send({ house: await House.findById(req.body._id) });
};

exports.getAll = async (req, res) => {
  res.send({ houses: await House.find() });
};

exports.add = async (req, res) => {
  const { name, type } = req.body;
  let house = await new House({ name: name, type: type }).save();
  return res.send({ message: "House added successfully", house });
};

exports.update = async (req, res) => {
  const { _id, name, type } = req.body;
  let house = await House.findById(_id);
  if (house) {
    await house.update({ $set: { name: name, type: type } });
    return res.send({ message: "House updated successfully" });
  } else {
    return res.send({ message: "House does not exist" });
  }
};

exports.delete = async (req, res) => {
  let house = await House.findById(req.body._id);
  if (house) {
    await house.remove();
    return res.send({ message: "Houses" + house._id + " have been deleted" });
  } else {
    return res.send({ message: "House does not exist" });
  }
};

exports.deleteAll = async (req, res) => {
  await House.remove({});
  res.send({ message: "All houses have been deleted" });
};
