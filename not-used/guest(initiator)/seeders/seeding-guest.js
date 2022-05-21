const { MongoClient } = require("mongodb");
let guestData = require("../data/guest.json");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("ranchat");

    const guestCollection = db.collection("Guests");
    const option = { ordered: true };

    await guestCollection.insertMany(guestData, option);
  } finally {
    await client.close;
  }
}

run().catch(console.dir);
