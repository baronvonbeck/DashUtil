// storage_handlers.js - handles input events and calls storage.js methods 
// to deal with page direction and displaying messages to users
'use strict';


// keyboard, click, hover, focus, etc event handlers
var STORAGE_EVENT_HANDLERS = new function() {

	// Method to call back to upload a new file
	// Takes ______ as parameters
	this.uploadNewFileToFolderCallback = null;
	
	// Handler to set up event listeners. 1 callback passed in from storage.js
	this.addAllEventListeners = function(newUploadNewFileToFolderCallback) {

		this.uploadNewFileToFolderCallback = newUploadNewFileToFolderCallback;

	    // search button click
	    STORAGE_CONSTANTS.uploadButton.addEventListener(
	    	"click", this.uploadNewFileToFolderHandler, false);
    };
    
    // handles finding or creation of new room using callback provided,
	// including checking if string is valid or not
	this.uploadNewFileToFolderHandler = function() {
        
        STORAGE_EVENT_HANDLERS.uploadNewFileToFolderCallback(storageName.textContent.replace(/['"]+/g, ""),
            STORAGE_CONSTANTS.uploadField.files[0]);
        
        STORAGE_CONSTANTS.uploadField.value = '';
    }
};