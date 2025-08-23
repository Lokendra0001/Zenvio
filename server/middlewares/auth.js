const { verifyToken } = require("../utils/auth");

const checkAuthentication = (req, res, next) => {
    try {
        const token = req.cookies?.cookie_z8y4r1;

        if (!token) {
            return res.status(401).json({ msg: "Please Login First!" });
        }

        const user = verifyToken(token);

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token. Please login again." });
    }
};

module.exports = checkAuthentication;
