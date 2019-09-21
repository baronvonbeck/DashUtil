// navbar_handlers.js - handles navbar input events and theme switching

var NAVBAR_EVENT_HANDLERS = new function() {

    this.initializeTheme = function() {
        NAVBAR_THEME_CONTROLLER.readThemeFromCookieIfApplicable();
    };

    this.addNavbarEventListeners = function() {
        NAVBAR_EVENT_HANDLERS.initializeTheme();

        // navbar logo image and text (dashutil) 
	    NAVBAR_CONSTANTS.navbarLogoEl.addEventListener(
	    	"mouseover", this.hoverLogo, false);
        NAVBAR_CONSTANTS.navbarLogoEl.addEventListener(
	    	"mouseout", this.unhoverLogo, false);
        NAVBAR_CONSTANTS.navbarLogoEl.addEventListener(
	    	"focus", this.hoverLogo, false);
        NAVBAR_CONSTANTS.navbarLogoEl.addEventListener(
	    	"blur", this.unhoverLogo, false);

	    // theme toggler image
	    NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
	    	"click", function(e) { 
                NAVBAR_EVENT_HANDLERS.switchThemes(); 
            }, false);

	    NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
            "keydown", function(e) { 
                var keycode = e.key.toLowerCase();

                if (keycode == "enter") {
                    e.preventDefault();
                    NAVBAR_EVENT_HANDLERS.switchThemes();
                }
            }, false);

        NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
	    	"focus", this.hoverNavbarElement, false);
        NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
	    	"blur", this.unhoverNavbarElement, false);
        NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
	    	"mouseover", this.hoverNavbarElement, false);
        NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
	    	"mouseout", this.unhoverNavbarElement, false);
    }

    // hover function for logo
	this.hoverLogo = function() {
	    NAVBAR_CONSTANTS.logoImgEl.setAttribute("src", 
	    	NAVBAR_THEME_CONTROLLER.currentTheme.logoHover);
        NAVBAR_CONSTANTS.logoTextEl.style.color = 
	    	NAVBAR_THEME_CONTROLLER.currentTheme.textColorHover;
	};


	// unhover function for logo
	this.unhoverLogo = function() {
	    NAVBAR_CONSTANTS.logoImgEl.setAttribute("src", 
	    	NAVBAR_THEME_CONTROLLER.currentTheme.logo);
        NAVBAR_CONSTANTS.logoTextEl.style.color = 
	    	NAVBAR_THEME_CONTROLLER.currentTheme.textColor;
	};


	// hover function for theme
	this.hoverNavbarElement = function() {
	    NAVBAR_CONSTANTS.themeImgEl.setAttribute("src", 
	    	NAVBAR_THEME_CONTROLLER.currentTheme.themeHover);
	};


	// unhover function for theme
	this.unhoverNavbarElement = function() {
	    NAVBAR_CONSTANTS.themeImgEl.setAttribute("src", 
	    	NAVBAR_THEME_CONTROLLER.currentTheme.theme);
	};


	// switch themes
	this.switchThemes = function() {
	    NAVBAR_THEME_CONTROLLER.switchThemes();
	};
};



// theme controller for switching themes
var NAVBAR_THEME_CONTROLLER = new function() {
    this.darkTheme = 		true;
    this.lightTheme = 		false;
    this.currentTheme = 	NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_DARK;

    this.switchThemes = function() {
	    if (this.darkTheme) {
	        this.currentTheme = NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_LIGHT;
	        document.body.className = document.body.className.replace(
	        	NAVBAR_CONSTANTS.darkThemeClass, 
                NAVBAR_CONSTANTS.lightThemeClass);
            
            NAVBAR_THEME_CONTROLLER.setCookie(NAVBAR_CONSTANTS.THEME_COOKIE,
                NAVBAR_CONSTANTS.lightThemeClass);
	    }
	    else {
	        this.currentTheme = NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_DARK;
	        document.body.className = document.body.className.replace(
	        	NAVBAR_CONSTANTS.lightThemeClass, 
                NAVBAR_CONSTANTS.darkThemeClass);
                
            NAVBAR_THEME_CONTROLLER.setCookie(NAVBAR_CONSTANTS.THEME_COOKIE,
                NAVBAR_CONSTANTS.darkThemeClass);
	    }

	    this.darkTheme = !this.darkTheme;
	    this.lightTheme = !this.lightTheme;
	    NAVBAR_CONSTANTS.themeImgEl.title = 
	    	this.currentTheme.themeSwitchText;

        NAVBAR_EVENT_HANDLERS.unhoverLogo();
	    NAVBAR_EVENT_HANDLERS.unhoverNavbarElement();
    };


    this.readThemeFromCookieIfApplicable = function() {
        var cookieTheme = NAVBAR_THEME_CONTROLLER.getCookie(
            NAVBAR_CONSTANTS.THEME_COOKIE);

        console.log(String(cookieTheme));
            
        if (cookieTheme == undefined || cookieTheme == null) {
            NAVBAR_THEME_CONTROLLER.setCookie(NAVBAR_CONSTANTS.THEME_COOKIE,
                NAVBAR_CONSTANTS.darkThemeClass);
        }
        else if (cookieTheme != NAVBAR_CONSTANTS.darkThemeClass) {
            this.switchThemes();
        }
    }


    // sets a cookie. Taken from w3schools. Application uses cookies for:
        // 1. current style
    this.setCookie = function(cname, cvalue) {  // exdays) {
        // var d = new Date();
        // d.setTime(d.getTime() + (exdays*24*60*60*1000));
        // var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";path=/"; // + expires + ";path=/";
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