const passport = require("../middlewares").passport;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../db/models").user;
const router = require("express").Router();

router.post("/", login);

async function login(req, res) {
  passport.authenticate("local", { session: false }, (error, user) => {
    if (error || !user) {
      res.status(400).json({ error });
    }

    /** This is what ends up in our JWT */
    const payload = {
      username: user.username,
      expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS)
    };

    /** assigns payload to req.user */
    req.login(payload, { session: false }, error => {
      if (error) {
        res.status(400).send({ error });
      }
      let username = payload.username;
      /** generate a signed json web token and return it in the response */
      const token = jwt.sign(JSON.stringify(payload), "secret");

      /** assign our jwt to the cookie */
      res.cookie("jwt", jwt, { httpOnly: true, secure: true });
      res.status(200).send({ username });
    });
  })(req, res);
}

module.exports = function(app) {
  app.use("/login", router);
};
