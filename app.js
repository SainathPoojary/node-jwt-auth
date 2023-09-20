require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

const User = require("./model/user");
const auth = require("./middleware/auth");

const file = fs.readFileSync(__dirname + '/swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get("/", (req, res) => {
  res.status(200).send("Server is up and running.\n");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    // validate the fields
    if (!(email && password && firstname && lastname)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    // hash user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user in our database
    const user = await User.create({
      firstname: firstname.toLowerCase().trim(),
      lastname: lastname.toLowerCase().trim(),
      password: encryptedPassword,
      email: email.toLowerCase().trim(),
    });

    // create token
    const token = jwt.sign(
      {
        userId: user._id,
        email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    // save user token
    user.token = token;

    // remove user password from response
    user.password = undefined;


    const option = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, option).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // validate the fields
  if (!(email && password)) {
    res.status(400).send("All input is required");
  }

  const user = await User.findOne({ email });

  if (user && bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        userId: user._id,
        email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.password = undefined;

    const option = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    return res.status(200).cookie("token", token, option).json(user);
  }

  res.status(400).send("Invalid Credentials");
});

app.get("/dashboard", auth, async (req, res) => {
  const { email } = req.user;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

app.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send("Logout success");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

module.exports = app;
