// home.js

// General constants
const generalConstants = {
    inputTextId:        "input-text",
    searchBoxId:        "search-box", 
    searchIconId:       "search-icon",
    searchButtonId:     "search-button",
    oldSearchId:        "old-search",
    newSearchId:        "new-search", 
    prevClass:          "prev",
    expandedClass:      "expanded", 
    logoImgId:          "logo-img-id",
    logoTextId:         "logo-text-id", 
    themeImgId:         "theme-img-id"
};

// light theme variables
const darkThemeConstants = {

}
var currentThemeConstants = {

}

$(document).ready(function() {

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
    var roomToSearchFor = document.getElementById(generalConstants.inputTextId).value.toString().trim();

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
    var searchBox = document.getElementById(generalConstants.searchBoxId);

    switch (keycode) {
        case "enter":
            if (!searchBox.classList.contains(generalConstants.expandedClass)) 
                expandSearchBox(); 
            else if (searchBox.classList.contains(generalConstants.expandedClass))
                findOrCreateRoom();
            break; 

        case "escape": 
        case "esc": 
            if (searchBox.classList.contains(generalConstants.expandedClass)) { 
                contractSearchBox(); 

                // no this isnt a mistake
                expandSearchBox(); 
            } 
            break; 

        case "tab":
            var logoId = document.getElementById("logo-id");
            var searchButton = document.getElementById(generalConstants.searchButtonId);

            if (!searchBox.classList.contains(generalConstants.expandedClass)) {
                e.preventDefault();
                expandSearchBox(); 
            }
            break;
    }
}


// Handler for expanding the search box
function expandSearchBox() { 
    var searchBox = document.getElementById(generalConstants.searchBoxId);
    var searchIcon = document.getElementById(generalConstants.searchIconId);
    var inputText = document.getElementById(generalConstants.inputTextId);
    var searchButton = document.getElementById(generalConstants.searchButtonId); 
    var oldSearch = document.getElementById(generalConstants.oldSearchId);

    if (searchBox.classList.contains(generalConstants.prevClass)) {
        searchBox.classList.remove(generalConstants.prevClass);
        searchIcon.classList.remove(generalConstants.prevClass);
        inputText.classList.remove(generalConstants.prevClass);
        searchButton.classList.remove(generalConstants.prevClass);
    }
    else if (!searchBox.classList.contains(generalConstants.expandedClass)) {
        searchBox.classList.add(generalConstants.expandedClass);
        searchIcon.classList.add(generalConstants.expandedClass);
        inputText.classList.add(generalConstants.expandedClass);
        searchButton.classList.add(generalConstants.expandedClass); 
        oldSearch.id = generalConstants.newSearchId; 

        moveCaretToEnd(inputText);
    }
}


// Handler for contracting the search box
function contractSearchBox() {
    var searchBox = document.getElementById(generalConstants.searchBoxId);
    var searchIcon = document.getElementById(generalConstants.searchIconId);
    var inputText = document.getElementById(generalConstants.inputTextId);
    var searchButton = document.getElementById(generalConstants.searchButtonId); 
    var newSearch = document.getElementById(generalConstants.newSearchId);

    if (searchBox.classList.contains(generalConstants.expandedClass)) {
        searchBox.classList.remove(generalConstants.expandedClass);
        searchIcon.classList.remove(generalConstants.expandedClass);
        inputText.classList.remove(generalConstants.expandedClass);
        searchButton.classList.remove(generalConstants.expandedClass); 

        searchBox.classList.add(generalConstants.prevClass);
        searchIcon.classList.add(generalConstants.prevClass);
        inputText.classList.add(generalConstants.prevClass);
        searchButton.classList.add(generalConstants.prevClass); 
        newSearch.id = generalConstants.oldSearchId; 
    }      
}


// hover function for logo
function hoverLogo() {
    document.getElementById(generalConstants.logoImgId).setAttribute("src", "/static/img/logo-dark-highlight.png");
    document.getElementById(generalConstants.logoTextId).style.color = "#d6d6d6";
}


// unhover function for logo
function unhoverLogo() {
    document.getElementById(generalConstants.logoImgId).setAttribute("src", "/static/img/logo-dark.png");
    document.getElementById(generalConstants.logoTextId).style.color = "white";
}


// hover function for logo
function hoverTheme() {
    document.getElementById(generalConstants.themeImgId).setAttribute("src", "/static/img/theme-light.png");
}


// unhover function for logo
function unhoverTheme() {
    document.getElementById(generalConstants.themeImgId).setAttribute("src", "/static/img/theme-dark.png");
}


// switch themes
function switchThemes() {
    document.getElementById(generalConstants.themeImgId).setAttribute("src", "/static/img/theme-dark.png");
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
