const express = require('express');
const engine = require('ejs-mate');
const app = express();
const port = 3000;
const path = require('path');

//access variables from models
const {fretboard} = require('./models/fretboard');

//set up templating engines using ejs-mate and ejs
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set path for obtaining files
app.use(express.static(path.join(__dirname, '/public/'))),





app.get('/', (req, res) => {
    //create fretboard according to number of strings and number of frets
    let numberOfStrings = fretboard.numberOfStrings;
    let numberOfFrets = fretboard.numberOfFrets;
    let singleFretMarkPositions = fretboard.singleFretMarkPositions;
    let doubleFretMarkPositions = fretboard.doubleFretMarkPositions;
    res.render('./templates/home' , {
        numberOfStrings, 
        numberOfFrets, 
        singleFretMarkPositions, 
        doubleFretMarkPositions,
    });
})

app.listen(port, () => {
    console.log('listening');
})

