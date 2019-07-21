// storage_constants.js - holds constants that will not change
'use strict';


// Storage constants
const STORAGE_CONSTANTS = new function() {
    this.uploadFieldEl =            document.getElementById("submit-file-id");
    this.uploadButtonEl =           document.getElementById("submit-button-id");
    this.tableIdEl   =              document.getElementById("table-id");
    this.tableBodyEl =              this.tableIdEl.getElementsByTagName("tbody")[0];
    this.storagePageInfoEl =        document.getElementById("storage-page-info-id");

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

    this.darkThemeClass =      	    "dark-theme";
    this.lightThemeClass =     	    "light-theme";
    this.fileClass =                "fileobj"
    this.selectedClass =            "selected";
    
};
