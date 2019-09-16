// navbar_handlers.js - handles navbar input events and theme switching

var NAVBAR_HANDLERS = new function() {

    this.addNavbarEventListeners = function() {

        // theme toggler image
	    NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
	    	"click", function(e) { 
                NAVBAR_HANDLERS.switchThemes(); 
            }, false);
	    NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
            "keydown", function(e) { 
                if (e.which == 13 || e.keyCode == 13) {
                    e.preventDefault();
                    NAVBAR_HANDLERS.switchThemes();
                }
            }, false);
    }

	// switch themes
	this.switchThemes = function() {
	    NAVBAR_CONTROLLER.switchThemes();
	};
};



// theme controller for switching themes
var NAVBAR_CONTROLLER = new function() {
    this.darkTheme = 		true;
    this.lightTheme = 		false;
    this.currentTheme = 	NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_DARK;

    this.switchThemes = function() {
	    if (this.darkTheme) {
	        this.currentTheme = NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_LIGHT;
	        document.body.className = document.body.className.replace(
	        	NAVBAR_CONSTANTS.darkThemeClass, 
	        	NAVBAR_CONSTANTS.lightThemeClass);
	    }
	    else {
	        this.currentTheme = NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_DARK;
	        document.body.className = document.body.className.replace(
	        	NAVBAR_CONSTANTS.lightThemeClass, 
	        	NAVBAR_CONSTANTS.darkThemeClass);
	    }

	    this.darkTheme = !this.darkTheme;
	    this.lightTheme = !this.lightTheme;
	    NAVBAR_CONSTANTS.themeImgEl.title = 
	    	this.currentTheme.themeSwitchText;
        NAVBAR_CONSTANTS.themeImgEl.setAttribute("src", 
	    	NAVBAR_CONTROLLER.currentTheme.theme);
    };
};