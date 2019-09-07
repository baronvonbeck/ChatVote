// chat_handlers.js 
'use strict';


var CHAT_HANDLERS = new function() {
    this.current_username = "Anonymous";
    this.socket = null;
    this.typingTimer = null;
    this.isTyping = false;


    this.addSocketEventListeners = function() {
        // make connection
        CHAT_HANDLERS.socket = io.connect();


        // Connect to a specific room
        CHAT_HANDLERS.socket.on("connect", function() {
            CHAT_HANDLERS.socket.emit(CHAT_CONSTANTS.SOCKET_CHAT_ROOM_NAME, chatRoom);
        });
    
        // Listen on new user connected to room
        CHAT_HANDLERS.socket.on(CHAT_CONSTANTS.SOCKET_USER_JOINED, (data) => {
            CHAT_HANDLERS.addNewUserConnectedToRoom(data);
        });


        // Emit message
        CHAT_CONSTANTS.MESSAGE_SEND_BUTTON_EL.addEventListener(
            "click", function() {
                CHAT_HANDLERS.socketEmitMessage();
            }, false);
    
        // Listen on new_message
        CHAT_HANDLERS.socket.on(CHAT_CONSTANTS.SOCKET_NEW_MESSAGE, (data) => {
            CHAT_HANDLERS.addMessageToChatroom(data);
        });
    

        // Emit a username change
        CHAT_CONSTANTS.USERNAME_SEND_BUTTON_EL.addEventListener(
            "click", function() {
                CHAT_HANDLERS.socketEmitUsernameChange();
            }, false);
    

        // Emit a User is Typing message
        CHAT_CONSTANTS.MESSAGE_TEXT_EL.addEventListener("keyup", () => {
            CHAT_HANDLERS.socketEmitTyping();
        }, false);
    
        // Listen on typing
        CHAT_HANDLERS.socket.on(CHAT_CONSTANTS.SOCKET_TYPING, (data) => {
            CHAT_HANDLERS.addUserToCurrentlyTypingList(data);
        });

        // Listen on done typing
        CHAT_HANDLERS.socket.on(CHAT_CONSTANTS.SOCKET_DONE_TYPING, (data) => {
            CHAT_HANDLERS.removeUserFromCurrentlyTypingList(data);
        });
    };



    // emit a new message to all other users in chat room
    this.socketEmitMessage = function() {
        CHAT_HANDLERS.socket.emit(CHAT_CONSTANTS.SOCKET_NEW_MESSAGE, 
            {message : CHAT_CONSTANTS.MESSAGE_TEXT_EL.value});

        CHAT_CONSTANTS.MESSAGE_TEXT_EL.value = "";

        clearTimeout(CHAT_HANDLERS.typingTimer);  // clear previous timer
        CHAT_HANDLERS.socketEmitDoneTyping();
    };


    // change current username
    this.socketEmitUsernameChange = function() {
        this.current_username = CHAT_CONSTANTS.USERNAME_EL.value;
        CHAT_HANDLERS.socket.emit(CHAT_CONSTANTS.SOCKET_NEW_USERNAME, 
            {username : CHAT_CONSTANTS.USERNAME_EL.value});
        CHAT_CONSTANTS.USERNAME_EL.value = "";
    };


    // emit typing message to other users, and set up done typing timer
    this.socketEmitTyping = function() {
        clearTimeout(CHAT_HANDLERS.typingTimer);  // clear previous timer

        if (CHAT_CONSTANTS.MESSAGE_TEXT_EL.value) {
            
            if (!CHAT_HANDLERS.isTyping) {
                CHAT_HANDLERS.socket.emit(CHAT_CONSTANTS.SOCKET_TYPING);
            }  // if user wasn't previously typing, then emit typing message

            CHAT_HANDLERS.isTyping = true;
            
            CHAT_HANDLERS.typingTimer = setTimeout(function() {  
                CHAT_HANDLERS.socketEmitDoneTyping();
            }, CHAT_CONSTANTS.DONE_TYPING_INTERVAL);
        }
    };


    // clear typing message from other users
    this.socketEmitDoneTyping = function() {
        // start the countdown and then emit user is done typing, 
        // so the User is Typing message can be removed
        CHAT_HANDLERS.isTyping = false;
        CHAT_HANDLERS.socket.emit(CHAT_CONSTANTS.SOCKET_DONE_TYPING);
    };


    // add a new user connection message to the room
    this.addNewUserConnectedToRoom = function(data) {
        CHAT_CONSTANTS.CHATROOM_EL.innerHTML += 
            "<p class='message'>----New user connected: " + data.username + "</p>";
    }


    // add an incoming new message to the chatroom
    this.addMessageToChatroom = function(data) {
        CHAT_CONSTANTS.FEEDBACK_EL.innerHTML = '';
        CHAT_CONSTANTS.CHATROOM_EL.innerHTML += 
            "<p class='message'>" + data.username + ": " + data.message + "</p>";
    };


    // add a user to the currently typing list
    this.addUserToCurrentlyTypingList = function(data) {
        CHAT_CONSTANTS.FEEDBACK_EL.innerHTML += "<p><i>" + data.username + " is typing a message..." + "</i></p>";
    };


    // add a user to the currently typing list
    this.removeUserFromCurrentlyTypingList = function(data) {
        CHAT_CONSTANTS.FEEDBACK_EL.innerHTML = '';
    };
}