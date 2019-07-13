// storage_constants.js - holds constants that will not change
'use strict';


// Storage constants
const STORAGE_CONSTANTS = new function() {
    this.uploadFieldEl =            document.getElementById("submit-file-id");
    this.uploadButtonEl =           document.getElementById("submit-button-id");
    this.tableIdEl   =              document.getElementById("table-id");
    this.tableBodyEl =              this.tableIdEl.getElementsByTagName("tbody")[0];
    this.openModalButtonEl =        document.getElementById("directory-modal-button-id");
    this.directoryModalEl =         document.getElementById("new-directory-modal-id");
    this.directoryTextEl =          document.getElementById("new-directory-text-id");
    this.directoryOkButtonEl =      document.getElementById("new-directory-ok-id");
    this.directoryCloseButtonEl =   document.getElementById("new-directory-cancel-id");
    this.modalContentEl =           document.getElementById("modal-content-id");
    this.closeModalEl =             document.getElementById("close-modal-id");
    this.darkThemeClass =      	    "dark-theme";
    this.lightThemeClass =     	    "light-theme";
};
