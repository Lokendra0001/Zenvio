require('dotenv').config();
const express = require("express");
const cors = require("cors");
const chatRoute = require('./routes/chatRoute');
const userRoute = require('./routes/userRoute');
const mongoDBConnection = require('./utils/MongoDBConnection');
const cookieParser = require('cookie-parser');

mongoDBConnection(process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigin = ["http://localhost:5173", "https://zenvio-five.vercel.app"]
app.use(cors(
    {
        origin: allowedOrigin,
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())


app.use('/', chatRoute);
app.use('/user', userRoute)

app.listen(PORT, () => {
    console.log("Server running on port 5000");
});
