const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const router = require('./routes/router');
const port = 3000;

const path = require('path');

//mongoose and database connections
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

//sessions and authentication
const sessionConfig = {
    //store,
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
const session = require('express-session')
app.use(session(sessionConfig)); //creates session
app.set('trust proxy', 1)
const User = require('./models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.use(passport.session());
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));//use local strategy 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set up templating engines using ejs-mate and ejs
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set path for obtaining files
app.use(express.static(path.join(__dirname, 'public'))),


app.use('/', router);
app.listen(port, () => {
    console.log('listening');
    })