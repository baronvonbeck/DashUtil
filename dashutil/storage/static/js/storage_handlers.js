// storage_handlers.js - handles input events and calls storage.js methods 
// to deal with page direction and displaying messages to users
'use strict';


// keyboard, click, hover, focus, etc event handlers for the storage page
var STORAGE_EVENT_HANDLERS = new function() {

	// Method to call back to upload a new file. Takes storage page name, 
	// file uploaded, and parent directory id as parameters
    this.uploadNewFileToDirectoryCallback = null;
    
    // Method to call back to create a new directory. Takes storage page name, 
	// file uploaded, and parent directory id as parameters
    this.createNewDirectoryCallback = null;

    // Method to call back to upload a new file. Takes storage page name, 
	// file uploaded, and parent directory id as parameters
    this.renameFilesCallback = null;
    
    // storage variables
    this.storagePageId = null;
    this.storagePageName = null;
    this.storagePageFields = null;
	
	// Handler to set up event listeners. 1 callback passed in from storage.js
    this.addAllEventListeners = function(newUploadNewFileToDirectoryCallback, 
        newCreateNewDirectoryCallback) {

		this.uploadNewFileToDirectoryCallback = newUploadNewFileToDirectoryCallback;
        this.createNewDirectoryCallback = newCreateNewDirectoryCallback;
        this.renameFilesCallback = newRenameFilesCallback;


	    // submit file button click
	    STORAGE_CONSTANTS.uploadButtonEl.addEventListener(
            "click", this.uploadNewFileToDirectoryHandler, false);
            

        // create new directory modal button
        STORAGE_CONSTANTS.directoryModalButtonEl.addEventListener(
            "click", this.openDirectoryModal, false);

        // close new directory modal by clicking cancel
        STORAGE_CONSTANTS.directoryCloseButtonEl.addEventListener(
            "click", this.closeDirectoryModal, false);

        // click ok to create a new directory
        STORAGE_CONSTANTS.directoryOkButtonEl.addEventListener(
            "click", this.createNewDirectory, false);


        // rename modal button
        STORAGE_CONSTANTS.renameModalButtonEl.addEventListener(
            "click", this.openRenameyModal, false);

        // close rename modal by clicking cancel
        STORAGE_CONSTANTS.renameCloseButtonEl.addEventListener(
            "click", this.closeRenameModal, false);

        // click ok to rename file(s)
        STORAGE_CONSTANTS.renameOkButtonEl.addEventListener(
            "click", this.renameFiles, false);

        
        // click off of modals to close
        window.addEventListener(
            "click", function(event) {
                if (event.target == STORAGE_CONSTANTS.directoryModalEl)
                    STORAGE_EVENT_HANDLERS.closeDirectoryModal();
                else if (event.target == STORAGE_CONSTANTS.renameModalEl)
                    STORAGE_EVENT_HANDLERS.closeRenameModal();
            }, false);

        
    };


    // creates a new directory
    this.createNewDirectory = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
        var newDirectoryName = STORAGE_EVENT_HANDLERS.unicodeToChar(
            STORAGE_EVENT_HANDLERS.formatString(
                STORAGE_CONSTANTS.directoryTextEl.value));
        var parentDirectoryId = 
            STORAGE_EVENT_HANDLERS.getParentDirectoryForAction();

        if (newDirectoryName.length > 0) {
            STORAGE_EVENT_HANDLERS.createNewDirectoryCallback(
                storagePageName, newDirectoryName, parentDirectoryId);
        }

        STORAGE_EVENT_HANDLERS.closeDirectoryModal();
    };


    // renames a selected file or list of files
    this.renameFiles = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
        var renameName = STORAGE_EVENT_HANDLERS.unicodeToChar(
            STORAGE_EVENT_HANDLERS.formatString(
                STORAGE_CONSTANTS.renameTextEl.value));
        var fileIdsToRename = STORAGE_EVENT_HANDLERS.getIdsOfClickedElements();

        if (renameName.length > 0 && filesToRename.length > 0) {
            STORAGE_EVENT_HANDLERS.renameFilesCallback(
                storagePageName, fileIdsToRename, renameName);
        }
        else {
            // error
            // say that files renamed must be > length 0
            // and that 1 or more files must be selected
        }

        STORAGE_EVENT_HANDLERS.closeRenameModal();
    };


    // opens the new directory modal
    this.openDirectoryModal = function() {
        STORAGE_CONSTANTS.directoryModalEl.style.display = "block";
    };

    // opens the rename modal
    this.openRenameModal = function() {
        STORAGE_CONSTANTS.renameModalEl.style.display = "block";
    };


    // closes the new directory modal
    this.closeDirectoryModal = function() {
        STORAGE_CONSTANTS.directoryModalEl.style.display = "none";
    };

    // closes the rename modal
    this.closeRenameModal = function() {
        STORAGE_CONSTANTS.renameModalEl.style.display = "none";
    };


    
    
    
    // handles uploading of the file to the storage room or a subdirectory
    // using the callback provided
	this.uploadNewFileToDirectoryHandler = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
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


    // gets the id(s) of clicked elements
    this.getIdsOfClickedElements = function() {
        var idList = [];
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

        return idList;
    };


    // returns the storage page id, formatted to remove all single and 
    // double quotes ['"]
    this.getStoragePageId = function() {
        if (this.storagePageId == null) {
            this.storagePageId = STORAGE_EVENT_HANDLERS.getJsonFromDataString(
                storagePage.textContent).pk;
        }
        
        return this.storagePageId;
    };


    // returns the name of the storage, with unicode converted to characters
    // and formatted to remove all single and double quotes ['"]
    this.getStoragePageName = function() {
        if (this.storagePageName == null) {
            this.storagePageName = 
                STORAGE_EVENT_HANDLERS.getStoragePageFields().filename;
        }
        
        return this.storagePageName;
    };


    // returns all of the fields of the storage, with unicode converted to
    // characters and formatted to remove all single and double quotes ['"]
    this.getStoragePageFields = function() {
        if (this.storagePageFields == null) {
            this.storagePageFields = STORAGE_EVENT_HANDLERS.getJsonFromDataString(
                storagePage.textContent).fields;
        }
        
        return this.storagePageFields;
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


    // parses string into json data
    this.getJsonFromDataString = function(dataString) {
        return JSON.parse(STORAGE_EVENT_HANDLERS.unicodeToChar(
            dataString.replace('\'upload_path\': None', 
                    '\'upload_path\': null').replace(/[']+/g, '"')
                ));
    };
};