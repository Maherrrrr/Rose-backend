let FamillyMember = require("../models/FamillyMember");

exports.get = async (req, res) => {
  res.send({ famillyMember: await FamillyMember.findById(req.body._id) });
};

exports.getAll = async (req, res) => {
  res.send({ famillyMembers: await FamillyMember.find() });
};

exports.add = async (req, res) => {
  const { name, type } = req.body;
  let famillyMember = await new FamillyMember({ name: name, type: type }).save();
  return res.send({ message: "FamillyMember added successfully", famillyMember });
};

exports.update = async (req, res) => {
  const { _id, name, type } = req.body;
  let famillyMember = await FamillyMember.findById(_id);
  if (famillyMember) {
    await famillyMember.update({ $set: { name: name, type: type } });
    return res.send({ message: "FamillyMember updated successfully" });
  } else {
    return res.send({ message: "FamillyMember does not exist" });
  }
};

exports.delete = async (req, res) => {
  let famillyMember = await FamillyMember.findById(req.body._id);
  if (famillyMember) {
    await famillyMember.remove();
    return res.send({ message: "FamillyMembers" + famillyMember._id + " have been deleted" });
  } else {
    return res.send({ message: "FamillyMember does not exist" });
  }
};

exports.deleteAll = async (req, res) => {
  await FamillyMember.remove({});
  res.send({ message: "All famillyMembers have been deleted" });
};

