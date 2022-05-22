const { MongoClient, ObjectId } = require("mongodb");
const { generateUsername } = require("unique-username-generator");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

class GuestController {
  static async findGuests(req, res, next) {
    try {
      await client.connect();

      const db = client.db("ranchat");

      const result = await db.collection("Guests").find().toArray();

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async addGuest(req, res, next) {
    try {
      await client.connect();

      const db = client.db("ranchat");

      let num = "";
      for (let i = 0; i < 4; i++) {
        num += (Math.floor(Math.random() * 9) + 1).toString();
      }
      const guestName = `Guest${generateUsername("", 0, 12)}#${num}`;

      // num = "";
      // for (let i = 0; i < 8; i++) {
      //   num += (Math.floor(Math.random() * 9) + 1).toString();
      // }
      const { socketId } = req.body;
      const identifier = socketId; //identifier using socket.id
      const payload = {
        guest: guestName,
        identifier,
      };
      const result = await db.collection("Guests").insertOne(payload);
      res.status(201).json({ mongoId: result.insertedId });
    } catch (error) {
      next(error);
    }
  }

  static async findGuestById(req, res, next) {
    try {
      await client.connect();

      const db = client.db("ranchat");
      const { id } = req.params;

      const result = await db
        .collection("Guests")
        .findOne({ _id: ObjectId(id) });

      if (!result) {
        console.log("error");
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async eraseGuest(req, res, next) {
    try {
      await client.connect();

      const db = client.db("ranchat");
      const { id } = req.params;

      const result = await db
        .collection("Guests")
        .deleteOne({ _id: ObjectId(id) });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async findRooms(req, res, next) {
    try {
      await client.connect();

      const db = client.db("ranchat");
      const result = await db.collection("Rooms").find().toArray();

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async randomRoom(req, res, next) {
    try {
      await client.connect();

      const db = client.db("ranchat");

      const { socketId } = req.body;

      const findRooms = await db.collection("Rooms").find().toArray();
      let response;
      let code;
      if (!findRooms.length) {
        //jika tidak ada room sama sekali
        // await GuestModel.createRoom({
        //   guestCaller: guestSocketId,
        //   guestCalled: null,
        // });

        response = await db.collection("Rooms").insertOne({
          guestCaller: socketId,
          guestCalled: null,
        });
        code = 201;
      } else {
        const filterRoom = findRooms.filter((room) => !room.guestCalled);
        if (!filterRoom[0]) {
          response = await db.collection("Rooms").insertOne({
            guestCaller: socketId,
            guestCalled: null,
          });
          code = 201;
        } else {
          await db
            .collection("Rooms")
            .updateOne(
              { _id: ObjectId(filterRoom[0]._id) },
              { $set: { guestCalled: socketId } }
            );
          filterRoom[0].guestCalled = socketId;
          response = filterRoom[0];
          code = 200;
        }
        // for (const room of findRooms) {
        //   //looping room
        //   if (!room.guestCalled) {
        //     //cari room yang guestCallednya kosong
        //     // response = await GuestModel.connectingGuest({
        //     //   roomId: room._id,
        //     //   guestSocketId,
        //     // });

        //     response = await db
        //       .collection("Rooms")
        //       .updateOne(
        //         { _id: ObjectId(room._id) },
        //         { $set: { guestCalled: guestSocketId } }
        //       );

        //     code = 200;
        //     break;
        //   } else {
        //     //karena ada room yang guestCallednya terisi maka dia akan terus membuat room baru (bug)
        //     // response = await GuestModel.createRoom({
        //     //   guestCaller: guestSocketId,
        //     //   guestCalled: null,
        //     // });

        //     response = await db.collection("Rooms").insertOne({
        //       guestCaller: guestSocketId,
        //       guestCalled: null,
        //     });
        //     code = 201;
        //   }
        // }
        res.status(code).json(response);
      }
    } catch (error) {
      console.log("error: ", error);
      next(error);
    }
  }

  static async delRoom(req, res, next) {
    try {
      await client.connect();

      const db = client.db("ranchat");

      const result = await db
        .collection("Rooms")
        .deleteOne({ _id: ObjectId(req.params.id) });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GuestController;
