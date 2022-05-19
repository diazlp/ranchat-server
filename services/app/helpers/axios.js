const axios = require("axios");

const axiosRandomize = axios.create({
  baseURL: "https://ciprand.p3p.repl.co",
});

module.exports = { axiosRandomize };
