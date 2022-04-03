const express = require("express")
const router = express.Router()
const controller = require("../controllers/devices-controller");



// routes
router.route("/one")
  .get(controller.get)
  .post(controller.add)
  .put(controller.update)
  .delete(controller.delete)


  router.route("/add-code").put(controller.addCode);

  router.route("/all").get(controller.getAll).delete(controller.deleteAll);
  

module.exports = router
