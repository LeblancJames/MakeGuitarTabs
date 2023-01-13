
// if (process.env.NODE_ENV !== "production"){
//     require('dotenv').config();
// }
const express = require('express');
const app = express();
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({extended:true, limit: '100mb'}));
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const router = require('./routes/router');
const port = 3000;
//set path for obtaining files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public'))),


//set up templating engines using ejs-mate and ejs
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//mongoose and database connections
const dbUrl = process.env.DB_URL;
const dataurl = 'mongodb://127.0.0.1:27017';
// mongoose.connect(dbUrl);
mongoose.set('strictQuery', false);
mongoose.connect(dataurl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

//sessions and authentication
const session = require('express-session')
const MongoStore = require('connect-mongo');

let store = new MongoStore({
    mongoUrl: dataurl,
    collection: "sessions",
    secret: 'asecret',
    touchAfter: 24 * 3600, 

 });

const sessionConfig = {
    store: store,
    name: '_giwm',
    store,
    secret: 'mysecretisthis',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),  //cookie expires in a week
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

const User = require('./models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.use(session(sessionConfig)); //creates session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//use local strategy 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//flash
const flash = require('connect-flash');
app.use(flash());
app.use((req,res,next) => { 
    res.locals.currentUser = req.user; //checks for a user
    res.locals.success = req.flash('success');//gives access to success flash key
    res.locals.error = req.flash('error');
    next();
})


const mongoSanitize = require('express-mongo-sanitize')
app.use(mongoSanitize());
const helmet = require('helmet');
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": [
                "'self'",
                "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js",
                ],
            "script-src-elem": [
                "'self'",
                "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
                ],
            "script-src-attr": [
                "'self'",
                ],
            "style-src": [
                "'self'",
                "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"],
        },
    }) 
);


//routes
app.use('/', router);
app.listen(port, () => {
    console.log('listening');
    })