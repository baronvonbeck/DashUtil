// storage_constants.js - holds constants that will not change
'use strict';


// Storage constants
const STORAGE_CONSTANTS = new function() {
    this.mainEl =                   document.getElementById("main-id");
    this.storagePageInfoEl =        document.getElementById("storage-page-info-id");
    this.fileListEl =               document.getElementById("file-list-id");
    this.listIdEl =                 document.getElementById("file-list-temp-id");

    this.buttonListEl =             document.getElementById("button-list-id");
    this.modalListEl =              document.getElementById("modal-list-id");

    this.uploadModalButtonEl =      document.getElementById("upload-modal-button-id");
    this.uploadModalEl =            document.getElementById("upload-modal-id");
    this.uploadModalContentEl =     document.getElementById("upload-modal-content-id");
    this.uploadFileFieldEl =        document.getElementById("upload-file-id");
    this.uploadFileButtonEl =       document.getElementById("upload-file-button-id");
    this.uploadDirFieldEl =         document.getElementById("upload-dir-id");
    this.uploadDirButtonEl =        document.getElementById("upload-dir-button-id");
    this.uploadCloseButtonEl =      document.getElementById("upload-cancel-id");

    this.downloadModalButtonEl =    document.getElementById("download-modal-button-id");
    this.downloadModalEl =          document.getElementById("download-modal-id");
    this.downloadModalContentEl =   document.getElementById("download-modal-content-id");
    this.downloadFieldEl =          document.getElementById("download-file-id");
    this.downloadButtonEl =         document.getElementById("download-button-id");
    this.downloadCloseButtonEl =    document.getElementById("download-cancel-id");

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

    this.moveModalButtonEl =        document.getElementById("move-button-id");
    this.moveModalEl =              document.getElementById("move-modal-id");
    this.moveModalContentEl =       document.getElementById("move-modal-content-id");
    this.moveOkButtonEl =           document.getElementById("move-ok-id");
    this.moveCloseButtonEl =        document.getElementById("move-cancel-id");

    this.progressModalEl =          document.getElementById("progress-modal-id");
    this.moveModalContentEl =       document.getElementById("progress-modal-content-id");
    this.progressModalTextEl =      document.getElementById("progress-modal-text-id");
    this.progressOkButtonEl =       document.getElementById("progress-ok-id");
    

    this.numFunctions =             7;

    this.modalButtonEls =           [this.uploadModalButtonEl, this.uploadModalButtonEl, this.downloadModalButtonEl,
                                     this.directoryModalButtonEl, this.renameModalButtonEl,
                                     this.deleteModalButtonEl, this.moveModalButtonEl];
    
    this.modalEls =                 [this.uploadModalEl, this.uploadModalEl, this.downloadModalEl,
                                     this.directoryModalEl, this.renameModalEl,
                                     this.deleteModalEl, this.moveModalEl];

    this.modalCloseEls =            [this.uploadCloseButtonEl, this.uploadCloseButtonEl, this.downloadCloseButtonEl,
                                     this.directoryCloseButtonEl, this.renameCloseButtonEl,
                                     this.deleteCloseButtonEl, this.moveCloseButtonEl];
    
    this.modalOkEls =               [this.uploadFileButtonEl, this.uploadDirButtonEl, this.downloadButtonEl,
                                     this.directoryOkButtonEl, this.renameOkButtonEl,
                                     this.deleteOkButtonEl, this.moveOkButtonEl];


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
    this.draggingClass =            "dragging";
    this.dragToClass =              "dragto";
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


    this.uploadInProgressMessage =      "Uploading files. This may take a few minutes, depending on file sizes...";
    this.downloadInProgressMessage =    "Downloading files. This may take a few minutes, depending on file sizes...";
};
