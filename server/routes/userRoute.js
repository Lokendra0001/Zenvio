const { Router } = require('express');
const checkAuthentication = require('../middlewares/auth');
const passport = require('../utils/passportConfig');
const route = Router();
const { handleSignUp, handleSignIn, handleGetCurrentUser, handleLogout, handleGoogleLogin, handleGoogleLoginFailed } = require('../controller/user');


route.post('/signup', handleSignUp)

route.post('/signin', handleSignIn)


route.get('/getCurrentUser', checkAuthentication, handleGetCurrentUser)
route.get('/logout', checkAuthentication, handleLogout);


// Trigger Google login
route.get("/google-login", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
route.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/user/google-login/failed" }), handleGoogleLogin

);


// Login failed
route.get("/google-login/failed", handleGoogleLoginFailed);

module.exports = route;