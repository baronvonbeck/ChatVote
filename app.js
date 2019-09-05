// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {
    const express = require('express');
    const path = require('path');
    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/', require('./routes/main'));
    app.use('/api', require('./routes/api'));
    

    app.use(function(req, res, next){
        var _send = res.send;
        var sent = false;
        res.send = function(data) {
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

    app.use('/chat/', require('./routes/chat_route')(server));
}




