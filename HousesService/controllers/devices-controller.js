let Device = require("../models/devices-model");
const SerialPort = require('serialport');
const arduinoCOMPort = "COM6";

exports.get = async (req, res) => {
  res.send({ device: await Device.findById(req.params) });
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

        arduinoSerialPort.close(() => {
          console.log('serial port closed');
        })

        await device.update({ $push: { infraredCodes: irCode } })
        return res.send("Saved raw code [" + irCode.value + "] for function " + req.body.function + " for the device " + device.name)
      }
    });
  });
};

var isSending = false
exports.sendIrCode = async (req, res) => {
  if (!isSending) {
    isSending = true;

    let device = await Device.findById(req.body.device_id)

    var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
      baudRate: 9600
    });

    arduinoSerialPort.on("open", () => {
      console.log('serial port open');
    })

    arrayData = await device.infraredCodes.find(i => i.function === req.body.function).value
    await sleep(2000)
    arduinoSerialPort.write(arrayData)
    console.log("Code sent")

    const Readline = require('@serialport/parser-readline');
    const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\n' }));
    
    await sleep(500)
    parser.on('data', data => {
      console.log('-----------------------------------------------------------------------------------');
      console.log(data)
      console.log('-----------------------------------------------------------------------------------');
    })

    await sleep(1000)
    arduinoSerialPort.close(() => {
      console.log('serial port closed');
    })
    isSending = false
    res.send("Success")
  } else {
    console.log("Is still sending")
  }
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
  console.log(req.body)
  let device = await Device.findById(req.body._id);
  if (device) {
    await device.remove();
    return res.send({ message: "Devices" + device._id + " have been deleted" });
  } else {
    return res.status(404).send({ message: "Device does not exist" });
  }
};

exports.deleteAll = async (req, res) => {
  await Device.remove({});
  res.send({ message: "All devices have been deleted" });
};
