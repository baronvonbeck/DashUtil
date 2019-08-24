// single_to_db.js - "interface" methods to call to access database wrapper, 
// and will do any parsing necessary on return data from ajax calls in the
// event that a new backend is used
'use strict';

const SINGLE_DB = new function() {

    // Uploads a new file
    // This method is called back from SINGLE_EVENT_HANDLERS
    this.uploadFileToSingle = function(fileToUpload) {
        uploadFileToSingleDB(SINGLE_DB.errorMessageCaller, fileToUpload);
    }


    // Calls error message if ajax call fails
    this.errorMessageCaller = function(errorMessage) {
        SINGLE_EVENT_HANDLERS.displayError(errorMesage);
    };
}