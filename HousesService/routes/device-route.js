const express = require("express")
const router = express.Router()
const controller = require("../controllers/devices-controller");



// routes
 /**
 * @swagger
 * /one:
 *   description: The utilisateurs managing API
 *   get:
 *     summary: Returns the device by his id
 *     tags: [Devices]
 *     parameters:
 *       - in: body
 *         name: id
 *         type: string
 *     responses:
 *       200:
 *         description: Device by id
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */
router.route("/one")
  .get(controller.get)
 /**
 * @swagger
 * /one:
 *   description: The utilisateurs managing API
 *   post:
 *     summary: add a Device
 *     tags: [Devices]
 *     parameters:
 *       - in: body
 *         name: token
 *         type: string
 *       - in: body
 *         name: name
 *         type: string
 *     responses:
 *       200:
 *         description: add a Device
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */
  .post(controller.add)
 /**
 * @swagger
 * /one:
 *   description: The utilisateurs managing API
 *   put:
 *     summary: modifier Device
 *     tags: [Devices]
 *     parameters:
 *       - in: body
 *         name: id
 *         type: string
 *       - in: body
 *         name: nom
 *         type: string
 *       - in: body
 *         name: prenom
 *         type: string
 *     responses:
 *       200:
 *         description: Modifier Device
 *         content:
 *           application/json:
 *       400:
 *         description: utilisateur error
 */
 .put(controller.update)
   /**
  * @swagger
 * /one:
 *   description: The utilisateurs managing API
 *   delete:
 *     summary: Delete from his id 
 *     tags: [Devices]
 *     parameters:
 *       - in: body
 *         name: _id
 *         type: string
 *     responses:
 *       200:
 *         description: Supprimer Device
 *         content:
 *           application/json:
 *       400:
 *         description: Device error
 */
 .delete(controller.delete)


  router.route("/add-code").put(controller.addCode);

  router.route("/all").get(controller.getAll).delete(controller.deleteAll);
  

module.exports = router
