require("dotenv").config();

const connectdb = async () => {
  const { MongoClient, ServerApiVersion, Collection } = require("mongodb");
  const uri = process.env.DATABASE;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  result = await client.connect();
  let db = await result.db("internship");
  let collection = await db.collection("users");

  return collection;
};

module.exports = connectdb;
