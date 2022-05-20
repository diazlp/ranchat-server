class FriendContoller {
  static async sendFriendRequest(req, res, next) {
    try {
      const { userId } = req.params;
      const { friendId } = req.body;
      // const findFriendRequest = await Friend.findOne({
      //     where: {
      //         UserId: userId,
      //         FriendId: friendId
      //     }
      // })
    } catch (err) {
      next(err);
    }
  }
}
