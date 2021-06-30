const express = require('express');
const router = new express.Router();
require("../db/connection");
const Register = require('../models/register');
const bcrypt = require("bcryptjs");
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
    res.render("index");
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', auth, async(req, res) => {
    try {

        //user logout only one device 
        req.user.tokens = req.user.tokens.filter((currentElement) => {
            return currentElement.token !== req.token;
        });

        //user logout from all devices 
        // req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("logout succesfully");
        await req.user.save();
        res.render('login');
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/secret', auth, (req, res) => {
    res.render('secret');
});


router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword) {
            let createUser = new Register(req.body);

            const token = await createUser.generateAuthToken();

            res.cookie("jwt", token, { expires: new Date(Date.now() + 120000), httpOnly: true });

            let data = await createUser.save();
            if (!data) {
                res.status(401).send("data is not saved successfully");
            } else {
                return res.status(201).render('login');
            }
        } else {
            res.status(402).send("password and confirm password are not same");
        }

    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async(req, res) => {
    try {
        let user = await Register.findOne({ email: req.body.email });
        if (!user) {
            res.status(402).send("please enter valid email address");
        } else {
            let isMatch = await bcrypt.compare(req.body.password, user.password);

            const token = await user.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 120000),
                httpOnly: true,
                //  secure:true 
            });

            if (isMatch) {
                return res.status(201).render('home');
            } else {
                res.status(404).send("Please enter a valid password");
            }
        }
    } catch (error) {
        res.status(402).send("Error is:" + error)
    }
});

router.get("*", (req, res) => {
    res.status(404).render('pageNotFound');
});


module.exports = router;