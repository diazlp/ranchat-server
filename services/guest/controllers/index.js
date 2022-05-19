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
      next(error);
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
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async eraseGuest(req, res, next) {
    try {
      const response = await GuestModel.deleteGuest(req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GuestController;
