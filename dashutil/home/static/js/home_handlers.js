// home_handlers.js
'use strict';


// keyboard, click, hover, focus, etc event handlers
var HOME_EVENT_HANDLERS = new function() {
	
	// Handler to set up event listeners
	this.addAllEventListeners = function() {

	    // general keyboard event handlers
	    document.addEventListener("keydown", 
	    	function(e) { HOME_EVENT_HANDLERS.handleKeyboardEvents(e); 
	    }); 
	    
	    // navbar logo image and text (dashutil) 
	    GENERAL_CONSTANTS.navbarLogoEl.addEventListener(
	    	"mouseover", this.hoverLogo, false);
	    GENERAL_CONSTANTS.navbarLogoEl.addEventListener(
	    	"mouseout", this.unhoverLogo, false);
	    GENERAL_CONSTANTS.navbarLogoEl.addEventListener(
	    	"focus", this.hoverLogo, false);
	    GENERAL_CONSTANTS.navbarLogoEl.addEventListener(
	    	"blur", this.unhoverLogo, false);

	    // theme toggler image
	    GENERAL_CONSTANTS.themeTogglerEl.addEventListener(
	    	"click", 
	    	function(e) { HOME_EVENT_HANDLERS.themeSwitchOnClick(e); }, 
	    	false);
	    GENERAL_CONSTANTS.themeTogglerEl.addEventListener("keydown", 
	    	function(e) { HOME_EVENT_HANDLERS.themeKeydownEnter(e); }, 
	    	false);
	    GENERAL_CONSTANTS.themeTogglerEl.addEventListener(
	    	"focus", this.hoverTheme, false);
	    GENERAL_CONSTANTS.themeTogglerEl.addEventListener(
	    	"blur", this.unhoverTheme, false);
	    GENERAL_CONSTANTS.themeTogglerEl.addEventListener(
	    	"mouseover", this.hoverTheme, false);
	    GENERAL_CONSTANTS.themeTogglerEl.addEventListener(
	    	"mouseout", this.unhoverTheme, false);
	    
	    // search box magnifying glass expand
	    GENERAL_CONSTANTS.searchBoxEl.addEventListener(
	    	"click", this.expandSearchBox, false);

	    // search box close contract
	    GENERAL_CONSTANTS.searchIconEl.addEventListener(
	    	"click", this.contractSearchBox, false);

	    // input text search on enter
	    GENERAL_CONSTANTS.inputTextEl.addEventListener(
	    	"keydown", 
	    	function(e) { HOME_EVENT_HANDLERS.inputTextKeydownEnter(e); }, 
	    	false);

	    // search button click
	    GENERAL_CONSTANTS.searchButtonEl.addEventListener(
	    	"click", this.findOrCreateRoomHandler, false);
	    GENERAL_CONSTANTS.searchButtonEl.addEventListener(
	    	"keydown", 
	    	function(e) { HOME_EVENT_HANDLERS.searchKeydownEnter(e); }, 
	    	false);
	};


	// Handler for keyboard events
	this.handleKeyboardEvents = function(e) {
	    var keycode = e.key.toLowerCase();

	    switch (keycode) {
	        case "escape": 
	        case "esc": 
	            if (GENERAL_CONSTANTS.searchBoxEl.classList.contains(
	            	GENERAL_CONSTANTS.expandedClass)) { 
	                this.contractSearchBox(); 

	                // no this isnt a mistake
	                this.expandSearchBox(); 
	            } 
	            break; 

	        case "tab":
	          	if (!GENERAL_CONSTANTS.searchBoxEl.classList.contains(
	          		GENERAL_CONSTANTS.expandedClass)) {
	                e.preventDefault();
	                this.expandSearchBox(); 
	            }
	            break;
	    }
	};


	// Handler for expanding the search box
	this.expandSearchBox = function() { 
	    if (GENERAL_CONSTANTS.searchBoxEl.classList.contains(
	    	GENERAL_CONSTANTS.prevClass)) {

	        GENERAL_CONSTANTS.searchBoxEl.classList.remove(GENERAL_CONSTANTS.prevClass);
	        GENERAL_CONSTANTS.searchIconEl.classList.remove(GENERAL_CONSTANTS.prevClass);
	        GENERAL_CONSTANTS.inputTextEl.classList.remove(GENERAL_CONSTANTS.prevClass);
	        GENERAL_CONSTANTS.searchButtonEl.classList.remove(GENERAL_CONSTANTS.prevClass);
	    }
	    else if (!GENERAL_CONSTANTS.searchBoxEl.classList.contains(
	    	GENERAL_CONSTANTS.expandedClass)) {

	        GENERAL_CONSTANTS.searchBoxEl.classList.add(GENERAL_CONSTANTS.expandedClass);
	        GENERAL_CONSTANTS.searchIconEl.classList.add(GENERAL_CONSTANTS.expandedClass);
	        GENERAL_CONSTANTS.inputTextEl.classList.add(GENERAL_CONSTANTS.expandedClass);
	        GENERAL_CONSTANTS.searchButtonEl.classList.add(GENERAL_CONSTANTS.expandedClass); 
	        GENERAL_CONSTANTS.oldSearchEl.id = GENERAL_CONSTANTS.newSearchId; 

	        HOME_EVENT_HANDLERS.moveCaretToEnd(GENERAL_CONSTANTS.inputTextEl);
	    }
	};


	// Handler for contracting the search box
	this.contractSearchBox = function() {
	    if (GENERAL_CONSTANTS.searchBoxEl.classList.contains(
	    	GENERAL_CONSTANTS.expandedClass)) {

	        GENERAL_CONSTANTS.searchBoxEl.classList.remove(GENERAL_CONSTANTS.expandedClass);
	        GENERAL_CONSTANTS.searchIconEl.classList.remove(GENERAL_CONSTANTS.expandedClass);
	        GENERAL_CONSTANTS.inputTextEl.classList.remove(GENERAL_CONSTANTS.expandedClass);
	        GENERAL_CONSTANTS.searchButtonEl.classList.remove(GENERAL_CONSTANTS.expandedClass); 

	        GENERAL_CONSTANTS.searchBoxEl.classList.add(GENERAL_CONSTANTS.prevClass);
	        GENERAL_CONSTANTS.searchIconEl.classList.add(GENERAL_CONSTANTS.prevClass);
	        GENERAL_CONSTANTS.inputTextEl.classList.add(GENERAL_CONSTANTS.prevClass);
	        GENERAL_CONSTANTS.searchButtonEl.classList.add(GENERAL_CONSTANTS.prevClass); 
	        document.getElementById(GENERAL_CONSTANTS.newSearchId).id = GENERAL_CONSTANTS.oldSearchId; 
	    }      
	};


	// hover function for logo
	this.hoverLogo = function() {
	    GENERAL_CONSTANTS.logoImgEl.setAttribute("src", 
	    	THEME_CONTROLLER.currentTheme.logoHover);
	    GENERAL_CONSTANTS.logoTextEl.style.color = 
	    	THEME_CONTROLLER.currentTheme.textColorHover;
	};


	// unhover function for logo
	this.unhoverLogo = function() {
	    GENERAL_CONSTANTS.logoImgEl.setAttribute("src", 
	    	THEME_CONTROLLER.currentTheme.logo);
	    GENERAL_CONSTANTS.logoTextEl.style.color = 
	    	THEME_CONTROLLER.currentTheme.textColor;
	};


	// hover function for theme
	this.hoverTheme = function() {
	    GENERAL_CONSTANTS.themeImgEl.setAttribute("src", 
	    	THEME_CONTROLLER.currentTheme.themeHover);
	};


	// unhover function for theme
	this.unhoverTheme = function() {
	    GENERAL_CONSTANTS.themeImgEl.setAttribute("src", 
	    	THEME_CONTROLLER.currentTheme.theme);
	};


	// switch themes
	this.switchThemes = function() {
	    THEME_CONTROLLER.switchThemes();
	};


	// handles keydown for theme switching on click
	this.themeSwitchOnClick = function(e) {
	    e.stopPropagation();
	    this.switchThemes();
	};


	// handles keydown for theme switching on enter
	this.themeKeydownEnter = function(e) {
	    var keycode = e.key.toLowerCase();

	    if (keycode == "enter") {
	        e.preventDefault();
	        this.switchThemes();
	    }
	};


	// handles keydown for searching from search button
	this.searchKeydownEnter = function(e) {
	    var keycode = e.key.toLowerCase();

	    if (keycode == "enter") 
	        this.findOrCreateRoomHandler();
	};


	// handles keydown for searching from input text
	this.inputTextKeydownEnter = function(e) {
	    var keycode = e.key.toLowerCase();

	    if (keycode == "enter") 
	        this.findOrCreateRoomHandler();
	};


	// handles finding or creation of new room
	this.findOrCreateRoomHandler = function() {
		if (GENERAL_CONSTANTS.searchBoxEl.classList.contains(
	    	GENERAL_CONSTANTS.expandedClass)) {
			findOrCreateRoom(
				GENERAL_CONSTANTS.inputTextEl.value.toString().trim());
		}
	};

	// moves the caret to the end of the input line
	this.moveCaretToEnd = function(el) { 
	    var temp = el.value;
	    el.value = '';
	    el.value = temp;
	    el.focus();
	};
};


// theme controller for switching themes
var THEME_CONTROLLER = new function() {
    this.darkTheme = 		true;
    this.lightTheme = 		false;
    this.currentTheme = 	THEME_CONSTANTS.THEME_CONSTANTS_DARK;

    this.switchThemes = function() {
	    if (this.darkTheme) {
	        this.currentTheme = THEME_CONSTANTS.THEME_CONSTANTS_LIGHT;
	        document.body.className = document.body.className.replace(
	        	GENERAL_CONSTANTS.darkThemeClass, 
	        	GENERAL_CONSTANTS.lightThemeClass);
	    }
	    else {
	        this.currentTheme = THEME_CONSTANTS.THEME_CONSTANTS_DARK;
	        document.body.className = document.body.className.replace(
	        	GENERAL_CONSTANTS.lightThemeClass, 
	        	GENERAL_CONSTANTS.darkThemeClass);
	    }

	    this.darkTheme = !this.darkTheme;
	    this.lightTheme = !this.lightTheme;
	    GENERAL_CONSTANTS.themeImgEl.title = 
	    	this.currentTheme.themeSwitchText;

	    HOME_EVENT_HANDLERS.unhoverLogo();
	    HOME_EVENT_HANDLERS.unhoverTheme();
    };
};