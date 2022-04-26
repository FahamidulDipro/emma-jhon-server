const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Emma-Jhon Server is connected");
});

app.listen(port, () => {
  console.log("Emma jhon is running on port:", port);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lywwz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("emma-jhon-db").collection("products");
    app.get("/products", async (req, res) => {
      const query = {};
      let products;
      console.log("Query", req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const cursor = productCollection.find(query);
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send(products);
    });
    app.get("/productCount", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });

    //Use POST to get products by ids
    app.post("/productBykeys", async (req, res) => {
      const keys = req.body;
      const ids = keys.map((id) => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      console.log(keys);
      res.send(products);
    });
  } finally {
  }
}
run().catch(console.dir);
