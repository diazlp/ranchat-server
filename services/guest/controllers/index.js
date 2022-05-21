const GuestModel = require("../models");

class GuestController {
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
      console.log("addGuest");
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

  static async findRooms(req, res, next) {
    try {
      const response = await GuestModel.findRoom();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async randomRoom(req, res, next) {
    try {
      const { guestSocketId } = req.body;
      const findRooms = await GuestModel.findRoom();
      if (!findRooms.length) {
        await GuestModel.createRoom({ guestCaller: guestSocketId, guestCalled: null });
      } else {
        let response;
        let code;
        for (const room of findRooms) {
          if (!room.guestCalled) {
            response = await GuestModel.connectingGuest({ roomId: room._id, guestSocketId });
            code = 200;
            break;
          } else {
            response = await GuestModel.createRoom({ guestCaller: guestSocketId, guestCalled: null });
            code = 201;
          }
        }
        res.status(code).json(response);
      }
    } catch (error) {
      console.log("error: ", error);
      next(error);
    }
  }

  static async delRoom(req, res, next) {
    try {
      console.log("masuk");
      const response = await GuestModel.deleteRoom(req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GuestController;
