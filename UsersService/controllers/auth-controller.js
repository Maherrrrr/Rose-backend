const FamillyMember = require("../models/FamillyMember");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const fs = require("fs");

exports.register = async (req, res) => {
  const {
    email,
    password,
    firstname,
    lastname,
    birthdate,
    gender,
    pictureId,
    isVerified,
    role,
  } = req.body;

  if (await FamillyMember.findOne({ email })) {
    res.status(403).send({ message: "FamillyMember already exist !" });
  } else {
    let famillyMember = await new FamillyMember({
      email,
      password: await bcrypt.hash(password, 10),
      firstname,
      lastname,
      birthdate,
      gender,
      pictureId,
      isVerified,
      role,
    }).save();

    await configurerDossierFamillyMember(famillyMember._id);

    // token creation
    const token = jwt.sign(
      { _id: famillyMember._id, role: famillyMember.role },
      process.env.JWT_SECRET,
      { expiresIn: "60000" } // in Milliseconds (3600000 = 1 hour)
    );

    sendConfirmationEmail(email, token);

    res.status(200).send({
      message: "success",
      famillyMember,
      Token: jwt.verify(token, process.env.JWT_SECRET),
    });
  }
};


exports.registerguest = async (req, res) => {
  console.log(req.body)
  const {
    email,
    password,
    firstname,
    lastname,
    birthdate,
    gender,
    pictureId,
    isVerified,
    role = "ROLE_USER",
  } = req.body;

    let i = 0 ; 
    let famillyMember = await new FamillyMember({
      email,
      password: await bcrypt.hash(password, 10),
      firstname,
      lastname,
      birthdate,
      gender,
      pictureId,
      isVerified,
      role,
    }).save();

    if (i==0) {
      cron.schedule('* * * * *', async () =>  {
        // const { name, type } = req.body;
        let guest = await FamillyMember.findById(famillyMember.id);
        if (famillyMember) {
          await guest.remove();
          return res.send({ message: "FamillyMembers" + guest._id + " have been deleted" });
        } else {
          return res.send({ message: "FamillyMember does not exist" });
        }
     
         
       console.log('Guest supprimè');
     
     });

    }
   

   
  
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const famillyMember = await FamillyMember.findOne({ email });

  if (famillyMember && (await bcrypt.compare(password, famillyMember.password))) {
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "36000000",
    });

    if (!famillyMember.isVerified) {
      res.status(403).send({ famillyMember, message: "email non verifié" });
    } else {
      res.status(200).send({ token, famillyMember, message: "success" });
    }
  } else {
    res.status(403).send({ message: "mot de passe ou email incorrect" });
  }
};

exports.loginWithSocial = async (req, res) => {
  const { email, firstname, lastname, role } = req.body;

  if (email === "") {
    res.status(403).send({ message: "error please provide an email" });
  } else {
    var famillyMember = await FamillyMember.findOne({ email });
    if (famillyMember) {
      console.log("famillyMember exists, loging in");
    } else {
      console.log("famillyMember does not exists, creating an account");

      famillyMember = await new FamillyMember({
        email,
        firstname,
        lastname,
        isVerified: true,
        role,
      }).save();
    }

    // token creation
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "360000000",
    });

    res.status(201).send({ message: "success", famillyMember, token: token });
  }
};

exports.sendConfirmationEmail = async (req, res) => {
  const famillyMember = await FamillyMember.findOne({ email: req.body.email });

  if (famillyMember) {
    token = generateFamillyMemberToken(famillyMember._id, email._id);

    sendConfirmationEmail(req.body.email, token);

    res.status(200).send({
      message: "L'email de confirmation a été envoyé a " + famillyMember.email,
    });
  } else {
    res.status(404).send({ message: "FamillyMember innexistant" });
  }
};

exports.confirmation = async (req, res) => {
  let token;

  if (req.params.token) {
    try {
      token = jwt.verify(req.params.token, process.env.JWT_SECRET);
    } catch (e) {
      return res.render("confirmation.twig", {
        message:
          "The verification link may have expired, please resend the email.",
      });
    }
  } else {
    return res.render("confirmation.twig", {
      message: "no token",
    });
  }

  FamillyMember.findById(token._id, function (err, famillyMember) {
    if (!famillyMember) {
      return res.render("confirmation.twig", {
        message: "FamillyMember does not exist, please register.",
      });
    } else if (famillyMember.isVerified) {
      return res.render("confirmation.twig", {
        message: "This famillyMember has already been verified, please login",
      });
    } else {
      famillyMember.isVerified = true;
      famillyMember.save(function (err) {
        if (err) {
          return res.render("confirmation.twig", {
            message: err.message,
          });
        } else {
          return res.render("confirmation.twig", {
            message: "Your account has been verified",
          });
        }
      });
    }
  });
};

exports.forgotPassword = async (req, res) => {
  const resetCode = req.body.resetCode;
  const famillyMember = await FamillyMember.findOne({ email: req.body.email });

  if (famillyMember) {
    // token creation
    const token = jwt.sign(
      { _id: famillyMember._id, email: famillyMember.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "3600000", // in Milliseconds (3600000 = 1 hour)
      }
    );

    sendOTP(req.body.email, resetCode);

    res.status(200).send({
      message: "L'email de reinitialisation a été envoyé a " + famillyMember.email,
    });
  } else {
    res.status(404).send({ message: "FamillyMember innexistant" });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (newPassword) {
    newPasswordEncrypted = await bcrypt.hash(newPassword, 10);

    let famillyMember = await FamillyMember.findOneAndUpdate(
      { email: email },
      {
        $set: {
          password: newPasswordEncrypted,
        },
      }
    );

    return res.send({ message: "Password updated successfully", famillyMember });
  } else {
    return res.status(403).send({ message: "Password should not be empty" });
  }
};

///// FUNCTIONS ---------------------------------------------------------

async function generateFamillyMemberToken(_id, email) {
  return jwt.sign({ _id: _id, email: email }, process.env.JWT_SECRET, {
    expiresIn: "100000000", // in Milliseconds (3600000 = 1 hour)
  });
}

async function sendConfirmationEmail(email, token) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      console.log("Server not ready");
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const confirmationLink = "http://localhost:3000/confirmation/" + token;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Confirm your email",
    html:
      "<h3>Please confirm your email using this </h3><a href='" +
      confirmationLink +
      "'>link</a>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

async function sendOTP(email, codeDeReinit) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      console.log("Server not ready");
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Password reset - Rose",
    html:
      "<h3>You have requested to reset your password</h3><p>Your reset code is : <b style='color : blue'>" +
      codeDeReinit +
      "</b></p>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent : " + info.response);
    }
  });
}

async function configurerDossierFamillyMember(id) {
  const dir = `./images/uploads`;

  fs.mkdir(dir, function () {
    fs.exists(dir, function (exist, err) {
      if (exist) {
        const dir2 = `./uploads/developer-${id}/profile-pic`;
        fs.mkdir(dir2, function () {
          console.log("folder created");
        });
      }
    });
  });
}
