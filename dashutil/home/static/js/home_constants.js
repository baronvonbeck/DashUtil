// home_constants.js
'use strict';


// General constants
const GENERAL_CONSTANTS = new function() {
    this.inputTextEl =         	document.getElementById("input-text-id");
    this.searchBoxEl =         	document.getElementById("search-box-id"); 
    this.searchIconEl =         document.getElementById("search-icon-id");
    this.searchButtonEl =       document.getElementById("search-button-id");
    this.oldSearchId = 			"old-search-id";
    this.newSearchId = 			"new-search-id";
    this.oldSearchEl =         	document.getElementById(this.oldSearchId);
    this.navbarLogoEl =         document.getElementById("navbar-logo-id"); 
    this.logoImgEl =         	document.getElementById("logo-img-id");
    this.logoTextEl =       	document.getElementById("logo-text-id"); 
    this.themeTogglerEl =       document.getElementById("theme-toggler-id");
    this.themeImgEl =         	document.getElementById("theme-img-id");
    this.prevClass =           	"prev";
    this.expandedClass =       	"expanded";
    this.collapsedClass =      	"collapsed";
    this.darkThemeClass =      	"dark-theme";
    this.lightThemeClass =     	"light-theme";  
    this.imgPath =             	"/static/img/"; 
};


// theme variables for hover
const THEME_CONSTANTS = new function() {
	this.THEME_CONSTANTS_DARK = {
	    logo:               GENERAL_CONSTANTS.imgPath + "logo.png",
	    logoHover:          GENERAL_CONSTANTS.imgPath + "logo-dark-hover.png",
	    theme:              GENERAL_CONSTANTS.imgPath + "theme-dark.png",
	    themeHover:         GENERAL_CONSTANTS.imgPath + "theme-dark-hover.png",
	    themeSwitchText:    "Go light!",
	    textColor:          "white",
	    textColorHover:     "#d6d6d6"
	};
	this.THEME_CONSTANTS_LIGHT = {
	    logo:               GENERAL_CONSTANTS.imgPath + "logo.png",
	    logoHover:          GENERAL_CONSTANTS.imgPath + "logo-light-hover.png",
	    theme:              GENERAL_CONSTANTS.imgPath + "theme-light.png",
	    themeHover:         GENERAL_CONSTANTS.imgPath + "theme-light-hover.png",
	    themeSwitchText:    "Go dark!",
	    textColor:          "#252525",
	    textColorHover:     "#a0a0a0"
	};
};


// messages
const MESSAGE_CONSTANTS = new function() {
	this.errorRoomLength0 = "Room name length must be greater than 0";
};
