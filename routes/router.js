
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

router.route('/saveTab')
    .post(mainController.saveTab)

router.route('/deleteTab')
    .post(mainController.deleteTab)

router.route('/forgotpassword')
    .get(mainController.renderforgotPassword)
    .post(mainController.forgotPassword)

router.route('/resetpassword/:id/:token')
    .get(mainController.renderResetPassword)
    .post(mainController.resetPassword)

router.route('/users/:id/verify/:token')
    .get(mainController.verifyEmail)

router.route('/verify')
    .get(mainController.verifyPage)

router.route('/error')
    .get(mainController.errorPage)

router.route('*')
    .get(mainController.errorPage)
module.exports = router;
