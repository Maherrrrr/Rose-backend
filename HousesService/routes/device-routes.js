const express = require("express")
const router = express.Router()
const controller = require("../controllers/devices-controller");

router.route("/one")
  .get(controller.get)
  .post(controller.add)
  .put(controller.update)
  .delete(controller.delete)

router.route("/all").get(controller.getAll).delete(controller.deleteAll);

router.route("/pair-device").post(controller.pairDevice);
router.route("/send-ir-code").post(controller.sendIrCode);
router.route("/reset-device-codes").put(controller.resetDeviceCodes);

module.exports = router
