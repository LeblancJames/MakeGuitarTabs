
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
//const User = require('/models/users');
const passport = require('passport');


router.route('/')
    .get(mainController.home)



router.route('/register')
    .get(mainController.renderRegister)
    .post(mainController.register)

router.route('/login')
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/'}), mainController.login)

router.route('/logout')
    .get(mainController.logout)

router.route('/mytabs')
    .get(mainController.myTabs)

router.route('/forgotpassword')
    .get(mainController.renderforgotPassword)
    .post(mainController.forgotPassword)
    
module.exports = router;
