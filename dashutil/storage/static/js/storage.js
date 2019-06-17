// storage.js -- handles storage page functionality
'use strict';


$(document).ready(function() {

    // Set up event handlers
    STORAGE_EVENT_HANDLERS.addAllEventListeners(
        uploadNewFileToFolder);

}); 


/*****************************************************************************
 * File Functions ----- START ------
 *****************************************************************************/

// Uploads a new file
// This method is called back from STORAGE_EVENT_HANDLERS
function uploadNewFileToFolder(storageName, fileToUpload) {
    console.log(fileToUpload);
    uploadFile(storageName, fileToUpload);
}

/*****************************************************************************
 * File Functions ----- END ------
 *****************************************************************************/