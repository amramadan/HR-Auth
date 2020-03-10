const router = require("express").Router();

router.get("/", homePage);

function homePage(req, res) {
  res.status(201).send(); // will send html for our react frontend in future
}

module.exports = function (app) {
  app.use("/", router);
};