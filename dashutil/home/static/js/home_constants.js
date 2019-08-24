// home_constants.js - holds constants that will not change
'use strict';


// General constants
const HOME_CONSTANTS = new function() {
    this.inputTextEl =         	document.getElementById("input-text-id");
    this.searchBoxEl =         	document.getElementById("search-box-id"); 
    this.searchIconEl =         document.getElementById("search-icon-id");
    this.searchButtonEl =       document.getElementById("search-button-id");

    this.errorModalEl =         document.getElementById("error-modal-id");
    this.errorModalContentEl =  document.getElementById("error-modal-content-id");
    this.errorModalTextEl =     document.getElementById("error-modal-text-id");
    this.errorOkButtonEl =      document.getElementById("error-ok-id");

    this.oldSearchId = 			"old-search-id";
    this.newSearchId = 			"new-search-id";
    this.oldSearchEl =         	document.getElementById(this.oldSearchId);
    this.prevClass =           	"prev";
    this.expandedClass =       	"expanded";
    this.collapsedClass =      	"collapsed";
    

    this.errorRoomLength0 =     "Room name must contain at least one or more valid characters. \
        None of the following characters are allowed: \' \" \\ \/ ";
    this.errorUpload1File =     "Only one file, no folders, can be uploaded at a time for a single file page. If \
        you want to upload multiple files or folders, go to a storage page using the orange search bar.";
};
