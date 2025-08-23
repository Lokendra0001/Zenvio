const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET;

const generateTokenAndSendCookie = (req, res, user) => {
    const userPayload = {
        _id: user._id,
        email: user.email
    };

    const token = jwt.sign(userPayload, jwtSecret);

    // Remove Cookie If It exist 
    res.clearCookie(
        "cookie_z8y4r1", {
        httpOnly: true,       // prevents JS access (XSS protection)
        secure: process.env.NODE_ENV === "production", // only use Secure in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
    }
    )

    // Create Cookie 
    res.cookie("cookie_z8y4r1", token, {
        httpOnly: true,       // prevents JS access (XSS protection)
        secure: process.env.NODE_ENV === "production", // only use Secure in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
    });
}

const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
}

module.exports = { generateTokenAndSendCookie, verifyToken }