// home_handlers.js - handles input events and calls home.js methods 
// to deal with page direction and displaying messages to users
'use strict';


// keyboard, click, hover, focus, etc event handlers for the home page
var HOME_EVENT_HANDLERS = new function() {

	// Method to call back to find or create a room, from home.js
	// Takes one String as parameter (the room name to find/create)
	this.findOrCreateRoomCallback = null;

	// Method to display an error message, from home.js
	// Takes one String as parameter (the error message to display)
	this.createErrorMessageCallback = null;
	
	// Handler to set up event listeners. 2 callbacks passed in from home.js
	this.addAllEventListeners = function(
		newFindOrCreateRoomCallback, newCreateErrorMessageCallback) {

		this.findOrCreateRoomCallback = newFindOrCreateRoomCallback;
		this.createErrorMessageCallback = newCreateErrorMessageCallback;

	    // general keyboard event handlers
	    document.addEventListener("keydown", 
	    	function(e) { HOME_EVENT_HANDLERS.handleKeyboardEvents(e); 
	    }); 
	    
	    // navbar logo image and text (dashutil) 
	    HOME_CONSTANTS.navbarLogoEl.addEventListener(
	    	"mouseover", this.hoverLogo, false);
	    HOME_CONSTANTS.navbarLogoEl.addEventListener(
	    	"mouseout", this.unhoverLogo, false);
	    HOME_CONSTANTS.navbarLogoEl.addEventListener(
	    	"focus", this.hoverLogo, false);
	    HOME_CONSTANTS.navbarLogoEl.addEventListener(
	    	"blur", this.unhoverLogo, false);

	    // theme toggler image
	    HOME_CONSTANTS.themeTogglerEl.addEventListener(
	    	"click", 
	    	function(e) { HOME_EVENT_HANDLERS.themeSwitchOnClick(e); }, 
	    	false);
	    HOME_CONSTANTS.themeTogglerEl.addEventListener("keydown", 
	    	function(e) { HOME_EVENT_HANDLERS.themeSwitchKeydownEnter(e); }, 
	    	false);
	    HOME_CONSTANTS.themeTogglerEl.addEventListener(
	    	"focus", this.hoverTheme, false);
	    HOME_CONSTANTS.themeTogglerEl.addEventListener(
	    	"blur", this.unhoverTheme, false);
	    HOME_CONSTANTS.themeTogglerEl.addEventListener(
	    	"mouseover", this.hoverTheme, false);
	    HOME_CONSTANTS.themeTogglerEl.addEventListener(
	    	"mouseout", this.unhoverTheme, false);
	    
	    // search box magnifying glass expand
	    HOME_CONSTANTS.searchBoxEl.addEventListener(
	    	"click", this.expandSearchBox, false);

	    // search box close contract
	    HOME_CONSTANTS.searchIconEl.addEventListener(
	    	"click", this.contractSearchBox, false);

	    // input text search on enter
	    HOME_CONSTANTS.inputTextEl.addEventListener(
	    	"keydown", 
	    	function(e) { HOME_EVENT_HANDLERS.inputTextKeydownEnter(e); }, 
	    	false);

	    // search button click
	    HOME_CONSTANTS.searchButtonEl.addEventListener(
	    	"click", this.findOrCreateRoomHandler, false);
	    HOME_CONSTANTS.searchButtonEl.addEventListener(
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
	            if (HOME_CONSTANTS.searchBoxEl.classList.contains(
	            	HOME_CONSTANTS.expandedClass)) { 
                    HOME_EVENT_HANDLERS.contractSearchBox(); 

	                // no this isnt a mistake
	                HOME_EVENT_HANDLERS.expandSearchBox(); 
	            } 
	            break; 

	        case "tab":
	          	if (!HOME_CONSTANTS.searchBoxEl.classList.contains(
	          		HOME_CONSTANTS.expandedClass)) {
	                e.preventDefault();
	                HOME_EVENT_HANDLERS.expandSearchBox(); 
	            }
	            break;
	    }
	};


	// Handler for expanding the search box
	this.expandSearchBox = function() { 
	    if (HOME_CONSTANTS.searchBoxEl.classList.contains(
	    	HOME_CONSTANTS.prevClass)) {

	        HOME_CONSTANTS.searchBoxEl.classList.remove(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.searchIconEl.classList.remove(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.inputTextEl.classList.remove(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.searchButtonEl.classList.remove(
	        	HOME_CONSTANTS.prevClass);
	    }
	    else if (!HOME_CONSTANTS.searchBoxEl.classList.contains(
	    	HOME_CONSTANTS.expandedClass)) {

	        HOME_CONSTANTS.searchBoxEl.classList.add(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.searchIconEl.classList.add(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.inputTextEl.classList.add(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.searchButtonEl.classList.add(
	        	HOME_CONSTANTS.expandedClass); 
	        HOME_CONSTANTS.oldSearchEl.id = HOME_CONSTANTS.newSearchId;

	        HOME_EVENT_HANDLERS.moveCaretToEnd(HOME_CONSTANTS.inputTextEl);
	    }
	};


	// Handler for contracting the search box
	this.contractSearchBox = function() {
	    if (HOME_CONSTANTS.searchBoxEl.classList.contains(
	    	HOME_CONSTANTS.expandedClass)) {

	        HOME_CONSTANTS.searchBoxEl.classList.remove(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.searchIconEl.classList.remove(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.inputTextEl.classList.remove(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.searchButtonEl.classList.remove(
	        	HOME_CONSTANTS.expandedClass); 

	        HOME_CONSTANTS.searchBoxEl.classList.add(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.searchIconEl.classList.add(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.inputTextEl.classList.add(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.searchButtonEl.classList.add(
	        	HOME_CONSTANTS.prevClass); 
	        document.getElementById(HOME_CONSTANTS.newSearchId).id = 
	        	HOME_CONSTANTS.oldSearchId; 
	    }      
	};


	// hover function for logo
	this.hoverLogo = function() {
	    HOME_CONSTANTS.logoImgEl.setAttribute("src", 
	    	THEME_CONTROLLER.currentTheme.logoHover);
	    HOME_CONSTANTS.logoTextEl.style.color = 
	    	THEME_CONTROLLER.currentTheme.textColorHover;
	};


	// unhover function for logo
	this.unhoverLogo = function() {
	    HOME_CONSTANTS.logoImgEl.setAttribute("src", 
	    	THEME_CONTROLLER.currentTheme.logo);
	    HOME_CONSTANTS.logoTextEl.style.color = 
	    	THEME_CONTROLLER.currentTheme.textColor;
	};


	// hover function for theme
	this.hoverTheme = function() {
	    HOME_CONSTANTS.themeImgEl.setAttribute("src", 
	    	THEME_CONTROLLER.currentTheme.themeHover);
	};


	// unhover function for theme
	this.unhoverTheme = function() {
	    HOME_CONSTANTS.themeImgEl.setAttribute("src", 
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
	this.themeSwitchKeydownEnter = function(e) {
	    var keycode = e.key.toLowerCase();

	    if (keycode == "enter") {
	        e.preventDefault();
	        HOME_EVENT_HANDLERS.switchThemes();
	    }
	};


	// handles keydown for searching from search button
	this.searchKeydownEnter = function(e) {
	    var keycode = e.key.toLowerCase();

	    if (keycode == "enter") 
        HOME_EVENT_HANDLERS.findOrCreateRoomHandler();
	};


	// handles keydown for searching from input text
	this.inputTextKeydownEnter = function(e) {
	    var keycode = e.key.toLowerCase();

	    if (keycode == "enter") 
        HOME_EVENT_HANDLERS.findOrCreateRoomHandler();
	};


	// handles finding or creation of new room using callback provided,
	// including checking if string is valid or not
	this.findOrCreateRoomHandler = function() {
		if (HOME_CONSTANTS.searchBoxEl.classList.contains(
	    	HOME_CONSTANTS.expandedClass)) {
			var roomToSearchFor = HOME_EVENT_HANDLERS.getStorageToSearchFor();

			if (roomToSearchFor.length > 0) {
				HOME_EVENT_HANDLERS.findOrCreateRoomCallback(roomToSearchFor);
		    }
		    else 
		        HOME_EVENT_HANDLERS.createErrorMessageCallback(
		        	MESSAGE_CONSTANTS.errorRoomLength0);
		}
    };
    
    
    // trims spaces, removes single and double quotes, and returns storage name
    this.getStorageToSearchFor = function() {
        return HOME_CONSTANTS.inputTextEl.value.toString().trim()
            .replace(/['"]+/g, '');
    }


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
	        	HOME_CONSTANTS.darkThemeClass, 
	        	HOME_CONSTANTS.lightThemeClass);
	    }
	    else {
	        this.currentTheme = THEME_CONSTANTS.THEME_CONSTANTS_DARK;
	        document.body.className = document.body.className.replace(
	        	HOME_CONSTANTS.lightThemeClass, 
	        	HOME_CONSTANTS.darkThemeClass);
	    }

	    this.darkTheme = !this.darkTheme;
	    this.lightTheme = !this.lightTheme;
	    HOME_CONSTANTS.themeImgEl.title = 
	    	this.currentTheme.themeSwitchText;

	    HOME_EVENT_HANDLERS.unhoverLogo();
	    HOME_EVENT_HANDLERS.unhoverTheme();
    };
};