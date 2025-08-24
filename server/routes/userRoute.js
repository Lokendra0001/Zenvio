const { Router } = require('express');
const User = require('../models/user_model');
const { generateTokenAndSendCookie } = require('../utils/auth');
const checkAuthentication = require('../middlewares/auth');
const passport = require('../utils/passportConfig');
const route = Router();

route.post('/signup', async (req, res) => {
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
})

route.post('/signin', async (req, res) => {
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
})


route.get('/getCurrentUser', checkAuthentication, async (req, res) => {
    try {

        const { _id } = req.user;
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ msg: "No User Found! Please Login First." })

        const { password: _, ...userWithoutPass } = user.toObject();

        return res.status(200).json({ msg: `Welcome Back ${user.fullName}`, user: userWithoutPass })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

// Trigger Google login
route.get("/google-login", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
route.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/user/google-login/failed" }),
    async (req, res) => {
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

            // Redirect to frontend after login
            res.redirect(`http://localhost:5173/?login=success`);
        } catch (err) {
            console.error(err);
            res.redirect(`http://localhost:5173/?login=failed`);
        }
    }
);


// Login failed
route.get("/google-login/failed", (req, res) => {
    res.status(401).json({ msg: "Google login failed" });
});

module.exports = route;