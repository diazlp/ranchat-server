const axios = require("axios");
const FormData = require("form-data");

async function imageKit(buffer, originalname) {
  try {
    let image = new FormData();
    // console.log(image, "=========");
    image.append("file", buffer.toString("base64"));
    image.append("fileName", originalname);
    const key = "private_6ZohOncYbcXkiifyjOC5eaJz5qM=:";
    let encodedKey = Buffer.from(key).toString("base64");
    // console.log(buffer, "=========");
    return await axios({
      url: "https://upload.imagekit.io/api/v1/files/upload",
      method: "post",
      data: image,
      headers: {
        ...image.getHeaders(),
        Authorization: `Basic ${encodedKey}`,
      },
    });
  } catch (error) {
    // console.log(error);
    // next(error);
  }
}

module.exports = { imageKit };
