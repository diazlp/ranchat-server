const Redis = require("ioredis");
const redis = new Redis({
  port: 13019,
  host: "redis-13019.c284.us-east1-2.gce.cloud.redislabs.com",
  password: "Pbhxx8MsMYykPRx3TBrBfzs9lM2M3q98",
});

module.exports = redis;
