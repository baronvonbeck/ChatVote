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
        CHAT_CONSTANTS.CHATROOM_EL.innerHTML += "<p class='message_info'>" + 
            data.username + "&nbsp;&nbsp;&nbsp;&nbsp;" + 
            CHAT_HANDLERS.formatDateToString(new Date()) + "</p>"  + 
            "<p class='message'>" + data.message + "</p>";
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


    // formats a date object to a string
    // courtesy of https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site/23259289#23259289
    this.formatDateToString = function(date) {        
        var seconds = Math.floor((new Date() - date) / 1000);
        var temp;
        var intervalString = "";

        // return this.formatFullDate(date);

        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return this.formatFullDate(date);
        } 
        else {
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                intervalString += interval + " month";
                if (interval > 1) intervalString += "s";
                
                temp = Math.floor((seconds - (interval * 2592000)) / 86400);

                intervalString += ", " + temp + " day";
                if (temp != 1) intervalString += "s";
            } 
            else {
                interval = Math.floor(seconds / 86400);
                if (interval >= 1) {
                    intervalString += interval + " day";
                    if (interval > 1) intervalString += "s";

                    temp = Math.floor((seconds - (interval * 86400)) / 3600);
                    
                    intervalString += ", " + temp + " hour";
                    if (temp != 1) intervalString += "s";
                } 
                else {
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1) {
                        intervalString += interval + " hour";
                        if (interval > 1) intervalString += "s";

                        temp = Math.floor((seconds - (interval * 3600)) / 60);
                        
                        intervalString += ", " + temp + " minute";
                        if (temp != 1) intervalString += "s";
                    } 
                    else {
                        interval = Math.floor(seconds / 60);
                        if (interval >= 1) {
                            intervalString += interval + " minute";
                            if (interval > 1) intervalString += "s";

                            temp = (seconds - (interval * 60));
                            
                            intervalString += ", " + (seconds % 60) + " second";
                            if (temp != 1) intervalString += "s";
                        } 
                        else {
                            intervalString += seconds + " second";
                            if (seconds != 1) intervalString += "s";
                        }
                    }
                }
            }
        }

        return intervalString + " ago";
    }

    this.formatFullDate = function(date) {
        // var time = "";
        // var mins = String(date.getMinutes());
        // var hours = "";
        // if (date.getMinutes() < 10)
        //     mins = "0" + mins;

        // if (date.getHours() - 12 > 0)
        //     hours = String(date.getHours() - 12);
        // else 
        //     hours = String((date.getHours() == 0 ? "12" : date.getHours()));

        // if (date.getHours() < 12) time = " AM";
        // else time = " PM";

        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + 
            date.getFullYear();
            
            // + " " + hours + ":" + mins + 
            // "." + date.getMilliseconds() + time;
    }


    // formats a string to remove all single and double quotes ['"] and slashes
    this.formatString = function(text) {
        return text.trim().replace(/['"\\\/]+/g, '');
    };
}

/*
1. Format message so that it appears like in discord or steam
         (username, date, different colors, different lines, etc)

2. Change username always displays current username if user does not hit enter

    done            3. User is Typing to display up to 3 or 4 separate users 
                        If more then (5/6/x users are typing...)

4. Autoscroll users to bottom message if they are already at the bottom, otherwise stay

5. Make scrollbar look cooler

6. No
*/