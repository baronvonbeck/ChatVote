
module.exports = function(server) {
    const express = require('express');
    const router = express.Router();
    const io = require('socket.io')(server).set('transports', ['websocket']);

    router.get("/", (req, res, next) => {
        res.render('chat_search');
    });
    router.get("/*", (req, res, next) => {
        var newUrl = "/" + req.url.replace(/[\\\/]+/g, '');
        if (req.url != newUrl) {
            res.redirect("/chat" + newUrl);
            return;
        }

        res.render('chat', {chatRoom: newUrl});
    });


    io.on('connection', (socket) => {
        const SOCKET_CHAT_ROOM_NAME         = "change_room_name";
        const SOCKET_USER_JOINED            = "user_joined";
        const SOCKET_TYPING                 = "typing";
        const SOCKET_DONE_TYPING            = "done_typing";
        const SOCKET_NEW_MESSAGE            = "new_message";
        const SOCKET_NEW_USERNAME           = "new_username";

        console.log('New connection: ' + socket.handshake.url);

        // default username
        socket.username = "Anonymous";
        

        // join a new socket room, and emit user joined message
        socket.on(SOCKET_CHAT_ROOM_NAME, function(newChatRoomName) {
            if (socket.room && socket.room != newChatRoomName) {
                socket.leave(socket.room);
                socket.room = newChatRoomName;
                socket.join(newChatRoomName);

                socket.emit(SOCKET_USER_JOINED, 
                    {username : socket.username + " (You)"});
                socket.broadcast.to(socket.room).emit(SOCKET_USER_JOINED, 
                    {username : socket.username});
            }
            else if (!socket.room) {
                socket.room = newChatRoomName;
                socket.join(newChatRoomName);

                socket.emit(SOCKET_USER_JOINED, 
                    {username : socket.username + " (You)"});
                socket.broadcast.to(socket.room).emit(SOCKET_USER_JOINED, 
                    {username : socket.username});
            }
        });


        // listen on change_username, to change current username
        socket.on(SOCKET_NEW_USERNAME, (data) => {
            socket.username = this.formatHTML(data.username);
        });


        // listen on new_message to emit new message to all users
        socket.on(SOCKET_NEW_MESSAGE, (data) => {
            var formattedMessage = this.formatHTML(data.message);
            var dateSent = Date.now();

            socket.emit(SOCKET_NEW_MESSAGE, 
                {message : formattedMessage, username : socket.username + " (You)",
                messageDate : dateSent});
            socket.broadcast.to(socket.room).emit(SOCKET_NEW_MESSAGE, 
                {message : formattedMessage, username : socket.username,
                 messageDate : dateSent});
        });


        // listen on typing, to emit User is Typing to all other users
        socket.on(SOCKET_TYPING, (data) => {
            socket.broadcast.to(socket.room).emit(SOCKET_TYPING, 
                {username : socket.username});
        });


        // listen on typing, to emit User is Typing to all other users
        socket.on(SOCKET_DONE_TYPING, (data) => {
            socket.broadcast.to(socket.room).emit(SOCKET_DONE_TYPING, 
                {username : socket.username});
        });


        // formats possible html (also done on server side)
        this.formatHTML = function(text) {
            return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        };
    });


    return router;
};





