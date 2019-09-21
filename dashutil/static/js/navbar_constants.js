// all_constants.js - holds constants that will not change
'use strict';


// navbar variables for hover and theme switch
const NAVBAR_CONSTANTS = new function() {

    this.navbarLogoEl =         document.getElementById("navbar-logo-id"); 
    this.logoImgEl =         	document.getElementById("logo-img-id");
    this.logoTextEl =       	document.getElementById("logo-text-id"); 
    this.themeTogglerEl =       document.getElementById("theme-toggler-id");
    this.themeImgEl =         	document.getElementById("theme-img-id");
    this.darkThemeClass =      	"dark-theme";
    this.lightThemeClass =     	"light-theme";  
    this.THEME_COOKIE =         "dashutil_cookie_current_theme";
    this.imgPath =             	"/static/img/"; 

	this.NAVBAR_CONSTANTS_DARK = {
	    logo:               this.imgPath + "logo.png",
	    logoHover:          this.imgPath + "logo-dark-hover.png",
	    theme:              this.imgPath + "theme-dark.png",
	    themeHover:         this.imgPath + "theme-dark-hover.png",
	    themeSwitchText:    "Go light!",
	    textColor:          "white",
	    textColorHover:     "#d6d6d6"
	};
	this.NAVBAR_CONSTANTS_LIGHT = {
	    logo:               this.imgPath + "logo.png",
	    logoHover:          this.imgPath + "logo-light-hover.png",
	    theme:              this.imgPath + "theme-light.png",
	    themeHover:         this.imgPath + "theme-light-hover.png",
	    themeSwitchText:    "Go dark!",
	    textColor:          "#252525",
	    textColorHover:     "#a0a0a0"
	};
};
