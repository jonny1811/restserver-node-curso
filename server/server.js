require('./config/config');

const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/usuario'));
app.use(require('./routes/login'));
  

mongoose.connect(process.env.URLDB, (err, res) => {
    if(err) throw err;

    console.log('Base de datos ONLINE');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', 3000);
});