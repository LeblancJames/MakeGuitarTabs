
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
//const User = require('/models/users');
//const passport = require('passport');


router.route('/')
    .get(mainController.home)

// router.route('/forgot-password')
//     .get((req, res) => {
//     res.send(User);
//     //res.render('./templates/forgotpassword');
//     })

router.route('/register')
    .get(mainController.renderRegister)
    .post(mainController.register)

// router.route('/mytabs')
//     .get(mainController.)


module.exports = router;
