require('dotenv').config();
const express = require("express");
const cors = require("cors");
const chatRoute = require('./routes/chatRoute');
const userRoute = require('./routes/userRoute');
const mongoDBConnection = require('./utils/MongoDBConnection');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./utils/passportConfig');

mongoDBConnection(process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = ["http://localhost:5173", "https://zenvio-five.vercel.app"];
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session
app.use(session({
    secret: '2@#$5@!%s@#$',
    saveUninitialized: true,
    resave: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("World");
});

app.use('/chat', chatRoute);
app.use('/user', userRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
