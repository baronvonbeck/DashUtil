// home_constants.js - holds constants that will not change
'use strict';


// General constants
const HOME_CONSTANTS = new function() {
    this.inputTextEl =           	document.getElementById("input-text-id");
    this.searchBoxEl =           	document.getElementById("search-box-id"); 
    this.searchIconEl =             document.getElementById("search-icon-id");
    this.searchButtonEl =           document.getElementById("search-button-id");

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

    this.oldSearchId = 			    "old-search-id";
    this.newSearchId = 			    "new-search-id";
    this.oldSearchEl =         	    document.getElementById(this.oldSearchId);
    this.prevClass =           	    "prev";
    this.expandedClass =       	    "expanded";
    this.collapsedClass =      	    "collapsed";
    

    this.errorRoomLength0 =             "Room name must contain at least one or more valid characters. \
        None of the following characters are allowed: \' \" \\ \/ ";
    this.errorUpload1File =             "Only one file, no folders, can be uploaded at a time for a single file page. If \
        you want to upload multiple files or folders, go to a storage page using the orange search bar.";
    this.uploadInProgressMessage =      "Uploading file. This may take a few minutes, depending on file size. \
        You will be redirected to your new page when the upload has finished.";
};
