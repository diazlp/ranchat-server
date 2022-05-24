const { MongoClient, ObjectId } = require("mongodb");
const { imageKit } = require("../middlewares/multer");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

class MessageController {
  static async addMessage(req, res, next) {
    try {
      const { roomfriendid, text } = req.body;
      let result;
      const { id } = req.user;
      await client.connect();
      const db = client.db("ranchat");

      if (req.file) {
        const { buffer, originalname } = req.file;
        let response = await imageKit(buffer, originalname);

        result = await db.collection("message").insertOne({
          roomFriendId: roomfriendid,
          sender: id,
          text: null,
          photo: response.data.url,
          createdAt: new Date(),
        });
      } else {
        result = await db.collection("message").insertOne({
          roomFriendId: roomfriendid,
          sender: id,
          text,
          photo: null,
          createdAt: new Date(),
        });
      }

      // let result;
      // if (text) {
      //   result = await db.collection("message").insertOne({
      //     roomFriendId: roomfriendid,
      //     sender: id,
      //     text,
      //     photo: null,
      //     createdAt: new Date(),
      //   });
      // } else if (photoMessage) {
      // result = await db.collection("message").insertOne({
      //   roomFriendId: roomfriendid,
      //   sender: id,
      //   text: null,
      //   photo,
      //   createdAt: new Date(),
      // });
      // }

      if (result) {
        return res.status(200).json({ message: "Message added successfully." });
      } else {
        throw {
          name: "AddMessageFailed",
          message: "Failed to add message to the database",
        };
      }
    } catch (error) {
      console.log("error: ", error);
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
            time: msg.createdAt,
          };
        });

        res.status(200).json(projectedMessages);
      }
    } catch (error) {
      // next(error);
    }
  }

  //// INI BELUM SELESAI KAH?
  // static async findLastMessage(req, res, next) {
  //   try {
  //     const { friendid } = req.params;
  //     const { id } = req.user;

  //     await client.connect();

  //     const db = client.db("ranchat");

  //     if (friendid) {
  //       const messages = await db
  //         .collection("message")
  //         .find({
  //           roomFriendId: friendid,
  //         })
  //         .sort({ createdAt: -1 })
  //         .toArray();

  //       const projectedMessages = messages.filter((msg) => {
  //         return msg.sender !== +id;
  //       });
  //       res.status(200).json(projectedMessages[0].text);
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async addRoomFriend(req, res, next) {
    try {
      const { receiverId, sender } = req.body;
      const { id } = req.user;
      await client.connect();
      const db = client.db("ranchat");

      const findRoom = await db.collection("RoomFriends").findOne({
        sender,
      });

      if (findRoom) {
        throw {
          name: "ChatRoomAlreadyCreate",
          message: "Chat Room Already Created",
        };
      }
      const result = await db.collection("RoomFriends").insertOne({
        members: [id, +receiverId],
        sender,
      });

      res.status(201).json(result);
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

      res.status(200).json(result);
    } catch (error) {
      // next(error);
    }
  }

  //// KODE DIBAWAH INI GA DIPAKE YAH? : UNTUK FITRAH
  // static async findRoomFriendById(req, res, next) {
  //   try {
  //     const { id } = req.user;
  //     await client.connect();
  //     const db = client.db("ranchat");

  //     const result = await db
  //       .collection("RoomFriends")
  //       .find({
  //         members: { $all: [+id] },
  //       })
  //       .toArray();
  //     res.status(200).json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  ////

  static async deleteRoomFriend(req, res, next) {
    try {
      const { roomfriendid } = req.params;
      await client.connect();

      const db = client.db("ranchat");

      if (roomfriendid) {
        const messages = await db.collection("RoomFriends").deleteOne({
          _id: ObjectId(roomfriendid),
        });

        if (messages.deletedCount) {
          res.status(200).json({
            message: "Delete conversation Successful",
          });
        } else {
          throw {
            name: "FailedToDeleteConversation",
            message: "Failed To Delete Conversation",
          };
        }
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MessageController;
