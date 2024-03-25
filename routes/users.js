const express = require("express");
const router = express.Router();
const mongoFunctions = require("../helpers/mongoFunctions");
const { client, getValue } = require("../helpers/redisFunctions");
const { User, validateUser } = require("../models/user");
const jwt = require("jsonwebtoken");

router.get("/all", async (req, res) => {
  try {
    const users = await mongoFunctions.findAll("User");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let jwtSecretkey = "jwtSecretkey";
    let otp;
    // console.log("Req body ==========>", req.body);
    const { error, value } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { phone } = value;
    const token = jwt.sign(phone, jwtSecretkey);
    const existingUser = await User.findOne({
      phone,
    });
    if (existingUser) {
      otp = generateOTP();
      storeOTP(phone, otp);
    }
    if (!existingUser) {
      const newUser = new User({ phone });
      await newUser.save();
      otp = generateOTP();
      storeOTP(phone, otp);
    }
    // console.log(phone, token);
    return res.header("x-auth-token", token).status(200).json({
      message: "OTP generated successfully",
      otp: otp,
      token: token,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    console.log("Req body =====>", req.body);
    let jwtSecretkey = "jwtSecretkey";
    const token = req.header("x-auth-token");
    const decode = jwt.verify(token, jwtSecretkey);
    console.log("decode ======>", decode);
    const enteredOTP = req.body.otp;
    console.log("entered otp =========>", enteredOTP);

    // const storedOTP = await getValue(decode);
    const storedOTP = await client.get(decode);
    console.log("Stored OTP ==============> ", storedOTP);

    if (!storedOTP) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    if (enteredOTP !== storedOTP) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// function getValueFromRedis(key) {
//   return new Promise((resolve, reject) => {
//     console.log("#########reached redis to get otp by phone#############", key);
//     client.get(key, (err, reply) => {
//       if (err) {
//         reject(err);
//       } else {
//         console.log(reply);
//         resolve(reply);
//       }
//     });
//   });
// }

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

function storeOTP(phone, otp) {
  console.log(phone, otp);
  client.set(phone, otp, "EX", 300);
}

module.exports = router;
