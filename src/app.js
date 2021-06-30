require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 8000;
const cookieParser = require('cookie-parser');
const userRouter = require("./routers/user");

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "templates/views");
const partials_path = path.join(__dirname, "templates/partials");

app.set("view engine", "hbs");
app.set("views", templates_path);
app.use(express.static(static_path));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(userRouter);
hbs.registerPartials(partials_path);


app.listen(port, () => {
    console.log(`server started from port ${port}`);
});