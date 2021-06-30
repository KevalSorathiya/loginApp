require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 8000;
require("./db/connection");
const Register = require('./models/register');
const bcrypt = require("bcryptjs");


const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "templates/views");
const partials_path = path.join(__dirname, "templates/partials");

app.set("view engine", "hbs");
app.set("views", templates_path);
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
hbs.registerPartials(partials_path);

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword) {
            let createUser = new Register(req.body);

            const token = await createUser.generateAuthToken();

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

app.post('/login', async(req, res) => {
    try {
        let user = await Register.findOne({ email: req.body.email });
        if (!user) {
            res.status(402).send("please enter valid email address");
        } else {
            let isMatch = await bcrypt.compare(req.body.password, user.password);

            const token = await user.generateAuthToken();
            console.log(token);

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

app.get("*", (req, res) => {
    res.status(404).render('pageNotFound');
});

app.listen(port, () => {
    console.log(`server started from port ${port}`);
});