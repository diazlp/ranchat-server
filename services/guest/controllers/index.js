class GuestController {
  static async index(req, res, next) {
    try {
      res.status(200).json({
        message: "server is running",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = GuestController;
