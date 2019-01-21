// search.js

$( document ).ready(function() {

    // Set up keyboard event handler
    $(document).keydown(function(e) {
        handleKeyboardEvents(e);
    }); 
}); 

/*****************************************************************************
 * Search Functions ----- START ------
 *****************************************************************************/

// Finds or creates a room as appropriate
function findOrCreateRoom() {
    var roomToSearchFor = document.getElementById("input-text").value.toString().trim();

    if (roomToSearchFor.length > 0) {
        console.log("Searching for: " + roomToSearchFor); 
    }
    else 
        createErrorMessage("Room length should be greater than 0");
}

/*****************************************************************************
 * Search Functions ----- END ------
 *****************************************************************************/


 /*****************************************************************************
 * Error Functions ----- START ------
 *****************************************************************************/

// Creates error messages based on string that is passed in
function createErrorMessage(errorMessage) {
    console.log(errorMessage);
}

/*****************************************************************************
 * Error Functions ----- END ------
 *****************************************************************************/


/*****************************************************************************
 * Handler Functions ----- START ------
 *****************************************************************************/

// Handler for keyboard events
function handleKeyboardEvents(e) {
    var keycode = e.key.toLowerCase();
    var searchBox = document.getElementById("search-box");

    switch (keycode) {
        case "enter":
            if (!searchBox.classList.contains("expanded")) 
                expandSearchBox(); 
            else if (searchBox.classList.contains("expanded"))
                findOrCreateRoom();
            
            break; 

        case "escape": 
        case "esc": 
            if (searchBox.classList.contains("expanded")) { 
                contractSearchBox(); 

                // no this isnt a mistake
                expandSearchBox(); 
            } 
            break; 

        case "tab":
            var inputText = document.getElementById("input-text");
            var searchButton = document.getElementById("search-button"); 
            if (e.key.toLowerCase() == "tab") {
                e.preventDefault();
            }
            if (!searchBox.classList.contains("expanded")) {
                expandSearchBox(); 
            }
            else if (searchBox.classList.contains("expanded")) {
                if (document.activeElement == inputText) {
                    searchButton.focus();
                }
                else { // if (document.activeElement == searchButton) {
                    inputText.focus();
                    moveCaretToEnd(inputText);
                }
            }
            break;
    }
}


// Handler for expanding the search box
function expandSearchBox() { 
    var searchBox = document.getElementById("search-box");
    var searchIcon = document.getElementById("search-icon");
    var inputText = document.getElementById("input-text");
    var searchButton = document.getElementById("search-button"); 
    var oldSearch = document.getElementById("old-search");

    if (searchBox.classList.contains("prev")) {
        searchBox.classList.remove("prev");
        searchIcon.classList.remove("prev");
        inputText.classList.remove("prev");
        searchButton.classList.remove("prev");
    }
    else if (!searchBox.classList.contains("expanded")) {
        searchBox.classList.add("expanded");
        searchIcon.classList.add("expanded");
        inputText.classList.add("expanded");
        searchButton.classList.add("expanded"); 
        oldSearch.id = "new-search"; 

        moveCaretToEnd(inputText);
    }
}


// Handler for contracting the search box
function contractSearchBox() {
    var searchBox = document.getElementById("search-box");
    var searchIcon = document.getElementById("search-icon");
    var inputText = document.getElementById("input-text");
    var searchButton = document.getElementById("search-button"); 
    var newSearch = document.getElementById("new-search");

    if (searchBox.classList.contains("expanded")) {
        searchBox.classList.remove("expanded");
        searchIcon.classList.remove("expanded");
        inputText.classList.remove("expanded");
        searchButton.classList.remove("expanded"); 

        searchBox.classList.add("prev");
        searchIcon.classList.add("prev");
        inputText.classList.add("prev");
        searchButton.classList.add("prev"); 
        newSearch.id = "old-search"; 
    }      
}


// hover function for logo
function hoverLogo() {
    document.getElementById("logo-id").setAttribute("src", "/static/img/logo-dark-orange.png");
    document.getElementById("logo-text-id").style.color = "#d6d6d6";
}


// unhover function for logo
function unhoverLogo() {
    document.getElementById("logo-id").setAttribute("src", "/static/img/logo-light-orange.png");
    document.getElementById("logo-text-id").style.color = "white";
}

/*****************************************************************************
 * Handler Functions ----- END ------
 *****************************************************************************/


/*****************************************************************************
 * Helper Functions ----- START ------
 *****************************************************************************/

// moves the caret to the end of the input line
function moveCaretToEnd(el) { 
    var temp = el.value;
    el.value = '';
    el.value = temp;
    el.focus();
}

/*****************************************************************************
 * Helper Functions ----- END ------
 *****************************************************************************/
