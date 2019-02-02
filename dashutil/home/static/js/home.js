// home.js
'use strict';


$(document).ready(function() {

    // Set up event handlers
    HOME_EVENT_HANDLERS.addAllEventListeners();

}); 

/*****************************************************************************
 * Search Functions ----- START ------
 *****************************************************************************/

// Finds or creates a room as appropriate
function findOrCreateRoom(roomToSearchFor) {
    if (roomToSearchFor.length > 0) {
        console.log("Searching for: " + roomToSearchFor); 
    }
    else 
        createErrorMessage(MESSAGE_CONSTANTS.errorRoomLength0);
}

/*****************************************************************************
 * Search Functions ----- END ------
 *****************************************************************************/


 /****************************************************************************
 * Error Functions ----- START ------
 *****************************************************************************/

// Creates error messages based on string that is passed in
function createErrorMessage(errorMessage) {
    console.log(errorMessage);
}

/*****************************************************************************
 * Error Functions ----- END ------
 *****************************************************************************/
