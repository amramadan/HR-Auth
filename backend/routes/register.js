
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../db/models').user;
const router = require("express").Router();
const hashCost = require('../db/models').hashCost;

router.post("/", register);

async function register(req,res,err) {
    const { username, password } = req.body;
    console.log(req.body);
    // console.log("username"+username);
    
    // console.log("password"+password);
    try {
    const passwordHash = await bcrypt.hash(password, hashCost);
    const userDocument = new UserModel({ username, password });
    await userDocument.save();

    res.status(200).send({ username });

    } catch (error) {
        console.log(error);
        
    res.status(400).send({
        error: 'req body should take the form { username, password }',
    });
    }
};

module.exports = function (app) {
    app.use("/register",router)
}