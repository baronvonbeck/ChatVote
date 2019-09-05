
module.exports = function(server) {
    const express = require('express');
    const router = express.Router();
    const io = require('socket.io')(server);

    router.get("/*", (req, res, next) => {

        res.render('chat', {chatRoom: req.url});
    });


    io.on('connection', (socket) => {
        console.log('New connection');

        //default username
        socket.username = "Anonymous";
        console.log(socket.handshake.url);


        socket.on('chat', function(chat) {
            if (socket.room)
                socket.leave(socket.chat);

            socket.room = chat;
            socket.join(chat);
        });

        //listen on change_username
        socket.on('change_username', (data) => {
            socket.username = data.username;
        });

        //listen on new_message
        socket.on('new_message', (data) => {
            //broadcast the new message
            //io.sockets.emit('new_message', {message : data.message, username : socket.username});
            io.to(socket.room).emit('new_message', {message : data.message, username : socket.username});
        });

        //listen on typing
        socket.on('typing', (data) => {
            socket.broadcast.to(socket.room).emit('typing', {username : socket.username});
        });
    });

    return router;
};





