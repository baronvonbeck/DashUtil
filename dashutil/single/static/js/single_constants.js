// single_constants.js - holds constants that will not change
'use strict';


// Single constants
const SINGLE_CONSTANTS = new function() {

    this.fileHolderEl =             document.getElementById("file-id");

    this.openUploadModalEl =        document.getElementById("upload-modal-button-id");
    this.uploadModalEl =            document.getElementById("upload-modal-id");
    this.uploadModalContentEl =     document.getElementById("upload-modal-content-id");
    this.uploadFileButtonEl =       document.getElementById("upload-file-button-id");
    this.uploadFileFieldEl =        document.getElementById("upload-file-id");
    this.uploadCloseButtonEl =      document.getElementById("upload-cancel-id");

    this.downloadModalButtonEl =    document.getElementById("download-modal-button-id");
    this.downloadModalEl =          document.getElementById("download-modal-id");
    this.downloadModalContentEl =   document.getElementById("download-modal-content-id");
    this.downloadFieldEl =          document.getElementById("download-file-id");
    this.downloadButtonEl =         document.getElementById("download-button-id");
    this.downloadCloseButtonEl =    document.getElementById("download-cancel-id");

    this.errorModalEl =             document.getElementById("error-modal-id");
    this.errorModalContentEl =      document.getElementById("error-modal-content-id");
    this.errorModalTextEl =         document.getElementById("error-modal-text-id");
    this.errorOkButtonEl =          document.getElementById("error-ok-id");

    this.progressModalEl =          document.getElementById("progress-modal-id");
    this.progressModalContentEl =   document.getElementById("progress-modal-content-id");
    this.progressModalTextEl =      document.getElementById("progress-modal-text-id");
    this.progressOkButtonEl =       document.getElementById("progress-ok-id");

    this.fileClass =                "fileobj";
    this.infoIDAppend =             "__in";

    this.numFunctions =             2;
    this.menuEl =                   document.getElementById("menu-id");
    this.menuEls =                  [
                                        document.getElementById("menu-upload-id"),
                                        document.getElementById("menu-download-id")
                                    ];
    
    this.menuIconPath =             "/static/img/menuico/";
    this.menuLightIcons =           [
                                        this.menuIconPath + "upload-light.png",
                                        this.menuIconPath + "download-light.png"
                                    ];

    this.menuDarkIcons =            [
                                        this.menuIconPath + "upload-dark.png",
                                        this.menuIconPath + "download-dark.png"
                                    ];

    this.fileIconPath =             "/static/img/fileico/";
    this.directoryCloseLightIcon =  this.fileIconPath + "directory-close-light.png";
    this.directoryOpenLightIcon =   this.fileIconPath + "directory-open-light.png";
    this.genericFileLightIcon =     this.fileIconPath + "generic-file-light.png";
    this.directoryCloseDarkIcon =   this.fileIconPath + "directory-close-dark.png";
    this.directoryOpenDarkIcon =    this.fileIconPath + "directory-open-dark.png";
    this.genericFileDarkIcon =      this.fileIconPath + "generic-file-dark.png";

    this.errorUpload1File =     "Only one file, no folders, can be uploaded at a time for a single file page. If \
        you want to upload multiple files or folders, go to a storage page using the orange search bar.";
};
