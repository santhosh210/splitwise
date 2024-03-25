const express = require("express");
require("./helpers/redisFunctions");
require("./helpers/mongoFunctions");

const usersRouter = require("./routes/users");

const app = express();

app.use(express.json());
app.get("/", (req, res) => res.send("check"));

app.use("/users", usersRouter);

app.listen(3001);

module.exports = app;
