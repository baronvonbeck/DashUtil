// storage.js -- handles storage page functionality, API calls, 
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
function uploadNewFileToFolder(storageName, fileToUpload, parentDirectoryId) {

    uploadFile(addUploadedFileToPage, fileUploadFailedError,
        storageName, fileToUpload, parentDirectoryId);
}


// Adds the newly uploaded file to the storage page
// This method is called back after a file was successfully uploaded
function addUploadedFileToPage(fileUploaded) {
    var newRow = STORAGE_CONSTANTS.tableBody.insertRow();
    newRow.insertCell(0).innerHTML = "<a href=" + fileUploaded.fields.upload_path + 
        " target=\"_blank\">" + fileUploaded.fields.filename + "</a>";
    newRow.insertCell(1).innerHTML = fileUploaded.fields.create_timestamp;
    newRow.insertCell(2).innerHTML = fileUploaded.fields.modify_timestamp;
    newRow.insertCell(3).innerHTML = formatFileSizeToString(fileUploaded.fields.size, false);
}


// Displays error after a file failed to upload
// This method is called back after a file failed to upload
function fileUploadFailedError(errorMessage) {
    // TODO: handle this
}


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
 * File Functions ----- END ------
 *****************************************************************************/