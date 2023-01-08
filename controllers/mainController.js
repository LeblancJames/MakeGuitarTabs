const passport = require('passport');
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
    try{
        const {firstname, lastname, email, username, password} = req.body;
        const user = new User({firstname, lastname, email, username});
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Successfully created account')
        res.redirect('/');//not template, link
    }catch(err){
        req.flash('error', err.message);
        res.redirect('/register') //not template, link
    }
})

module.exports.login = (req, res) => {
    req.flash('success', 'Login successful')
    res.redirect('/');
    console.log(req.user);
}

module.exports.logout =(req, res, next) => {

    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Logout successful')
        res.redirect('/');
      });
}

module.exports.myTabs = (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'Please sign in to view your tabs.')
        return res.redirect('/')
    } 
    res.render('./templates/myTabs');
}





