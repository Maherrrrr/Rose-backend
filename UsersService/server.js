require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
var cron = require('node-cron');
const app = express();
const port = process.env.PORT || 3000;
const famillyMemberController = require("./controllers/famillyMember-controller");
const authController = require("./controllers/auth-controller");

// database
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected");
    },
    (err) => {
      console.log("Database connection error", err);
    }
  );

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/img", express.static("images"));

//************************* SWAGGER */
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const FamillyMember = require("./models/FamillyMember");


 swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['server.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.post("/register", authController.register);
app.post("/login", authController.login);
app.post("/login-with-social", authController.loginWithSocial);
app.post("/send-confirmation-email", authController.sendConfirmationEmail);
app.get("/confirmation/:token", authController.confirmation);
app.post("/forgot-password", authController.forgotPassword);
app.post("/update-password", authController.updatePassword);
app.post("/addguest", authController.registerguest);






app
  .route("/one")
 /**
 * @swagger
 *   /one:
 *   description: The utilisateurs managing API
 *   get:
 *    summary: Returns user by his id
 *    tags: [Users]
 *    parameters:
 *      - in: body
 *        name: _id
 *        schema:
 *         type: string
 *    responses:
 *     200:
 *      description: the user by id
 *      content:
 *      application/json:
 *     400:
 *      description: cannot find user
 */
  .get(famillyMemberController.get)
 /**
 * @swagger
 *   /one:
 *   description: The utilisateurs managing API
 *   post:
 *    summary: Returns user by his id
 *    tags: [Users]
 *    parameters:
 *      - in: body
 *        name: email
 *        schema:
 *         type: string
 *    responses:
 *     200:
 *      description: the user by id
 *      content:
 *      application/json:
 *     400:
 *      description: cannot find user
 */
  .post(famillyMemberController.add)
 /**
 * @swagger
 *   /one:
 *   description: The utilisateurs managing API
 *   put:
 *    summary: Returns user by his id
 *    tags: [Users]
 *    parameters:
 *      - in: body
 *        name: email
 *        schema:
 *         type: string
 *    responses:
 *     200:
 *      description: the user by id
 *      content:
 *      application/json:
 *     400:
 *      description: cannot find user
 */
  .put(famillyMemberController.update)
 /**
 * @swagger
 *   /one:
 *   description: The utilisateurs managing API
 *   delete:
 *    summary: Returns user by his id
 *    tags: [Users]
 *    parameters:
 *      - in: body
 *        name: FamilyMember
 *        schema:
 *         type: object
 *         properties: 
 *          _id:
 *           type: string
 *    responses:
 *     200:
 *      description: the user by id
 *      content:
 *      application/json:
 *     400:
 *      description: cannot find user
 */
  .delete(famillyMemberController.delete);
 /**
 * @swagger
 *   /all:
 *   description: The utilisateurs managing API
 *   get:
 *    summary: Returns the list of all the utilisateurs
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: The list utilisateurs
 *        content:
 *        application/json:
 *      400:
 *        description: utilisateur error
 */
app.route("/all").get(famillyMemberController.getAll).delete(famillyMemberController.deleteAll);
app.route("/registerguest").post(authController.registerguest);

app.get("/1", function (req, res) {
  res.sendFile(
    path.resolve(__dirname) + "/views/privacy-policy.html"
  );
});

app.get("/2", function (req, res) {
  res.sendFile(
    path.resolve(__dirname) + "/views/user-agreements.html"
  );
});

app.get("/3", function (req, res) {
  res.sendFile(
    path.resolve(__dirname) + "/views/help.html"
    );
});

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
 



//l cron ili bech tekhdem haja ba3ed action wala faza
/*

 cron.schedule('* * * * *', () =>  {

  
   // const { name, type } = req.body;
let famillyMember =  new FamillyMember({ name: "test cron", type: "type cron" }).save();

    
  console.log('test kol 1 minute bech tatla3 fil console');

}); */

