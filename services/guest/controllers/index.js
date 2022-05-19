const GuestModel = require("../models");

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

  static async findGuests(req, res, next) {
    try {
      const response = await GuestModel.findGuestOnline();
      res.status(200).json(response);
    } catch (error) {
      console.log("error: ", error);
      // next(error);
    }
  }

  static async findGuestById(req, res, next) {
    try {
      const response = await GuestModel.findGuest(req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async addGuest(req, res, next) {
    try {
      const response = await GuestModel.createGuest();
      console.log("response: ", response);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteguest(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GuestController;
