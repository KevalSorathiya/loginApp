require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(`mongodb://localhost:27017/${process.env.DATABASE_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("connection successfully done");
}).catch((error) => {
    console.log(error);
});