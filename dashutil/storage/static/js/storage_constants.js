// storage_constants.js - holds constants that will not change
'use strict';


// Storage constants
const STORAGE_CONSTANTS = new function() {

    this.storagePageInfoEl =        document.getElementById("storage-page-info-id");
    this.listIdEl   =               document.getElementById("file-list-temp-id");

    this.uploadModalButtonEl =      document.getElementById("upload-modal-button-id");
    this.uploadModalEl =            document.getElementById("upload-modal-id");
    this.uploadModalContentEl =     document.getElementById("upload-modal-content-id");
    this.uploadFieldEl =            document.getElementById("upload-file-id");
    this.uploadButtonEl =           document.getElementById("upload-button-id");
    this.uploadCloseButtonEl =      document.getElementById("upload-cancel-id");

    this.directoryModalButtonEl =   document.getElementById("directory-modal-button-id");
    this.directoryModalEl =         document.getElementById("directory-modal-id");
    this.directoryModalContentEl =  document.getElementById("directory-modal-content-id");
    this.directoryTextEl =          document.getElementById("directory-text-id");
    this.directoryOkButtonEl =      document.getElementById("directory-ok-id");
    this.directoryCloseButtonEl =   document.getElementById("directory-cancel-id");

    this.renameModalButtonEl =      document.getElementById("rename-modal-button-id");
    this.renameModalEl =            document.getElementById("rename-modal-id");
    this.renameModalContentEl =     document.getElementById("rename-modal-content-id");
    this.renameTextEl =             document.getElementById("rename-text-id");
    this.renameOkButtonEl =         document.getElementById("rename-ok-id");
    this.renameCloseButtonEl =      document.getElementById("rename-cancel-id");

    this.deleteModalButtonEl =      document.getElementById("delete-button-id");
    this.deleteModalEl =            document.getElementById("delete-modal-id");
    this.deleteModalContentEl =     document.getElementById("delete-modal-content-id");
    this.deleteOkButtonEl =         document.getElementById("delete-ok-id");
    this.deleteCloseButtonEl =      document.getElementById("delete-cancel-id");

    this.darkThemeClass =      	    "dark-theme";
    this.lightThemeClass =     	    "light-theme";
    this.fileClass =                "fileobj"
    this.selectedClass =            "selected";
    // this.collapsibleClass =         "collapsible";
    
    this.ulIDAppend =               "__ul";
    this.infoIDAppend =             "__in";
    this.liIDAppend =               "__li";

    this.createdText =              "Created: ";
    this.modifiedText =             "Modified: ";
    this.sizeText =                 "Size";
};
