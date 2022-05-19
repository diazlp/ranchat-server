const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongoConnection");
const { generateUsername } = require("unique-username-generator");

class GuestModel {
  static async findGuestOnline() {
    try {
      const db = getDB();
      const result = await db.collection("Guests").find().toArray();
      return result;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async createGuest() {
    try {
      const db = getDB();
      let num = "";
      for (let i = 0; i < 4; i++) {
        num += (Math.floor(Math.random() * 9) + 1).toString();
      }
      const guestName = `Guest${generateUsername("", 0, 12)}#${num}`;
      num = "";
      for (let i = 0; i < 8; i++) {
        num += (Math.floor(Math.random() * 9) + 1).toString();
      }
      const identifier = num;
      const payload = {
        guest: guestName,
        identifier,
      };
      const result = await db.collection("Guests").insertOne(payload);
      return result;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async findGuest(id) {
    try {
      const db = getDB();
      const result = await db.collection("Guests").findOne({ _id: ObjectId(id) });
      console.log("result: ", result);
      return result;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async deleteGuest(id) {
    try {
      const db = getDB();
      const result = await db.collection("Guests").deleteOne({ _id: ObjectId(id) });
      return result;
    } catch (error) {
      console.log("error: ", error);
    }
  }
}

module.exports = GuestModel;
