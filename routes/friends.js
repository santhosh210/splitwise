const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

router.post("/add-friend/:userId", async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if friendId exists and is not already a friend or in friend requests
    if (
      !user.friends.some((friend) => friend.userId === friendId) &&
      !user.friendRequests.some((request) => request.userId === friendId)
    ) {
      user.friendRequests.push({ userId: friendId });
      await user.save();
      return res
        .status(200)
        .json({ message: "Friend request sent successfully" });
    } else {
      return res
        .status(400)
        .json({ error: "User is already a friend or request is pending" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// router.put("/accept-friend/:userId", async (req, res) => {
//   const { userId } = req.params;
//   const { friendId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const friendRequest = user.friendRequests.find(
//       (request) => request.userId === friendId
//     );
//     if (!friendRequest) {
//       return res.status(404).json({ error: "Friend request not found" });
//     }

//     // Move friend request to friends with status accepted
//     user.friends.push({ userId: friendId, status: "accepted" });
//     user.friendRequests = user.friendRequests.filter(
//       (request) => request.userId !== friendId
//     );
//     await user.save();

//     return res.status(200).json({ message: "Friend request accepted" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });
router.put("/accept-friend/:userId", async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendRequestIndex = user.friendRequests.findIndex(
      (request) => request.userId === friendId
    );

    if (friendRequestIndex === -1) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    // Move friend request to friends with status accepted
    user.friends.push({ userId: friendId, status: "accepted" });
    user.friendRequests.splice(friendRequestIndex, 1); // Remove from friend requests

    // Find the friend and add current user to their friends list
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }

    friend.friends.push({ userId: userId, status: "accepted" });

    // Save both updated user and friend documents
    await Promise.all([user.save(), friend.save()]);

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/reject-friend/:userId", async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove friend request
    user.friendRequests = user.friendRequests.filter(
      (request) => request.userId !== friendId
    );

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter friends with status accepted
    const friends = user.friends.filter(
      (friend) => friend.status === "accepted"
    );

    return res.status(200).json({ friends });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { User } = require("../models/User");

// router.post("/add-friend/:userId", async (req, res) => {
//   const { userId } = req.params;
//   const { friendId } = req.body;
//   console.log(userId, friendId);

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if friendId exists and is not already a friend
//     if (!user.friends.some((friend) => friend.userId === friendId)) {
//       user.friends.push({ userId: friendId });
//       await user.save();
//       return res.status(200).json({ message: "Friend added successfully" });
//     } else {
//       return res.status(400).json({ error: "User is already a friend" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.put("/accept-friend/:userId", async (req, res) => {
//   const { userId } = req.params;
//   const { friendId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const friend = user.friends.find((friend) => friend.userId === friendId);
//     if (!friend) {
//       return res.status(404).json({ error: "Friend not found" });
//     }

//     friend.status = "accepted";
//     await user.save();

//     return res.status(200).json({ message: "Friend request accepted" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.put("/reject-friend/:userId", async (req, res) => {
//   const { userId } = req.params;
//   const { friendId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     user.friends = user.friends.filter((friend) => friend.userId !== friendId);
//     await user.save();

//     return res.status(200).json({ message: "Friend request rejected" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.get("/friends/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const friends = user.friends.filter(
//       (friend) => friend.status === "accepted"
//     );

//     return res.status(200).json({ friends });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
