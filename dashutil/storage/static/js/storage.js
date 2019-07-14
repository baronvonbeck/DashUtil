// storage.js -- handles storage page functionality, API calls, page UI
'use strict';


$(document).ready(function() {

    // Set up event handlers
    STORAGE_EVENT_HANDLERS.addAllEventListeners(
        uploadNewFilesToDirectory, createNewDirectory);

    addFilesToPage(JSON.parse(storageFiles.textContent));     
}); 


/*****************************************************************************
 * Storage Functions ----- START ------
 *****************************************************************************/

// Uploads a new file to a given directory within a storage
// This method is called back from STORAGE_EVENT_HANDLERS
function uploadNewFilesToDirectory(storageName, filesToUpload, parentDirectoryId) {

    uploadFileToStorageDB(addFilesToPage, fileUploadFailedError,
        storageName, filesToUpload, parentDirectoryId);
}


// Creates a new directory under a given directory within a storage
// This method is called back from STORAGE_EVENT_HANDLERS
function createNewDirectory(storageName, newDirectoryName, parentDirectoryId) {

    createNewDirectoryDB(addFilesToPage, directoryCreationFailedError,
        storageName, newDirectoryName, parentDirectoryId);
}


// Adds files/directories to the storage page
function addFilesToPage(files) {

    FILE_MANAGER.addFileListToPage(files);
}


// Displays error after a file failed to upload
// This method is called back after a file failed to upload
function fileUploadFailedError(errorMessage, parentDirectoryId) {
    // TODO: handle this
}


// Displays error after a file failed to upload
// This method is called back after a file failed to upload
function directoryCreationFailedError(errorMessage, parentDirectoryId) {
    // TODO: handle this
}

/*****************************************************************************
 * Storage Functions ----- END ------
 *****************************************************************************/



/*****************************************************************************
 * Helper Functions ----- START ------
 *****************************************************************************/

// converts file size to a human readable format, copying django filesizeformat
// functionality. si determines whether or not to use si standard
function formatFileSizeToString(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' bytes';
    }
    var units = si
        ? ['KB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KB','MB','GB','TB','PB','EB','ZB','YB']
        // : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

/*****************************************************************************
 * Helper Functions ----- END ------
 *****************************************************************************/