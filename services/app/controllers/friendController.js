const { User, Friend } = require("../models");
class FriendController {
  static async sendFriendRequest(req, res, next) {
    try {
      const { id } = req.user;
      const { friendId } = req.body;
      if (!friendId) {
        throw {
          name: "CannotAddGuestAccount",
          message: "Cannot Add Guest Account",
        };
      }
      //check friendId is type guest/registeredUser
      const checkedUser = await User.findByPk(friendId);
      if (!checkedUser) {
        throw {
          name: "UserNotFound",
          message: "User not found",
        };
      }
      //check if friend have sent friend request
      const findFriendRequest = await Friend.findOne({
        where: {
          UserId: friendId,
          FriendId: id,
        },
      });
      if (findFriendRequest) {
        await Friend.update(
          { friendStatus: true },
          {
            where: {
              UserId: friendId,
              FriendId: id,
            },
          }
        );
      } else {
        //if no error & no duplicate friend request create friend request
        const newFriend = await Friend.create({
          UserId: id,
          FriendId: friendId,
          friendStatus: "false",
        });

        // res status not complete //
        res.status(200).json({
          friend: {
            id: checkedUser.id,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async friendList(req, res, next) {
    try {
      const { id } = req.body; // req.user
      const findFriends = await Friend.findAll({
        where: {
          UserId: id,
          friendStatus: true,
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
            // include: [
            //   {
            //     model: Profile,
            //     attributes: {
            //       exclude: ["createdAt", "updatedAt"],
            //     },
            //   },
            // ],
          },
        ],
      });

      res.status(200).json({
        friendList: findFriends,
      });
    } catch (err) {
      next(err);
    }
  }

  static async friendRequestList(req, res, next) {
    try {
      const { id } = req.body;
      const findFriendRequest = await Friend.findAll({
        where: {
          FriendId: id,
          friendStatus: false,
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
            // include: [
            //   {
            //     model: Profile,
            //     attributes: {
            //       exclude: ["createdAt", "updatedAt"],
            //     },
            //   },
            // ],
          },
        ],
      });

      res.status(200).json({
        friendList: findFriendRequest,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FriendController;
