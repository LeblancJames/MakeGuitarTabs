const User = require('../models/users')

module.exports.home = (req, res) => {
    res.render('./templates/home');
;}

// module.exports.forgotPassword = ('/forgot-password')
// .get((req, res) => {
// res.send(User);
// //res.render('./templates/forgotpassword');
// })

module.exports.renderRegister = (req, res) => {
    res.render('./templates/register');
};

module.exports.register = (async (req, res) => {
//res.render('./templates/register');
    res.send(req.body);
})

// module.exports.myTabs = ('/mytabs')
// .get((req, res) => {
// res.render('./templates/myTabs');
// })





