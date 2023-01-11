const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const passport = require('passport');


const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Token = require('../models/token');
const sendEmail = require('../utils/sendEmails');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

//used for forgot password
const JWT_SECRET = 'secret';
const payload = {
    email: User.email,
    id: User._id,
};
    

module.exports.home = (req, res) => {
    if(req.isAuthenticated()){
        //get user tab 
        let userId = req.user._id; 
        User.findById(userId, (err, user) => {
        if(err){
            res.redirect('/error');
        }else{
            if(user.tabs){
                let tabstring = JSON.stringify(user.tabs);//allow object to be passed to ejs
                let tab=JSON.parse(tabstring)
                res.render('./templates/home', {userId: userId, tab: tab}); //pass userId and userTabs to ejs file
            } else{
                res.render('./templates/home', {userId: null, tab: null});
            }
        }
    })
    } else{
        res.render('./templates/home', {userId: null, tab: null});
    };
}

module.exports.renderRegister = (req, res) => {
    res.render('./templates/register');
};

module.exports.register = (async (req, res) => {
    try{
        const {firstname, lastname, email, username, password} = req.body;
        const user = new User({firstname, lastname, email, username}); 
        const registeredUser = await User.register(user, password); //create user in user collection in database

        const token = await new Token({   
            userID: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save();
        const url = `http://localhost:3000/users/${user._id}/verify/${token.token}`  //link to send in email
        await sendEmail(user.email, 'Verify Email', url);

        res.redirect('/verify')//not template, link
          
    }catch(err){
        req.flash('error', err.message);
        res.redirect('/register') //not template, link
    }
})
//verify email after register
module.exports.verifyEmail = async(req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id});
        if(!user) return res.redirect('/error') 

        const token = await Token.findOne({
            userID: user._id,
            token: req.params.token
        });
        if(!token) return res.redirect('/error') 

        await User.updateOne({_id: user._id, verified: true});
        await token.remove()


        //test
        req.flash('success', 'Successfully verified email! Please login.')
        res.redirect('/');  

    } catch (error) {
        res.redirect('/error') 
    }
}

module.exports.login = async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if(!user.verified){
        let token = await Token.findOne({userID: user._id});
        if(!token){
            const token = await new Token({
                userID: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save();
            const url = `$(process.env.BASE_URL)/users/${user._id}/verify/${token.token}`
            await sendEmail(user.email, 'Verify Email', url);
        }
        return res.redirect('/verify') 
    }
    req.flash('success', 'Login successful')
    res.redirect('/');
}

module.exports.logout =(req, res, next) => {

    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Logout successful')
        res.redirect('/');
      });
}

module.exports.renderforgotPassword = (req, res) => {
    res.render('./templates/forgotpassword');
}


//forgot password post request
module.exports.forgotPassword = async (req, res) => {
    try{
    const user = await User.findOne({email: req.body.email});

    
    const secret = JWT_SECRET + user.password;
    const token = jwt.sign(payload, secret, {expiresIn: '15m'});
    const link = `http://localhost:3000/resetpassword/${user._id}/${token}`;
    await sendEmail(user.email, 'Reset Password', link);
    req.flash('success', 'Please check your email for instructions on how to reset your password.')
    res.redirect('/forgotpassword');
    }catch(err){
        req.flash('success', 'Please check your email for instructions on how to reset your password.')
    }
}

module.exports.renderResetPassword = async (req, res) => {
    const {id, token} = req.params;
res.redirect('/forgotpassword');
   
    try {
        const user = await User.findOne({_id: id});
        const secret = JWT_SECRET + user.password;
        const payload = jwt.verify(token, secret);
        res.render('./templates/resetPassword', {username: user.username});
    } catch (err) {
        res.redirect('/error');
    }
}

//post request for password reset
module.exports.resetPassword = async (req, res) => {
    const {id, token} = req.params;
    const {password} = req.body;
    try {
        const user = await User.findOne({_id: id});
        const secret = JWT_SECRET + user.password;
        const payload = jwt.verify(token, secret);
        user.setPassword(password, function() {
            user.save();
        });
        req.flash('success', 'Password changed.')
        res.redirect('/');
    } catch (err) {
        res.redirect('/error');
    }
}


module.exports.myTabs = (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'Please sign in to view your tabs.')
        return res.redirect('/')
    } 
    let userId = req.user._id; 
    User.findById(userId, (err, user) => {
        if(err){
            res.redirect('/error');
        }else{
            if(user.tabs){
                let tabstring = JSON.stringify(user.tabs);//allow object to be passed to ejs
                let tab=JSON.parse(tabstring)
                res.render('./templates/myTabs', {userId: userId, tab: tab}); //pass userId and userTabs to ejs file
            } else{
                res.render('./templates/myTabs', {userId: null, tab: null});
            }
        }
    })
}

//save tab button
module.exports.saveTab = (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'Please sign in to save your tab.');
        return res.redirect('/');
    } else if (req.isAuthenticated()) { 
        let userId = req.body.userId;
        let tabs = req.body.tabs;
        //find user using userId and update tab if one doesnt exist already
        User.findOneAndUpdate({ _id: userId}, 
            { $set: { tabs: tabs } },
            { new: true },
            (err, doc) => {
            if(err) {
              console.log("Error updating tabs: ", err);
              req.flash('error', 'Something went wrong.')
              return res.redirect('/mytabs')
            } else {
              console.log("Tabs updated: ", doc);
              req.flash('success', 'Saved tab successfully.')
              return res.redirect('/mytabs')
            }
          });
        
    }
    
}

module.exports.deleteTab = (req, res) => {
    let userId = req.body.userId;
    User.updateOne({_id: userId}, {$unset: {tabs: ""}}, function(err,result)
    {
        if (err) {
            req.flash('error', 'Something went wrong.');
            res.redirect('/myTabs')
        }else if (result.nModified === 0){
            req.flash('error', 'Something went wrong.');
            res.redirect('/myTabs')
        }else{
            req.flash('success', 'Tab deleted successfully.');
            res.redirect('/myTabs')
        }
    });
}
//redirect from my tabs to home page to edit tab
module.exports.editTab = (req, res) =>{
    let userId = req.body.userId;
    //access tabs of user id
    User.findOne({ _id: userId }, (err, user) => {
        if (err) {
            res.redirect('/error')
        }
        if (user) {
            res.redirect('/');
        } else {
            res.redirect('/error')
        }
    });
}

module.exports.verifyPage = (req, res) => {
    res.render('./templates/verify')
}

module.exports.errorPage = (req, res) => {
    res.render('./templates/error')
}
