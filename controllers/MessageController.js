const { MongoClient, ObjectId } = require("mongodb");
const { imageKit } = require("../middlewares/multer");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

class MessageController {
  static async addMessage(req, res, next) {
    try {
      const { friendRoom, text } = req.body;
      const { id } = req.user;
      await client.connect();
      let result;
      const db = client.db("ranchat");
      let response;

      if (req.file) {
        const { buffer, originalname } = req.file;
        response = await imageKit(buffer, originalname);

        result = await db.collection("message").insertOne({
          roomFriendId: friendRoom,
          sender: id,
          text: null,
          photo: response.data.url,
          type: "image",
          createdAt: new Date(),
        });
        res.status(200).json({
          message: "Message added successfully.",
          imgUrl: response.data.url,
        });
      } else {
        result = await db.collection("message").insertOne({
          roomFriendId: friendRoom,
          sender: id,
          text,
          photo: null,
          type: "text",
          createdAt: new Date(),
        });
        res.status(200).json({
          message: "Message added successfully.",
        });
      }
      if (!result) {
        throw {
          name: "AddMessageFailed",
          message: "Failed to add message to the database",
        };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async findMessage(req, res, next) {
    try {
      const { roomfriendid } = req.params;
      const { id } = req.user;
      await client.connect();

      const db = client.db("ranchat");
      if (roomfriendid) {
        const messages = await db
          .collection("message")
          .find({
            roomFriendId: roomfriendid,
          })
          .toArray();
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender === +id ? "you" : "guest",
            senderId: msg.sender,
            message: msg.text,
            photo: msg.photo,
            type: msg.type,
            time: msg.createdAt,
          };
        });
        res.status(200).json(projectedMessages);
      }
    } catch (error) {
      next(error);
    }
  }

  static async findLastMessage(req, res, next) {
    try {
      const { friendid } = req.params;
      const { id } = req.user;

      await client.connect();

      const db = client.db("ranchat");
      if (friendid) {
        const messages = await db
          .collection("message")
          .find({
            roomFriendId: friendid,
          })
          .sort({ createdAt: -1 })
          .toArray();
        const projectedMessages = messages.filter((msg) => {
          return msg.sender !== +id;
        });
        res.status(200).json(projectedMessages[0].text);
      }
    } catch (error) {
      next(error);
    }
  }
  static async addRoomFriend(req, res, next) {
    try {
      const { receiverId, sender } = req.body;
      const { id } = req.user;
      await client.connect();
      const db = client.db("ranchat");
      const findRoom1 = await db.collection("RoomFriends").findOne({
        members: [id, +receiverId],
      });

      const findRoom2 = await db.collection("RoomFriends").findOne({
        members: [+receiverId, id],
      });

      if (findRoom1 || findRoom2) {
        throw {
          name: "ChatRoomAlreadyCreate",
          message: "Chat Room Already Create",
        };
      }
      const result = await db.collection("RoomFriends").insertOne({
        members: [id, +receiverId],
        sender,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async findRoomFriend(req, res, next) {
    try {
      const { id } = req.user;
      await client.connect();
      const db = client.db("ranchat");

      const result = await db
        .collection("RoomFriends")
        .find({
          members: { $all: [+id] },
        })
        .toArray();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async findRoomFriendById(req, res, next) {
    try {
      const { id } = req.user;
      await client.connect();
      const db = client.db("ranchat");

      const result = await db
        .collection("RoomFriends")
        .find({
          members: { $all: [+id] },
        })
        .toArray();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoomFriend(req, res, next) {
    try {
      const { roomfriendid } = req.params;
      await client.connect();
      const db = client.db("ranchat");
      if (roomfriendid) {
        const messages = await db.collection("RoomFriends").deleteOne({
          _id: ObjectId(roomfriendid),
        });

        if (messages) {
          res.status(201).json({
            message: "Delete convertation Successfull",
          });
        } else {
          throw {
            name: "FailedToDeleteConvertation",
            message: "Failed To Delete Convertation",
          };
        }
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MessageController;
