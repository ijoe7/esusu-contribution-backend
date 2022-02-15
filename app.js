const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const groupRouter = require("./routes/groupRoutes");

app.use(cors());
app.options("*", cors());
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/esusuUser', userRouter);
app.use('/esusuGroup', groupRouter);

module.exports = app;