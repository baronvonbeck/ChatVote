// chat_handlers.js 
'use strict';


var CHAT_HANDLERS = new function() {
    this.currentUsername = "Anonymous";
    this.socket = null;
    this.typingTimer = null;
    this.isTyping = false;
    this.currentlyTypingUsers = [];


    this.addAllEventListeners = function() {
        // make connection
        CHAT_HANDLERS.socket = io.connect({
            transports: ['websocket'], upgrade: false});


        // Connect to a specific room
        CHAT_HANDLERS.socket.on("connect", function() {
            CHAT_HANDLERS.currentUsername = CHAT_HANDLERS.getCookie(CHAT_CONSTANTS.COOKIE_USERNAME);
            CHAT_HANDLERS.currentUsername = (CHAT_HANDLERS.currentUsername.length > 0 ? 
                CHAT_HANDLERS.currentUsername : "Anonymous");

            CHAT_HANDLERS.socketEmitUsernameChange(CHAT_HANDLERS.currentUsername);

            CHAT_HANDLERS.socketEmitConnectToRoom();
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
        // Emit message on enter on text field
        CHAT_CONSTANTS.MESSAGE_TEXT_EL.addEventListener(
            "keydown", function(e) {
                if (e.keyCode == 13 && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    CHAT_HANDLERS.socketEmitMessage();
                }
            }, false);
        // Listen on new_message
        CHAT_HANDLERS.socket.on(CHAT_CONSTANTS.SOCKET_NEW_MESSAGE, (data) => {
            CHAT_HANDLERS.addMessageToChatroom(data);
        });
        // Emit a User is Typing message
        CHAT_CONSTANTS.MESSAGE_TEXT_EL.addEventListener("keyup", (e) => {
            if (e.keyCode != 13)
                CHAT_HANDLERS.socketEmitTyping();
        }, false);
        // Listen on typing
        CHAT_HANDLERS.socket.on(CHAT_CONSTANTS.SOCKET_TYPING, (data) => {
            CHAT_HANDLERS.addUserToCurrentlyTypingList(data.username);
        });
        // Listen on done typing
        CHAT_HANDLERS.socket.on(CHAT_CONSTANTS.SOCKET_DONE_TYPING, (data) => {
            CHAT_HANDLERS.removeUserFromCurrentlyTypingList(data.username);
        });


        // Emit a username change on click
        CHAT_CONSTANTS.USERNAME_SEND_BUTTON_EL.addEventListener(
            "click", function() {
                CHAT_HANDLERS.socketEmitUsernameChange(
                    CHAT_HANDLERS.formatString(
                        CHAT_CONSTANTS.USERNAME_TEXT_EL.value));
                CHAT_CONSTANTS.USERNAME_TEXT_EL.value = "";
            }, false);
        // Emit a username change on enter on text field
        CHAT_CONSTANTS.USERNAME_TEXT_EL.addEventListener(
            "keydown", function(e) {
                if (e.keyCode == 13 && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    CHAT_HANDLERS.socketEmitUsernameChange(
                        CHAT_HANDLERS.formatString(
                            CHAT_CONSTANTS.USERNAME_TEXT_EL.value));
                    CHAT_CONSTANTS.USERNAME_TEXT_EL.value = "";
                }
            }, false);
    };


    // emit a connection to a new room
    this.socketEmitConnectToRoom = function() {
        CHAT_HANDLERS.socket.emit(CHAT_CONSTANTS.SOCKET_CHAT_ROOM_NAME, chatRoom);
    };


    // emit a new message to all other users in chat room
    this.socketEmitMessage = function() {
        if (CHAT_CONSTANTS.MESSAGE_TEXT_EL.value.trim().length > 0) {
            CHAT_HANDLERS.socket.emit(CHAT_CONSTANTS.SOCKET_NEW_MESSAGE, 
                {message : CHAT_CONSTANTS.MESSAGE_TEXT_EL.value});

            clearTimeout(CHAT_HANDLERS.typingTimer);  // clear previous timer
            CHAT_HANDLERS.socketEmitDoneTyping();

            CHAT_CONSTANTS.MESSAGE_TEXT_EL.value = "";
            CHAT_CONSTANTS.MESSAGE_TEXT_EL.focus();
        }
    };


    // change current username
    this.socketEmitUsernameChange = function(newUsername) {
        if (newUsername.length > 0) {
            CHAT_HANDLERS.currentUsername = newUsername;
            CHAT_HANDLERS.socket.emit(CHAT_CONSTANTS.SOCKET_NEW_USERNAME, 
                {username : newUsername});

            CHAT_HANDLERS.setCookie(CHAT_CONSTANTS.COOKIE_USERNAME, newUsername);
        }
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
    };


    // add an incoming new message to the chatroom
    this.addMessageToChatroom = function(data) {
        CHAT_HANDLERS.removeUserFromCurrentlyTypingList(data.username);
        CHAT_CONSTANTS.CHATROOM_EL.innerHTML += "<p class='message'>" + 
            data.username + ": " + data.message + "</p>";
    };


    // add a user to the currently typing list
    this.addUserToCurrentlyTypingList = function(username) {
        CHAT_HANDLERS.currentlyTypingUsers.push(username);

        CHAT_CONSTANTS.FEEDBACK_TEXT_EL.innerHTML = 
            CHAT_HANDLERS.getUsersCurrentlyTypingText();
        CHAT_CONSTANTS.FEEDBACK_TEXT_EL.style.visibility = "visible";
    };


    // removes a user to the currently typing list
    this.removeUserFromCurrentlyTypingList = function(username) {
        CHAT_HANDLERS.removeUserFromCurrentlyTypingArray(username, true);

        CHAT_CONSTANTS.FEEDBACK_TEXT_EL.innerHTML = 
            CHAT_HANDLERS.getUsersCurrentlyTypingText();
        if (CHAT_HANDLERS.currentlyTypingUsers.length == 0)
            CHAT_CONSTANTS.FEEDBACK_TEXT_EL.style.visibility = "hidden";
    };


    // gets text representing the users currently typing
    this.getUsersCurrentlyTypingText = function() {
        var numTyping = CHAT_HANDLERS.currentlyTypingUsers.length;
        var usersTyping = "";

        if (numTyping == 1) {
            usersTyping = CHAT_HANDLERS.currentlyTypingUsers[0] + 
                " is typing...";
        }
        else if (numTyping == 2) {
            usersTyping = CHAT_HANDLERS.currentlyTypingUsers[0] + " and " + 
                CHAT_HANDLERS.currentlyTypingUsers[1] +
                " are currently typing...";
        }
        else if (numTyping > 2 && numTyping < 
            CHAT_CONSTANTS.MAX_INDIVIDUAL_USERS) {
            
            var temp = "";
            for (var i = 0; i < numTyping - 1; i ++) {
                temp += CHAT_HANDLERS.currentlyTypingUsers[i] + ", ";
            }
            temp += "and " + CHAT_HANDLERS.currentlyTypingUsers[numTyping - 1];

            usersTyping = temp + " are currently typing...";
        }
        else {
            usersTyping = numTyping + " users are currently typing...";
        }

        return "<i>" + usersTyping + "</i>";
    }


    this.setCookie = function(cname, cvalue) {  // exdays) {
        // var d = new Date();
        // d.setTime(d.getTime() + (exdays*24*60*60*1000));
        // var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";"; // + expires + ";path=/";
    };

    this.getCookie = function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i ++) {
            var c = ca[i];

            while (c.charAt(0) == ' ')
                c = c.substring(1);

        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
        }
        return "";
    };


    // removes occurrences from an array. if firstOnly is true, 
    // then only remove first occurrence, otherwise remove all
    this.removeUserFromCurrentlyTypingArray = function(username, firstOnly) {
        for (var i = CHAT_HANDLERS.currentlyTypingUsers.length - 1; i >= 0; i --) {
            if (CHAT_HANDLERS.currentlyTypingUsers[i] === username) {
                CHAT_HANDLERS.currentlyTypingUsers.splice(i, 1);
                if (firstOnly) break;
            }
        }
    }


    // formats a string to remove all single and double quotes ['"] and slashes
    this.formatString = function(text) {
        return text.trim().replace(/['"\\\/]+/g, '');
    };
}