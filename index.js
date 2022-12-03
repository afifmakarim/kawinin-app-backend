// var express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
// require("dotenv").config();
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
// var cors = require("cors");

// var app = express();

// app.use(cors());
// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// // app.use("/", indexRouter);
// app.use("/api/v1", usersRouter);

// // const weddingList = require("./models/weddingList.model");
// // const bride_groom = require("./models/bride_grooms.model");
// // const galleries = require("./models/galleries.model");
// // weddingList.sync({ force: true });
// // bride_groom.sync({ force: true });
// // galleries.sync({ force: true });
// // const weddingDay = require("./models/weddingDay.model");
// // weddingDay.sync({ force: true });

// // module.exports = app;
// app.get("/", (req, res) => {
//   res.send("This server is Connected");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
//Middleware files
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bqscdvk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client.db("resaleDB").collection("category");
    const userCollection = client.db("resaleDB").collection("allusers");
    const productCollection = client.db("resaleDB").collection("products");
    const orderCollection = client.db("resaleDB").collection("orders");
    // app.get("/category", async (req, res) => {
    //   const query = {};
    //   const cursor = categoryCollection.find(query);
    //   const categories = await cursor.toArray();
    //   res.send(categories);
    // });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await categoryCollection.findOne(query);

      res.send(cursor);
    });
    // app.get("/allusers", async (req, res) => {
    //   const query = {};
    //   const cursor = userCollection.find(query);
    //   const allusers = await cursor.toArray();
    //   res.send(allusers);
    // });

    app.get("/category", async (req, res) => {
      let query = {};
      if (req.query.category) {
        query = {
          category: req.query.category,
        };
      }

      const cursor = categoryCollection.find(query);
      const category = await cursor.toArray();
      res.send(category);
    });

    app.post("/allusers", async (req, res) => {
      const getUser = req.body;
      const inserUser = await userCollection.insertOne(getUser);
      res.send(inserUser);
    });

    app.get("/allusers", async (req, res) => {
      console.log(req.query.role);
      let query = {};
      if (req.query.role) {
        query = {
          role: req.query.role,
        };
      }
      const cursor = userCollection.find(query);
      const data = await cursor.toArray();
      console.log(data);
      res.send(data);
    });

    app.get("/allproducts", async (req, res) => {
      let query = {};
      if (req.query.category) {
        query = {
          category: req.query.category,
        };
      }
      const cursor = productCollection.find(query);
      const allData = await cursor.toArray();
      console.log(allData);
      res.send(allData);
    });

    app.post("/allproducts", async (req, res) => {
      const allData = req.body;
      const cursor = await productCollection.insertOne(allData);
      res.send(cursor);
    });

    app.get("/allproducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await productCollection.findOne(query);
      res.send(products);
    });

    app.post("/carts", async (req, res) => {
      const getData = req.body;
      const cursor = await orderCollection.insertOne(getData);
      res.send(cursor);
    });
    app.get("/carts", async (req, res) => {
      const query = {};
      const cursor = await orderCollection.find(query).toArray();
      res.send(cursor);
    });

    app.get("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const catrts = await productCollection.findOne(query);
      res.send(catrts);
    });
  } finally {
  }
}
run();
app.get("/", (req, res) => {
  res.send("This server is Connected");
});

app.listen(PORT, () => {
  console.log(`This server is running on PORT ${PORT}`);
});
