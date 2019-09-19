// navbar_constants.js - holds navbar constants
'use strict';


// navbar variables for hover and theme switch
const NAVBAR_CONSTANTS = new function() {

    this.THEME_TOGGLER_EL       = document.getElementById("theme_toggler_id");
    this.THEME_IMG_EL           = document.getElementById("theme_img_id");
    this.DARK_THEME_CLASS       = "dark_theme";
    this.LIGHT_THEME_CLASS      = "light_theme";  
    this.IMG_PATH               = "/img/";
    this.THEME_COOKIE           = "chat_cookie_current_theme";

	this.NAVBAR_CONSTANTS_DARK = {
	    theme:              this.IMG_PATH + "theme-dark.png",
	    themeSwitchText:    "Go light!",
	    textColor:          "white",
	    textColorHover:     "#d6d6d6"
	};
	this.NAVBAR_CONSTANTS_LIGHT = {
	    theme:              this.IMG_PATH + "theme-light.png",
	    themeSwitchText:    "Go dark!",
	    textColor:          "#252525",
	    textColorHover:     "#a0a0a0"
	};
};
