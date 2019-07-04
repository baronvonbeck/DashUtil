// single_constants.js - holds constants that will not change
'use strict';


// Single constants
const SINGLE_CONSTANTS = new function() {
    this.uploadField =          document.getElementById("submit-single-file-id");
    this.uploadButton =         document.getElementById("submit-single-button-id");
    this.tableId   =            document.getElementById("table-single-id");
    this.tableBody =            this.tableId.getElementsByTagName("tbody")[0];
    this.prevClass =           	"prev";
    this.expandedClass =       	"expanded";
    this.collapsedClass =      	"collapsed";
    this.darkThemeClass =      	"dark-theme";
    this.lightThemeClass =     	"light-theme";  
    this.imgPath =             	"/static/img/"; 
};
