const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/Auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate(
        "fromUserId",
        "firstName lastName imageUrl age gender skills about",
      );
    //   .populate("fromUserId", ["firstName", "lastName"]);
    if (connectionRequests.length == 0) {
      return res.json({
        message: "You have not pending any connection requests",
      });
    }
    res.json({
      message: "Data fetched successfully",
      connectionRequests,
    });
  } catch (error) {
    res.status(400).json({ message: "ERROR " + error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: "ERROR " + error.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");
    //   .populate("fromUserId", "firstName")
    //   .populate("toUserId", "firstName");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      (hideUserFromFeed.add(req.fromUserId.toString()),
        hideUserFromFeed.add(req.toUserId.toString()));
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName imageUrl age gender skills about")
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).json({ message: "ERROR " + error.message });
  }
});

module.exports = userRouter;
