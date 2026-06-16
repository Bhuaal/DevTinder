const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello jee");
});

app.use("/path",(req,res) => {
    res.send("this route is path ")
})

app.listen(3000, () => {
  console.log("Server started");
});
