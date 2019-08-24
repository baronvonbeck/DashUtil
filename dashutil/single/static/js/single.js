// single.js -- starts single page functionality
"use strict";


$(document).ready(function() {

    SINGLE_EVENT_HANDLERS.addFileToSinglePage(
        SINGLE_EVENT_HANDLERS.getJsonFromDataString(
            singleFile.textContent)[0]);

    document.getElementById("singleFile").remove();
    document.getElementById("singlePageId").remove();

    // Set up event handlers
    SINGLE_EVENT_HANDLERS.addAllEventListeners();

}); 


/*****************************************************************************
 * File Functions ----- START ------
 *****************************************************************************/


// converts file size to a human readable format, copying django filesizeformat
// functionality. si determines whether or not to use si standard
function formatFileSizeToString(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + " bytes";
    }
    var units = si
        ? ["KB","MB","GB","TB","PB","EB","ZB","YB"]
        : ["KB","MB","GB","TB","PB","EB","ZB","YB"]
        // : ["KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + " " + units[u];
}

/*****************************************************************************
 * File Functions ----- END ------
 *****************************************************************************/