// single_handlers.js - handles input events and calls single.js methods 
// to deal with page direction and displaying messages to users
'use strict';


// keyboard, click, hover, focus, etc event handlers for the storage page
var SINGLE_EVENT_HANDLERS = new function() {

	// Method to call back to upload a new file. Takes storage page name, 
	// file uploaded, and parent directory id as parameters
	this.uploadNewFileToSingleCallback = null;
	
	// Handler to set up event listeners. 1 callback passed in from storage.js
	this.addAllEventListeners = function(newUploadNewFileToSingleCallback) {

		this.uploadNewFileToSingleCallback = newUploadNewFileToSingleCallback;

	    // submit single file button click
	    SINGLE_CONSTANTS.uploadButton.addEventListener(
	    	"click", this.uploadNewFileToFolderHandler, false);
    };
    
    
    // handles uploading of the file to the storage room or a subdirectory
    // using the callback provided
	this.uploadNewFileToFolderHandler = function() {
        var singlePageId = SINGLE_EVENT_HANDLERS.getSingleId();
        var fileToUpload = SINGLE_CONSTANTS.uploadField.files[0];

        SINGLE_EVENT_HANDLERS.uploadNewFileToSingleCallback(
            singlePageId, fileToUpload);

        SINGLE_CONSTANTS.uploadField.value = "";
    };


    // returns the name of the storage, with unicode converted to characters
    // and formatted to remove all single and double quotes ['"]
    this.getSingleId = function() {
        return SINGLE_EVENT_HANDLERS.unicodeToChar(
            SINGLE_EVENT_HANDLERS.formatString(singlePageId.textContent));
    };

    
    // formats a string to remove all single and double quotes ['"]
    this.formatString = function(text) {
        return text.replace(/['"]+/g, "");
    };


    // converts unicode to characters
    this.unicodeToChar = function(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });
     }
};