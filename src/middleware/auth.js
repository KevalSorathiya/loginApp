const jwt = require("jsonwebtoken");
const Register = require('../models/register');
require('dotenv').config();

const auth = async(req, res, next) => {
    try {
        let token = req.cookies.jwt;
        let verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        let user = await Register.findOne({ _id: verifyUser._id });
        console.log(user);

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;