// storage.js -- handles storage page functionality, API calls, page UI
'use strict';


$(document).ready(function() {

    // Set up event handlers
    STORAGE_EVENT_HANDLERS.addAllEventListeners(
        uploadNewFilesToDirectory, createNewDirectory, renameFiles);

    FILE_MANAGER.createStorageFileRecord(
        STORAGE_EVENT_HANDLERS.getStoragePageId(), 
        STORAGE_EVENT_HANDLERS.getStoragePageFields());

    FILE_MANAGER.addExistingFileListToPage(
        STORAGE_EVENT_HANDLERS.getJsonFromDataString(
            storageFiles.textContent));
}); 


/*****************************************************************************
 * Storage Functions ----- START ------
 *****************************************************************************/

// Uploads a new file to a given directory within a storage
// This method is called back from STORAGE_EVENT_HANDLERS
function uploadNewFilesToDirectory(storageName, filesToUpload, parentDirectoryId) {

    uploadFileToStorageDB(addNewFilesToPage, fileUploadFailedError,
        storageName, filesToUpload, parentDirectoryId);
}


// Creates a new directory under a given directory within a storage
// This method is called back from STORAGE_EVENT_HANDLERS
function createNewDirectory(storageName, newDirectoryName, parentDirectoryId) {

    createNewDirectoryDB(addNewFilesToPage, directoryCreationFailedError,
        storageName, newDirectoryName, parentDirectoryId);
}


// Renames a file or list of files
// This method is called back from STORAGE_EVENT_HANDLERS
function renameFiles(storageName, fileIdsToRename, renameName) {

    renameFilesDB(addNewFilesToPage, renameFailedError,
        storageName, fileIdsToRename, renameName);
}


// Adds files/directories to the storage page
function addNewFilesToPage(files) {

    FILE_MANAGER.addNewFileListToPage(files);
}


// Displays error after a file failed to upload
// This method is called back after a file failed to upload
function fileUploadFailedError(errorMessage, parentDirectoryId) {
    // TODO: handle this
}


// Displays error after a directory failed to be created
// This method is called back after a directory failed to be created
function directoryCreationFailedError(errorMessage, parentDirectoryId) {
    // TODO: handle this
}


// Displays error after file(s) failed to be renamed
// This method is called back after file(s) failed to be renamed
function renameFailedError(errorMessage, parentDirectoryId) {
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