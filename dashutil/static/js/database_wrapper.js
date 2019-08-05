/* database-wrapper.js
 * 
 * Wrapper class for getting data from and posting data to the database
 */

/*****************************************************************************
 * Setup Functions ----- START ------
 *****************************************************************************/

 // setup csrf tokens
$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i ++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                     if (cookie.substring(0, name.length + 1) == (name + '=')) {
                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                         break;
                     }
                 }
             }
             return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     } 
});

/*****************************************************************************
 * Setup Functions ----- END ------
 *****************************************************************************/



 /*****************************************************************************
 * Storage Functions ----- START ------
 *****************************************************************************/

// searches for a storage; if none is found, creates one
function searchOrCreateAndGoToStorage(storageName, errorCallback) {
    window.location.href = ALL_CONSTANTS.storagePath + 
        encodeURIComponent(storageName);
    // $.ajax({
    //     url: ALL_CONSTANTS.storagePath + storageName,
    //     async: true,
    //     method: 'GET',
    //     data: { },
    //     success: function(data) {
    //         window.location.href = ALL_CONSTANTS.storagePath + storageName;
    //     },
    //     error: function(data) {
    //         errorCallback(storageName, data);
    //     }
    // });
}


// uploads a file to the database for a storage page
function uploadFileToStorageDB(successCallback, errorCallback, storageName,
    filesToUpload, parentDirectoryId) {

    var fileData = new FormData();
    fileData.append("parent_directory_id", parentDirectoryId);
    for (var i = 0; i < filesToUpload.length; i ++) {
        fileData.append("file", filesToUpload[i]);
    }

    $.ajax({
        url: ALL_CONSTANTS.storagePath + encodeURIComponent(storageName),
        method: 'POST',
        data: fileData,
        cache: false,   
        processData: false,
        contentType: false,
        success: function(data) {
            successCallback(getJsonFromDataString(data));
        },
        error: function(data) {
            errorCallback(getJsonFromDataString(data), parentDirectoryId);
        }
    });
}

// gets a list of files (with paths) and upload urls from the database
function getFilePathsAndUrlsDB(successCallback, errorCallback, storageName,
    fileIdsToDownload) {

    var directoryData = new FormData();
    directoryData.append("file_ids_to_download", fileIdsToDownload);
    
    $.ajax({
        url: ALL_CONSTANTS.storagePath + encodeURIComponent(storageName),
        method: 'POST',
        data: directoryData,
        cache: false,   
        processData: false,
        contentType: false,
        success: function(data) {
            successCallback(getJsonFromDataString(data));
        },
        error: function(data) {
            errorCallback(getJsonFromDataString(data), null);
        }
    });
}


// gets the files within a directory on a storge page
function getFilesWithinDirectoryDB(successCallback, errorCallback, storageName,
    directoryId) {

    var directoryData = new FormData();
    directoryData.append("directory_id", directoryId);

    $.ajax({
        url: ALL_CONSTANTS.storagePath + encodeURIComponent(storageName),
        method: 'POST',
        data: directoryData,
        cache: false,   
        processData: false,
        contentType: false,
        success: function(data) {
            successCallback(getJsonFromDataString(data));
        },
        error: function(data) {
            errorCallback(getJsonFromDataString(data), parentDirectoryId);
        }
    });
}


// creates a new directory representation within database for a storage page
function createNewDirectoryDB(successCallback, errorCallback, storageName,
    newDirectoryName, parentDirectoryId) {

    var directoryData = new FormData();
    directoryData.append("parent_directory_id", parentDirectoryId);
    directoryData.append("new_directory_name", newDirectoryName);
    
    $.ajax({
        url: ALL_CONSTANTS.storagePath + encodeURIComponent(storageName),
        method: 'POST',
        data: directoryData,
        cache: false,   
        processData: false,
        contentType: false,
        success: function(data) {
            successCallback(getJsonFromDataString(data));
        },
        error: function(data) {
            errorCallback(getJsonFromDataString(data), parentDirectoryId);
        }
    });
}


// deletes a list of files and directories from the database
function renameFilesDB(successCallback, errorCallback, storageName,
    fileIdsToRename, renamedFileName) {

    var directoryData = new FormData();
    directoryData.append("renamed_file_name", renamedFileName);
    directoryData.append("file_ids_to_rename", fileIdsToRename);
    
    $.ajax({
        url: ALL_CONSTANTS.storagePath + encodeURIComponent(storageName),
        method: 'POST',
        data: directoryData,
        cache: false,   
        processData: false,
        contentType: false,
        success: function(data) {
            successCallback(getJsonFromDataString(data));
        },
        error: function(data) {
            errorCallback(getJsonFromDataString(data), parentDirectoryId);
        }
    });
}


// deletes a list of files and directories from the database
function deleteFilesDB(successCallback, errorCallback, storageName,
    fileIdsToDelete) {

    var directoryData = new FormData();
    directoryData.append("file_ids_to_delete", fileIdsToDelete);
    
    $.ajax({
        url: ALL_CONSTANTS.storagePath + encodeURIComponent(storageName),
        method: 'POST',
        data: directoryData,
        cache: false,   
        processData: false,
        contentType: false,
        success: function(data) {
            successCallback(getJsonFromDataString(data));
        },
        error: function(data) {
            errorCallback(getJsonFromDataString(data), null);
        }
    });
}


// moves a list of files and directories to underneath a given parent
function moveFilesToDirectoryDB(successCallback, errorCallback, storageName,
    fileIdsToMove, parentDirectoryId) {

    var directoryData = new FormData();
    directoryData.append("parent_directory_id", parentDirectoryId);
    directoryData.append("file_ids_to_move", fileIdsToMove);
    
    $.ajax({
        url: ALL_CONSTANTS.storagePath + encodeURIComponent(storageName),
        method: 'POST',
        data: directoryData,
        cache: false,   
        processData: false,
        contentType: false,
        success: function(data) {
            successCallback(getJsonFromDataString(data));
        },
        error: function(data) {
            errorCallback(getJsonFromDataString(data), parentDirectoryId);
        }
    });
} 


function getJsonFromDataString(dataString) {
    return JSON.parse(dataString.replace(/'upload_path': None/g, 
                '\'upload_path\': null').replace(/[']+/g, '"')
                // .replace(/\"\]\[\"/g, "\"],[\"")
                .replace(/\"\, None\]/g, "\"\, null\]"));
}

/*****************************************************************************
 * Storage Functions ----- END ------
 *****************************************************************************/



/*****************************************************************************
 * Single Functions ----- START ------
 *****************************************************************************/

 // goes to a single file page. if one does not exist, go back to home page
function searchForAndGoToSingleFile(singlePageId) {
    window.location.href = ALL_CONSTANTS.singlePath + 
        encodeURIComponent(singlePageId);
    // $.ajax({
    //     url: ALL_CONSTANTS.storagePath + storageName,
    //     async: true,
    //     method: 'GET',
    //     data: { },
    //     success: function(data) {
    //         window.location.href = ALL_CONSTANTS.storagePath + storageName;
    //     },
    //     error: function(data) {
    //         errorCallback(storageName, data);
    //     }
    // });
}


// uploads a file to the database for a single page
function uploadFileToSingle(successCallback, errorCallback, singlePageId,
    fileToUpload) {

    var fileData = new FormData();
    fileData.append("file", fileToUpload);

    $.ajax({
        url: ALL_CONSTANTS.singlePath + encodeURIComponent( singlePageId ),
        method: 'POST',
        data: fileData,
        cache: false,   
        processData: false,
        contentType: false,
        success: function(data) {
            searchForAndGoToSingleFile(data.new_file_id)
        },
        error: function(data) {
            errorCallback(getJsonFromDataString(data));
        }
    });
}

/*****************************************************************************
 * Single Functions ----- END ------
 *****************************************************************************/