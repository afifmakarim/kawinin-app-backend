var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var cors = require("cors");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/v1", usersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);

// const weddingList = require("./models/weddingList.model");
// const bride_groom = require("./models/bride_grooms.model");
// const galleries = require("./models/galleries.model");
// weddingList.sync({ force: true });
// bride_groom.sync({ force: true });
// galleries.sync({ force: true });
// const weddingDay = require("./models/weddingDay.model");
// weddingDay.sync({ force: true });

module.exports = app;
