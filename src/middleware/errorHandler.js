const logger = require("../utils/logger/logger");

const errorHandler = (err, _req, res, _next) => {
  logger.error(`${err.status} ${err.message}`);
  res.status(err.status || 500).send(err.message);
};

module.exports = errorHandler;
