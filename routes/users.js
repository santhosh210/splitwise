const express = require("express");
const router = express.Router();
const mongoFunctions = require("../helpers/mongoFunctions");
const { client, getValue } = require("../helpers/redisFunctions");
const { User, validateUser } = require("../models/User");
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
      return res.status(200).json({
        message: "OTP generated successfully",
        otp: otp,
      });
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
    if (token) {
      const decode = jwt.verify(token, jwtSecretkey);
      console.log("decode ======>", decode);
    }

    const enteredOTP = req.body.otp;
    console.log("entered otp =========>", enteredOTP);
    const storedOTP = await client.get(req.body.phone);
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

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

function storeOTP(phone, otp) {
  console.log(phone, otp);
  client.set(phone, otp, "EX", 300);
}

//____________________________________________________________________

// router.post("/send-friend-request", async (req, res) => {
//   try {
//     const { userId, friendId } = req.body;
//     await User.findByIdAndUpdate(userId, {
//       $addToSet: { friendRequests: friendId },
//     });
//     res.status(200).send("Friend request sent successfully");
//   } catch (error) {
//     res.status(500).send("Error sending friend request");
//   }
// });

// // Accept friend request
// router.post("/accept-friend-request", async (req, res) => {
//   try {
//     const { userId, friendId } = req.body;
//     await User.findByIdAndUpdate(userId, {
//       $addToSet: { friends: { friendId, status: "accepted" } },
//       $pull: { friendRequests: friendId },
//     });
//     await User.findByIdAndUpdate(friendId, {
//       $addToSet: { friends: { friendId: userId, status: "accepted" } },
//     });
//     res.status(200).send("Friend request accepted successfully");
//   } catch (error) {
//     res.status(500).send("Error accepting friend request");
//   }
// });

// // Get user's friends
// router.get("/:userId/friends", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId).populate("friends.friendId");
//     const friends = user.friends.filter(
//       (friend) => friend.status === "accepted"
//     );
//     res.status(200).json(friends);
//   } catch (error) {
//     res.status(500).send("Error retrieving user friends");
//   }
// });

module.exports = router;
