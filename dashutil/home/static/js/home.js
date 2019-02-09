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

// Finds or creates a room as appropriate. This method is called back from
// HOME_EVENT_HANDLERS
function findOrCreateRoom(roomToSearchFor) {
    console.log("find or create room: " + roomToSearchFor);
    searchForRoom(roomToSearchFor);
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
