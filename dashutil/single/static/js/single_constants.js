// single_constants.js - holds constants that will not change
'use strict';


// Single constants
const SINGLE_CONSTANTS = new function() {

    this.fileHolderId =             document.getElementById("file-id");

    this.openUploadModalEl =        document.getElementById("upload-modal-button-id");
    this.uploadModalEl =            document.getElementById("upload-modal-id");
    this.uploadModalContentEl =     document.getElementById("upload-modal-content-id");
    this.uploadFileButtonEl =       document.getElementById("upload-file-button-id");
    this.uploadFileFieldEl =        document.getElementById("upload-file-id");
    this.uploadCloseButtonEl =      document.getElementById("upload-cancel-id");

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
