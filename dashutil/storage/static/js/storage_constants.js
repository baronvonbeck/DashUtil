// storage_constants.js - holds constants that will not change
'use strict';


// Storage constants
const STORAGE_CONSTANTS = new function() {
    this.mainEl =                   document.getElementById("main-id");
    this.storagePageInfoEl =        document.getElementById("storage-page-info-id");
    this.fileListEl =               document.getElementById("file-list-id");
    this.listIdEl =                 document.getElementById("file-list-temp-id");

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


    this.nameSortId =               "name-sort-id";
    this.modifySortId =             "modify-sort-id";
    this.createSortId =             "create-sort-id";
    this.sizeSortId =               "size-sort-id";
    this.nameSortEl =               document.getElementById(this.nameSortId);
    this.modifySortEl =             document.getElementById(this.modifySortId);
    this.createSortEl =             document.getElementById(this.createSortId);
    this.sizeSortEl =               document.getElementById(this.sizeSortId);

    this.darkThemeClass =      	    "dark-theme";
    this.lightThemeClass =     	    "light-theme";
    this.fileClass =                "fileobj"
    this.selectedClass =            "selected";
    this.sortingClass =             "sorting";
    this.sortUpClass =              "sort-up";
    this.sortDownClass =            "sort-down";
    
    this.ulIDAppend =               "__ul";
    this.infoIDAppend =             "__in";
    this.liIDAppend =               "__li";

    this.createdText =              "Created: ";
    this.modifiedText =             "Modified: ";
    this.sizeText =                 "Size";

    this.fileIconPath =             "/static/img/fileico/";
    this.directoryCloseLightIcon =  this.fileIconPath + "directory-close-light.png";
    this.directoryOpenLightIcon =   this.fileIconPath + "directory-open-light.png";
    this.genericFileLightIcon =     this.fileIconPath + "generic-file-light.png";

};
