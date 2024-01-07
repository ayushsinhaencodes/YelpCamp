const express=require('express');
const router=express.Router();
const users=require('../controllers/users')
const { storeReturnTo } = require('../models/middleware');
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const { reviewSchema } = require('../models/schemas');
const passport = require('passport');
router.get('/register',users.renderRegister);
router.post('/register',catchAsync(users.register));
router.get('/login',users.renderLogin);
router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    });
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)

router.get('/logout', users.logout);

module.exports=router; 