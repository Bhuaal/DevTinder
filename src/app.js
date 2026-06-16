const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/Auth");

app.use("/admin", adminAuth);

app.get("/admin", (req, res) => {
  res.send("All data sent");
});

app.get("/user", userAuth, (req, res) => {
  res.send("User data sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("All data deleted");
});

app.listen(3000, () => {
  console.log("Server started");
});
