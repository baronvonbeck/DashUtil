// storage_handlers.js - handles input events and calls storage.js methods 
// to deal with page direction and displaying messages to users
'use strict';


// keyboard, click, hover, focus, etc event handlers for the storage page
var STORAGE_EVENT_HANDLERS = new function() {

	// Method to call back to upload a new file. Takes storage page name, 
	// file uploaded, and parent directory id as parameters
    this.uploadNewFileToDirectoryCallback = null;
    
    // Method to call back to upload a new file. Takes storage page name, 
	// file uploaded, and parent directory id as parameters
	this.createNewDirectoryCallback = null;
	
	// Handler to set up event listeners. 1 callback passed in from storage.js
    this.addAllEventListeners = function(newUploadNewFileToDirectoryCallback, 
        newCreateNewDirectoryCallback) {

		this.uploadNewFileToDirectoryCallback = newUploadNewFileToDirectoryCallback;
        this.createNewDirectoryCallback = newCreateNewDirectoryCallback;


	    // submit file button click
	    STORAGE_CONSTANTS.uploadButtonEl.addEventListener(
            "click", this.uploadNewFileToDirectoryHandler, false);
            
        // create new directory modal button
        STORAGE_CONSTANTS.openModalButtonEl.addEventListener(
            "click", this.openDirectoryModal, false);

        // close new directory modal by clicking cancel
        STORAGE_CONSTANTS.directoryCloseButtonEl.addEventListener(
            "click", this.closeDirectoryModal, false);
        
        // click off of the directory modal to close
        window.addEventListener(
            "click", function(event) {
                if (event.target == STORAGE_CONSTANTS.directoryModalEl)
                    STORAGE_EVENT_HANDLERS.closeDirectoryModal();
            }, false);

        // click ok to create a new directory
        STORAGE_CONSTANTS.directoryOkButtonEl.addEventListener(
            "click", this.createNewDirectory, false);
    };


    // creates a new directory
    this.createNewDirectory = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStorageName();
        var newDirectoryName = STORAGE_EVENT_HANDLERS.unicodeToChar(
            STORAGE_EVENT_HANDLERS.formatString(
                STORAGE_CONSTANTS.directoryTextEl.value));
        var parentDirectoryId = 
            STORAGE_EVENT_HANDLERS.getParentDirectoryForAction();

        console.log(newDirectoryName);

        if (newDirectoryName.length > 0) {
            STORAGE_EVENT_HANDLERS.createNewDirectoryCallback(
                storagePageName, newDirectoryName, parentDirectoryId);
        }
    };


    // closes the new directory modal
    this.closeDirectoryModal = function() {
        STORAGE_CONSTANTS.directoryModalEl.style.display = "none";
    };


    // opens the new directory modal
    this.openDirectoryModal = function() {
        STORAGE_CONSTANTS.directoryModalEl.style.display = "block";
    };
    
    
    // handles uploading of the file to the storage room or a subdirectory
    // using the callback provided
	this.uploadNewFileToDirectoryHandler = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStorageName();
        var filesToUpload = STORAGE_CONSTANTS.uploadFieldEl.files;
        var parentDirectoryId = 
            STORAGE_EVENT_HANDLERS.getParentDirectoryForAction();

        if (filesToUpload.length > 0) {
            STORAGE_EVENT_HANDLERS.uploadNewFileToDirectoryCallback(
                storagePageName, filesToUpload, parentDirectoryId);

            STORAGE_CONSTANTS.uploadFieldEl.value = '';
        }
    };


    // returns the parent directory an action corresponds too
    this.getParentDirectoryForAction = function() {
        var parentDirectoryId = STORAGE_EVENT_HANDLERS.getStoragePageId();

        /* Psuedocode, fill in later when implementation catches up 
        if (context of the file is the storage page itself, base directory)
            parentDirectoryId = this.getStoragePageId();
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
    this.getStoragePageId = function() {
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
    };
};