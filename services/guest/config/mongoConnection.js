const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;
async function connection() {
  try {
    await client.connect();
    db = client.db("ranchat");
  } catch (err) {
    console.log(err);
  }
}

function getDB() {
  return db;
}

module.exports = { connection, getDB };
