// home.js

// General constants
const generalConstants = {
    inputTextId:        "input-text-id",
    searchBoxId:        "search-box-id", 
    searchIconId:       "search-icon-id",
    searchButtonId:     "search-button-id",
    oldSearchId:        "old-search-id",
    newSearchId:        "new-search-id",  
    logoImgId:          "logo-img-id",
    logoTextId:         "logo-text-id", 
    themeImgId:         "theme-img-id",
    togglerIconId:      "navbar-toggler-icon-id",
    prevClass:          "prev",
    expandedClass:      "expanded",
    collapsedClass:     "collapsed",
    darkThemeClass:     "dark-theme",
    lightThemeClass:    "light-theme",  
    imgPath:            "/static/img/" 
};

// dark theme variables
const themeConstantsDark = {
    logo: generalConstants.imgPath + "logo.png",
    logoHover: generalConstants.imgPath + "logo-dark-hover.png",
    theme: generalConstants.imgPath + "theme-dark.png",
    themeHover: generalConstants.imgPath + "theme-dark-hover.png",
    textColor: "white",
    textColorHover: "#bfbfbf"
};
const themeConstantsLight = {
    logo: generalConstants.imgPath + "logo.png",
    logoHover: generalConstants.imgPath + "logo-light-hover.png",
    theme: generalConstants.imgPath + "theme-light.png",
    themeHover: generalConstants.imgPath + "theme-light-hover.png",
    textColor: "#252525",
    textColorHover: "#bfbfbf"
};
var allThemeConstants = {
    darkTheme:          true,
    lightTheme:         false
};

var currentTheme = themeConstantsDark;

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
        case "escape": 
        case "esc": 
            if (searchBox.classList.contains(generalConstants.expandedClass)) { 
                contractSearchBox(); 

                // no this isnt a mistake
                expandSearchBox(); 
            } 
            break; 

        case "tab":
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
    document.getElementById(generalConstants.logoImgId).setAttribute("src", currentTheme.logoHover);
    document.getElementById(generalConstants.logoTextId).style.color = currentTheme.textColorHover;
}


// unhover function for logo
function unhoverLogo() {
    document.getElementById(generalConstants.logoImgId).setAttribute("src", currentTheme.logo);
    document.getElementById(generalConstants.logoTextId).style.color = currentTheme.textColor;
}


// hover function for theme
function hoverTheme() {
    document.getElementById(generalConstants.themeImgId).setAttribute("src", currentTheme.themeHover);
}


// unhover function for theme
function unhoverTheme() {
    document.getElementById(generalConstants.themeImgId).setAttribute("src", currentTheme.theme);
}


// switch themes
function switchThemes() {
    if (allThemeConstants.darkTheme == true) {
        allThemeConstants.darkTheme = false;
        allThemeConstants.lightTheme = true;

        currentTheme = themeConstantsLight;
        document.body.className = document.body.className.replace(generalConstants.darkThemeClass, generalConstants.lightThemeClass);
    }
    else {
        allThemeConstants.darkTheme = true;
        allThemeConstants.lightTheme = false;

        currentTheme = themeConstantsDark;
        document.body.className = document.body.className.replace(generalConstants.lightThemeClass, generalConstants.darkThemeClass);
    }

    unhoverLogo();
    unhoverTheme();
}


// handles keydown for theme switching on enter
function switchThemesHandler(e) {
    e.stopPropagation();
    switchThemes();
}


// handles keydown for theme switching on enter
function themeKeydown(e) {
    var keycode = e.key.toLowerCase();

    if (keycode == "enter") {
        e.preventDefault();
        switchThemes();
    }
}


// handles keydown for searching from search button
function searchKeydown(e) {
    var keycode = e.key.toLowerCase();

    if (keycode == "enter") 
        findOrCreateRoom();
}


// handles keydown for searching from input text
function inputTextKeydown(e) {
    var keycode = e.key.toLowerCase();

    if (keycode == "enter") 
        findOrCreateRoom();
}



/*
function blurTogglerIcon() {
    var togglerIcon = document.getElementById(generalConstants.togglerIconId);
    if (!togglerIcon.classList.contains(generalConstants.collapsedClass)) {
        togglerIcon.blur();
    }
}
*/




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
