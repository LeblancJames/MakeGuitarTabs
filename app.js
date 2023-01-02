const express = require('express');
const engine = require('ejs-mate');
const app = express();
const port = 3000;
const path = require('path');

//set up templating engines using ejs-mate and ejs
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set path for obtaining files
app.use(express.static(path.join(__dirname, '/public/'))),

app.get('/', (req, res) => {
    res.render('./templates/home');
})

app.listen(port, () => {
    console.log('listening');
})