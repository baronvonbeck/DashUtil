// storage.js -- initializer
'use strict';


$(document).ready(function() {
    FILE_MANAGER.initializeSelf();

    FILE_MANAGER.createStorageFileRecord(
        STORAGE_EVENT_HANDLERS.getStoragePageId(), 
        STORAGE_EVENT_HANDLERS.getStoragePageFields());

    FILE_MANAGER.addExistingFileListToPage(
        STORAGE_EVENT_HANDLERS.getJsonFromDataString(
            storageFiles.textContent));

    document.getElementById("storageFiles").remove();
    document.getElementById("storagePage").remove();

    // Set up event handlers
    STORAGE_EVENT_HANDLERS.addAllEventListeners();
}); 





/*****************************************************************************
 * Helper Functions ----- START ------
 *****************************************************************************/

/*****************************************************************************
 * Helper Functions ----- END ------
 *****************************************************************************/