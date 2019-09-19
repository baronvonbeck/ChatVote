// chat.js
'use strict';


window.onload = () => { 
    CHAT_CONSTANTS.TITLE_EL.innerHTML = chatRoom;
    NAVBAR_HANDLERS.initializeTheme();
    CHAT_HANDLERS.addAllEventListeners();
}

