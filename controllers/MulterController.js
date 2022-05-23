const { imageKit } = require("../middlewares/multer");

class MulterController {
  static async sendImage(req, res, next) {
    try {
      const { buffer, originalname } = req.file;

      const result = await imageKit(buffer, originalname);
      const image = result.data.url;

      res.status(200).json({ imageUrl: image });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MulterController;
