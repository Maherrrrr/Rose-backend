let Device = require("../models/devices-model");
const SerialPort = require('serialport');
const arduinoCOMPort = "COM6";

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

exports.resetDeviceCodes = async (req, res) => {
  const { _id } = req.body;
  let device = await Device.findById(_id);
  if (device) {
    await device.update({ $set: { infraredCodes: [] } });
    return res.send({ message: "Infrared codes reset successfully" });
  } else {
    return res.send({ message: "Device does not exist" });
  }
};

exports.pairDevice = async (req, res) => {
  let device = await Device.findById(req.body.device_id)

  var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
    baudRate: 9600
  });

  const Readline = require('@serialport/parser-readline');
  const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\n' }));

  arduinoSerialPort.on("open", () => {
    console.log('serial port open');

    parser.on('data', async data => {

      if (data.split("IR_START")[1]) {
        irCode = {
          'function': req.body.function,
          'value': data.split("IR_START")[1].split("IR_END")[0]
        }

        let existingIrCode = device.infraredCodes.find(i => i.function === req.body.function)

        if (existingIrCode) {
          await device.infraredCodes.pull(existingIrCode)
          await device.save()
        }
        await device.update({ $push: { infraredCodes: irCode } })

        arduinoSerialPort.close(() => {
          console.log('serial port closed');
        })

        res.send("Saved raw code [" + irCode.value + "] for function " + req.body.function + " for the device " + device.name)
      }
    });
  });
};


exports.sendIrCode = async (req, res) => {
  let device = await Device.findById(req.body.device_id)

  var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
    baudRate: 9600
  });

  arduinoSerialPort.on("open", () => {
    console.log('serial port open');
  })

  await sleep(2500)
  console.log("Code sent")
  arrayData = await device.infraredCodes.find(i => i.function === req.body.function).value
  arduinoSerialPort.write(arrayData)

  await sleep(2500)

  const Readline = require('@serialport/parser-readline');
  const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\n' }));

  parser.on('data', data => {
    console.log('-----------------------------------------------------------------------------------');
    console.log(data)
  })

  await sleep(1000)
  arduinoSerialPort.close(() => {
    console.log('serial port closed');
  })


  res.send("Success")
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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
