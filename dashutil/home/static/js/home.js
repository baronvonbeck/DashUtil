// home.js -- handles page direction, displaying errors, calling API, etc
'use strict';


$(document).ready(function() {

    // Set up event handlers
    HOME_EVENT_HANDLERS.addAllEventListeners(
        findOrCreateRoom, createErrorMessage);

}); 

/*****************************************************************************
 * Search Functions ----- START ------
 *****************************************************************************/

// Goes to the storage page for input string 
// This method is called back from HOME_EVENT_HANDLERS
function findOrCreateRoom(roomToSearchFor) {
    searchOrCreateAndGoToStorage(roomToSearchFor);
}

/*****************************************************************************
 * Search Functions ----- END ------
 *****************************************************************************/


 /****************************************************************************
 * Error Functions ----- START ------
 *****************************************************************************/

// Creates error messages based on string that is passed in
// This method is called back from HOME_EVENT_HANDLERS
function createErrorMessage(errorMessage) {
    console.log("Error: " + errorMessage);
}


// Handles error messages from GET request of storage page
// This method is called back from database_wrapper
function getRequestError(storageName, data) {
    console.log("Storage name get request error: " + storageName);
    console.log(data);
}

/*****************************************************************************
 * Error Functions ----- END ------
 *****************************************************************************/
