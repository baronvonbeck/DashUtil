// navbar_handlers.js - handles navbar input events and theme switching

var NAVBAR_EVENT_HANDLERS = new function() {

    this.addNavbarEventListeners = function() {
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
                NAVBAR_EVENT_HANDLERS.themeSwitchOnClick(e); 
            }, false);

	    NAVBAR_CONSTANTS.themeTogglerEl.addEventListener("keyup", 
	    	function(e) { 
                if (NAVBAR_CONSTANTS.errorModalEl.style.display == "block") {
                    NAVBAR_CONSTANTS.errorModalEl.style.display = "none";
                    return;
                }
                NAVBAR_EVENT_HANDLERS.themeSwitchKeyupEnter(e); 
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


	// handles keyup for theme switching on click
	this.themeSwitchOnClick = function(e) {
	    e.stopPropagation();
	    this.switchThemes();
	};


	// handles keyup for theme switching on enter
	this.themeSwitchKeyupEnter = function(e) {
	    var keycode = e.key.toLowerCase();

	    if (keycode == "enter") {
            e.preventDefault();
            e.stopPropagation();
	        NAVBAR_EVENT_HANDLERS.switchThemes();
	    }
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

        NAVBAR_EVENT_HANDLERS.unhoverLogo();
	    NAVBAR_EVENT_HANDLERS.unhoverNavbarElement();
    };
};