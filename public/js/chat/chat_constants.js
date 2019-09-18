// chat_constants.js - holds constants that will not change
'use strict';


const CHAT_CONSTANTS = new function() {

    this.TITLE_EL                   = document.getElementById("title_id");
    this.ROOM_LINK_EL               = document.getElementById("room_link_id");
    this.TITLE_TOOLTIP_EL           = document.getElementById("title_tooltip_id");

    this.CHATROOM_CONTAINER_EL      = document.getElementById("chatroom_container_id");
    this.CHATROOM_EL                = document.getElementById("chatroom_id");
    
    this.FEEDBACK_TEXT_EL           = document.getElementById("feedback_text_id");

    this.MESSAGE_TEXT_EL            = document.getElementById("message_text_id");
    this.MESSAGE_SEND_BUTTON_EL     = document.getElementById("message_send_button_id");
    
    this.USERNAME_CONTAINER_EL      = document.getElementById("username_change_container_id");
    this.USERNAME_TEXT_EL           = document.getElementById("username_text_id");
    this.USERNAME_SEND_BUTTON_EL    = document.getElementById("username_send_button_id");


    this.SOCKET_CHAT_ROOM_NAME      = "change_room_name";
    this.SOCKET_USER_JOINED         = "user_joined";
    this.SOCKET_TYPING              = "typing";
    this.SOCKET_DONE_TYPING         = "done_typing";
    this.SOCKET_NEW_MESSAGE         = "new_message";
    this.SOCKET_NEW_USERNAME        = "new_username";

    
    this.COOKIE_USERNAME            = "chat_cookie_username_chatvote";


    this.DONE_TYPING_INTERVAL       = 1500; // time in ms, 1.5 seconds
    this.MAX_INDIVIDUAL_USERS       = 4;

    // regexes from https://stackoverflow.com/a/3890175
    this.URL_REGEX = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    this.WWW_URL_REGEX = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    this.MAILTO_REGEX = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
};