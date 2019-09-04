// main.js
'use strict';


var addAllEventListeners = function() {
    
}


window.onload = () => { 
    //addAllEventListeners();

    CONSTANTS.SEARCH_ENTER_EL.addEventListener(
        "click", function() {
            var searchString = CONSTANTS.SEARCH_TEXT_EL.value;
            console.log(searchString);
        }, false);

    CONSTANTS.MAIN_FORM_WRAPPER_EL.addEventListener(
        "submit", function(e) {
            //e.preventDefault();
            console.log("here");
            //window.location.href = "/";
        }, false);
}

