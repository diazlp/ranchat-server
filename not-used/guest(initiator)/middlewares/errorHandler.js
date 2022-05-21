module.exports = (err, req, res, next) => {
  switch (err.name) {
    default:
      res.status(500).json({
        message: "Internal server error",
        err,
      });
      break;
  }
};
