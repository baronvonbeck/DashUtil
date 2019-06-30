/* database-wrapper.js
 * 
 * Wrapper class for getting data from and posting data to the database
 */


$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
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


// searches for a storage; if none is found, creates one
function searchOrCreateAndGoToStorage(storageName, errorCallback) {
    window.location.href = ALL_CONSTANTS.storagePath + encodeURIComponent( storageName );
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


// uploads a file to the database
function uploadFile(successCallback, errorCallback, storageName,
    filesToUpload, parentDirectoryId) {

    var fileData = new FormData();
    fileData.append("parent_directory_id", parentDirectoryId);
    for (var i = 0; i < filesToUpload.length; i ++) {
        fileData.append("file", filesToUpload[i]);
    }
    $.ajax({
        url: ALL_CONSTANTS.storagePath + encodeURIComponent( storageName ),
        method: 'POST',
        data: fileData,
        cache: false,   
        processData: false,
        contentType: false,
        success: function(data) {
            successCallback(JSON.parse(data.replace(/[']+/g, '"')));
        },
        error: function(data) {
            errorCallback(JSON.parse(data.replace(/[']+/g, '"')));
        }
    });
}