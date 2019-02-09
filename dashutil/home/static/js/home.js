// home.js -- handles page direction and adding messages for users to see
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
    window.location.href = ALL_CONSTANTS.storagePath + roomToSearchFor;
}

/*****************************************************************************
 * Search Functions ----- END ------
 *****************************************************************************/


 /****************************************************************************
 * Error Functions ----- START ------
 *****************************************************************************/

// Creates error messages based on string that is passed in
function createErrorMessage(errorMessage) {
    console.log("Error: " + errorMessage);
}

/*****************************************************************************
 * Error Functions ----- END ------
 *****************************************************************************/
