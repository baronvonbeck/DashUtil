// home_to_db.js - "interface" methods to call to access database wrapper, 
// and will do any parsing necessary on return data from ajax calls in the
// event that a new backend is used
'use strict';

const HOME_DB = new function() {

    // Goes to the storage page for input string 
    // This method is called back from HOME_EVENT_HANDLERS
    this.findOrCreateRoom = function(roomToSearchFor) {
        searchOrCreateAndGoToStorageDB(roomToSearchFor);
    }

    // Uploads file and then goes to a single page corresponding to that file 
    // This method is called back from HOME_EVENT_HANDLERS
    this.uploadFileToSingle = function(fileToUpload) {
        uploadFileToSingleDB(HOME_DB.errorMessageCaller, fileToUpload);
    }

    // Calls error message if ajax call fails
    this.errorMessageCaller = function(errorMessage) {
        HOME_EVENT_HANDLERS.displayError(errorMesage);
    };
}