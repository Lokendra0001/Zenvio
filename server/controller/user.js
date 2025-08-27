const User = require('../models/user_model');
const { generateTokenAndSendCookie } = require('../utils/auth');




const handleSignUp = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const isAlreadyUser = await User.findOne({ email });
        if (isAlreadyUser) return res.status(409).json({ msg: "User Already there. please Login!" });
        const user = await User.create({ fullName, email, password });

        generateTokenAndSendCookie(req, res, user);

        const { password: _, ...userWithoutPass } = user.toObject();

        return res.status(201).json({ msg: "User Signup Successfully!", user: userWithoutPass });
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

const handleSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "Invalid Email! Please try another." })

        const isUser = await user.verifyPassword(password);
        if (!isUser) return res.status(401).json({ msg: "Invalid Password!" });

        generateTokenAndSendCookie(req, res, user);

        const { password: _, ...userWithoutPass } = user.toObject();

        return res.status(200).json({ msg: "User Signin Successfully!", user: userWithoutPass })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

const handleGetCurrentUser = async (req, res) => {
    try {

        const { _id } = req.user;
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ msg: "No User Found! Please Login First." })

        const { password: _, ...userWithoutPass } = user.toObject();

        return res.status(200).json({ msg: `Welcome Back ${user.fullName}`, user: userWithoutPass })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

const handleLogout = async (req, res) => {
    try {

        res.clearCookie("connect.sid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        res.clearCookie("cookie_z8y4r1", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        return res.status(200).json({ msg: "Logout Successfully!" });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

const handleGoogleLogin = async (req, res) => {
    try {
        const profile = req.user;

        let user = await User.findOne({ userGoogleId: profile?.id });

        if (!user) {
            user = await User.create({
                fullName: profile.displayName,
                userGoogleId: profile.id,
                email: profile.emails?.[0]?.value || null
            });
        }

        // Generate JWT cookie
        generateTokenAndSendCookie(req, res, user);
        console.log("HELLO")

        // Redirect to frontend after login
        res.redirect(`http://localhost:5173/?login=success1`);

        // res.redirect(`https://zenvio-five.vercel.app/?login=success`);
    } catch (err) {
        console.error(err);
        res.redirect(`https://zenvio-five.vercel.app/?login=failed`);
    }
}

const handleGoogleLoginFailed = (req, res) => {
    res.status(401).json({ msg: "Google login failed" });
}

module.exports = { handleSignUp, handleSignIn, handleLogout, handleGetCurrentUser, handleGoogleLogin, handleGoogleLoginFailed }