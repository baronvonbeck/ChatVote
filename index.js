const express = require('express');
const path = require('path');

const apiRouter = require('./routes/api');
const mainRouter = require('./routes/main');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);
app.use('/', mainRouter);

app.use(function(req,res,next){
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});


const port = process.env.PORT || 3000;
const server = app.listen(port, (req, res, next) => {
    console.log("Server running on port: " + port); 
});