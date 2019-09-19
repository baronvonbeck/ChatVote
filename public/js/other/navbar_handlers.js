// navbar_handlers.js - handles navbar input events and theme switching

var NAVBAR_HANDLERS = new function() {

    this.initializeTheme = function() {
        NAVBAR_CONTROLLER.readThemeFromCookieIfApplicable();
    };

    this.addNavbarEventListeners = function() {

        // theme toggler image
	    NAVBAR_CONSTANTS.THEME_TOGGLER_EL.addEventListener(
	    	"click", function(e) { 
                NAVBAR_HANDLERS.switchThemes(); 
            }, false);
	    NAVBAR_CONSTANTS.THEME_TOGGLER_EL.addEventListener(
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
	        	NAVBAR_CONSTANTS.DARK_THEME_CLASS, 
                NAVBAR_CONSTANTS.LIGHT_THEME_CLASS);
            
            NAVBAR_CONTROLLER.setCookie(NAVBAR_CONSTANTS.THEME_COOKIE,
                NAVBAR_CONSTANTS.LIGHT_THEME_CLASS);
	    }
	    else {
	        this.currentTheme = NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_DARK;
	        document.body.className = document.body.className.replace(
	        	NAVBAR_CONSTANTS.LIGHT_THEME_CLASS, 
                NAVBAR_CONSTANTS.DARK_THEME_CLASS);
            
            NAVBAR_CONTROLLER.setCookie(NAVBAR_CONSTANTS.THEME_COOKIE,
                NAVBAR_CONSTANTS.DARK_THEME_CLASS);
	    }

	    this.darkTheme = !this.darkTheme;
	    this.lightTheme = !this.lightTheme;
	    NAVBAR_CONSTANTS.THEME_IMG_EL.title = 
	    	this.currentTheme.themeSwitchText;
        NAVBAR_CONSTANTS.THEME_IMG_EL.setAttribute("src", 
            NAVBAR_CONTROLLER.currentTheme.theme);
    };


    this.readThemeFromCookieIfApplicable = function() {
        var cookieTheme = NAVBAR_CONTROLLER.getCookie(
            NAVBAR_CONSTANTS.THEME_COOKIE);

        console.log(String(cookieTheme));
            
        if (cookieTheme == undefined || cookieTheme == null) {
            NAVBAR_CONTROLLER.setCookie(NAVBAR_CONSTANTS.THEME_COOKIE,
                NAVBAR_CONSTANTS.DARK_THEME_CLASS);
        }
        else if (cookieTheme != NAVBAR_CONSTANTS.DARK_THEME_CLASS) {
            this.switchThemes();
        }
    }

    // sets a cookie. Taken from w3schools. Application uses cookies for:
        // 1. username
    this.setCookie = function(cname, cvalue) {  // exdays) {
        // var d = new Date();
        // d.setTime(d.getTime() + (exdays*24*60*60*1000));
        // var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";"; // + expires + ";path=/";
    };


    // gets a cookie by cookie name. Taken from w3schools
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
};