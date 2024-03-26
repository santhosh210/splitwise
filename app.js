const express = require("express");
require("./helpers/redisFunctions");
require("./helpers/mongoFunctions");

const usersRouter = require("./routes/users");
const friendsRouter = require("./routes/friends");

const app = express();

app.use(express.json());
app.get("/", (req, res) => res.send("check"));

app.use("/users", usersRouter);
app.use("/friends", friendsRouter);

app.listen(3001);

module.exports = app;
