require('dotenv').config();
const express = require("express");
const cors = require("cors");
const chatRoute = require('./routes/chatroutes');

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigin = ["http://localhost:5173", "https://zenvio-five.vercel.app"]
app.use(cors(
    {
        origin: allowedOrigin
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/', chatRoute)

app.listen(PORT, () => {
    console.log("Server running on port 5000");
});
