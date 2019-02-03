// home.js -- handles page direction and adding messages for users to see
'use strict';


$(document).ready(function() {

    // Set up event handlers
    HOME_EVENT_HANDLERS.addAllEventListeners(
        findOrCreateRoomCallback, createErrorMessageCallback);

}); 

/*****************************************************************************
 * Search Functions ----- START ------
 *****************************************************************************/

// Finds or creates a room as appropriate. This method is called back from
// HOME_EVENT_HANDLERS
function findOrCreateRoomCallback(roomToSearchFor) {
    console.log("searching for: " + roomToSearchFor);
}

/*****************************************************************************
 * Search Functions ----- END ------
 *****************************************************************************/


 /****************************************************************************
 * Error Functions ----- START ------
 *****************************************************************************/

// Creates error messages based on string that is passed in
function createErrorMessageCallback(errorMessage) {
    console.log("Error: " + errorMessage);
}

/*****************************************************************************
 * Error Functions ----- END ------
 *****************************************************************************/
