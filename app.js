//Test client to ForgeRock platform API services
//simon.moffatt@forgerock.com

//Libs =================================================================================================

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');
app.use(bodyParser.json());

//Route files
var index = require('./routes/index.js');
var logout = require('./routes/logout.js');
var pair = require('./routes/pair.js');
var pairNotification = require('./routes/pairNotification.js');
var favourites = require('./routes/favourites.js');

//Globals ==============================================================================================
var port = 3001; //Listener port


//Routes ===============================================================================================
app.get('/', index.render);
app.post('/logout', logout.render);
app.get('/pair', pair.render);
app.post('/pairNotification', pairNotification.render);
app.post('/favourites', favourites.render)


//Start App
app.listen(port);
console.log('TVPlayer started on port ' + port);
