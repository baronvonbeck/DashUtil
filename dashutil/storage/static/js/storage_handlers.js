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

    this.unicodeToChar = function(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
     }

    // returns the name of the storage
    this.getStorageName = function() {
        return this.unicodeToChar(this.formatString(storagePage.textContent));
    };

    

    this.formatString = function(stringToFormat) {
        return stringToFormat.replace(/['"]+/g, "");
    };

    //
    this.getStorageId = function() {
        return this.formatString(storagePageId.textContent);
    };
    
    // handles uploading of the file to the storage room or a subdirectory
    // using the callback provided
	this.uploadNewFileToFolderHandler = () => {

        var storagePageName = this.getStorageName();
        var fileToUpload = STORAGE_CONSTANTS.uploadField.files[0];
        var parentDirectoryId = this.getParentDirectoryForFileUpload();
        
        STORAGE_EVENT_HANDLERS.uploadNewFileToFolderCallback(
            storagePageName, fileToUpload, parentDirectoryId);
        
        STORAGE_CONSTANTS.uploadField.value = '';
    };

    // returns the parent directory a file was uploaded to
    this.getParentDirectoryForFileUpload = function() {
        var parentDirectoryId = this.getStorageId();

        /* Psuedocode, fill in later when implementation catches up 
        if (context of the file is the storage page itself, base directory)
            parentDirectoryId = this.getStorageId();
        else {
            if uploadPath of clicked directory == null
                parentDirectoryId = the clicked directory
            else
                // element clicked wasn't a directory, it was a regular file
                parentDirectoryId = parent directory of the clicked file
        }
        */

        return parentDirectoryId;
    };

    
};