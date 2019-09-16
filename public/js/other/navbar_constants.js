// navbar_constants.js - holds navbar constants
'use strict';


// navbar variables for hover and theme switch
const NAVBAR_CONSTANTS = new function() {

    this.themeTogglerEl =       document.getElementById("theme_toggler_id");
    this.themeImgEl =         	document.getElementById("theme_img_id");
    this.darkThemeClass =      	"dark_theme";
    this.lightThemeClass =     	"light_theme";  
    this.imgPath =             	"/img/"; 

	this.NAVBAR_CONSTANTS_DARK = {
	    theme:              this.imgPath + "theme-dark.png",
	    themeSwitchText:    "Go light!",
	    textColor:          "white",
	    textColorHover:     "#d6d6d6"
	};
	this.NAVBAR_CONSTANTS_LIGHT = {
	    theme:              this.imgPath + "theme-light.png",
	    themeSwitchText:    "Go dark!",
	    textColor:          "#252525",
	    textColorHover:     "#a0a0a0"
	};
};
