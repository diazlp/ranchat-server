const { User, Friend, Profile } = require("../models");
class FriendController {
  static async sendFriendRequest(req, res, next) {
    try {
      const { id } = req.user;
      const { friendId } = req.body;
      //check if friendId is falsy
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
          friendStatus: false,
        },
      });
      if (findFriendRequest) {
        //update friend that has requested before
        await Friend.update(
          { friendStatus: true },
          {
            where: {
              UserId: friendId,
              FriendId: id,
            },
          }
        );

        //create new row to add friend to friend list
        await Friend.create({
          UserId: id,
          FriendId: friendId,
          friendStatus: true,
        });
      } else {
        //check if user has made same request before
        const myRequest = await Friend.findOne({
          where: {
            UserId: id,
            FriendId: friendId,
          },
        });
        if (myRequest) {
          throw {
            name: "CannotDuplicateFriendRequest",
            message: "Duplicate Friend Request",
          };
        } else {
          //if no error & no duplicate friend request from each side
          await Friend.create({
            UserId: id,
            FriendId: friendId,
            friendStatus: false,
          });
        }
      }
      // res status if success (not complete)//
      res.status(201).json({
        friend: {
          id: checkedUser.id,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async friendList(req, res, next) {
    try {
      const { id } = req.user;
      const findFriends = await Friend.findAll({
        where: {
          UserId: id,
          friendStatus: true,
        },
        include: [
          {
            model: User,
            as: "FriendData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
            include: [
              {
                model: Profile,
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
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
      const { id } = req.user;
      const findFriendRequest = await Friend.findAll({
        where: {
          FriendId: id,
          friendStatus: false,
        },
        include: [
          {
            model: User,
            as: "userData",
            attributes: {
              exclude: ["password", "verificationCode", "isVerified"],
            },
          },
        ],
      });

      res.status(200).json({
        friendRequestList: findFriendRequest,
      });
    } catch (err) {
      next(err);
    }
  }

  static async acceptFriendRequest(req, res, next) {
    try {
      const { id } = req.user;
      const { friendId } = req.params;

      const find = await Friend.findOne({
        where: {
          UserId: friendId,
          FriendId: id,
          friendStatus: true,
        },
      });
      if (find) {
        throw { name: "AlreadyInFriendlist", message: "Already In Friendlist" };
      }
      //update from friend request

      await Friend.update(
        { friendStatus: true },
        {
          where: {
            UserId: friendId,
            FriendId: id,
            friendStatus: false,
          },
        }
      );

      //create new row to add in friend list
      await Friend.create({
        UserId: id,
        FriendId: friendId,
        friendStatus: true,
      });

      // res status not complete
      res.status(200).json({
        message: "Success Accept Friend Request",
      });
    } catch (err) {
      next(err);
    }
  }

  static async rejectFriendRequest(req, res, next) {
    try {
      const { id } = req.user;
      const { friendId } = req.params;

      //destroy friend request from user2
      await Friend.destroy({
        where: {
          UserId: friendId,
          FriendId: id,
          friendStatus: false,
        },
      });

      // res status not complete
      res.status(200).json({
        message: "Success Reject Friend Request",
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteFriend(req, res, next) {
    try {
      const { id } = req.user;
      const { friendId } = req.params;
      //destroy user relation
      await Friend.destroy({
        where: {
          UserId: id,
          FriendId: friendId,
          friendStatus: true,
        },
      });

      //destroy friend(user2) relation
      await Friend.destroy({
        where: {
          UserId: friendId,
          FriendId: id,
          friendStatus: true,
        },
      });

      // res status not complete
      res.status(200).json({
        message: "Success Delete Friend",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FriendController;
