// chat_search_handlers.js 
'use strict';


var CHAT_SEARCH_HANDLERS = new function() {

    this.addAllEventListeners = function() {

        NAVBAR_HANDLERS.addNavbarEventListeners();

        // Go to new chat room on click
        CHAT_SEARCH_CONSTANTS.CHAT_GOTO_BUTTON_EL.addEventListener(
            "click", function() {
                CHAT_SEARCH_HANDLERS.goToChatRoom();
            }, false);
        // Go to new chat room on enter
        CHAT_SEARCH_CONSTANTS.CHAT_SEARCH_TEXT_EL.addEventListener(
            "keydown", function(e) {
                if (e.keyCode == 13) {
                    CHAT_SEARCH_HANDLERS.goToChatRoom();
                }
            }, false);
    };


    this.goToChatRoom = function() {
        var newChatRoom = CHAT_SEARCH_HANDLERS.formatString(
            CHAT_SEARCH_CONSTANTS.CHAT_SEARCH_TEXT_EL.value);

        if (newChatRoom.length > 0) {
            window.location.href = CHAT_SEARCH_CONSTANTS.HREF_LOCATION + 
                newChatRoom;
        }
    };


    // formats a string to remove all slashes
    this.formatString = function(text) {
        return text.trim().replace(/[\\\/]+/g, '');
    };
}