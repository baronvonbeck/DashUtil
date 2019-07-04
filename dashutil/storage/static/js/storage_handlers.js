// storage_handlers.js - handles input events and calls storage.js methods 
// to deal with page direction and displaying messages to users
'use strict';


// keyboard, click, hover, focus, etc event handlers for the storage page
var STORAGE_EVENT_HANDLERS = new function() {

	// Method to call back to upload a new file. Takes storage page name, 
	// file uploaded, and parent directory id as parameters
	this.uploadNewFileToFolderCallback = null;
	
	// Handler to set up event listeners. 1 callback passed in from storage.js
	this.addAllEventListeners = function(newUploadNewFileToFolderCallback) {

		this.uploadNewFileToFolderCallback = newUploadNewFileToFolderCallback;

	    // submit file button click
	    STORAGE_CONSTANTS.uploadButton.addEventListener(
	    	"click", this.uploadNewFileToFolderHandler, false);
    };
    
    
    // handles uploading of the file to the storage room or a subdirectory
    // using the callback provided
	this.uploadNewFileToFolderHandler = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStorageName();
        var filesToUpload = STORAGE_CONSTANTS.uploadField.files;
        var parentDirectoryId = 
            STORAGE_EVENT_HANDLERS.getParentDirectoryForFileUpload();

        if (filesToUpload.length > 0) {
            STORAGE_EVENT_HANDLERS.uploadNewFileToFolderCallback(
                storagePageName, filesToUpload, parentDirectoryId);

            STORAGE_CONSTANTS.uploadField.value = '';
        }
    };


    // returns the parent directory a file was uploaded to
    this.getParentDirectoryForFileUpload = function() {
        var parentDirectoryId = STORAGE_EVENT_HANDLERS.getStorageId();

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


    // returns the storage page id, formatted to remove all single and 
    // double quotes ['"]
    this.getStorageId = function() {
        return STORAGE_EVENT_HANDLERS.formatString(storagePageId.textContent);
    };


    // returns the name of the storage, with unicode converted to characters
    // and formatted to remove all single and double quotes ['"]
    this.getStorageName = function() {
        return STORAGE_EVENT_HANDLERS.unicodeToChar(
            STORAGE_EVENT_HANDLERS.formatString(storagePage.textContent));
    };

    
    // formats a string to remove all single and double quotes ['"]
    this.formatString = function(text) {
        return text.replace(/['"]+/g, '');
    };


    // converts unicode to characters
    this.unicodeToChar = function(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
     }
};