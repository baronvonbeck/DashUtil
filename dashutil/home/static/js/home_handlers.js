// home_handlers.js - handles input events and displaying ui/messages to users
// calls home_to_db.js to deal with page direction
'use strict';


// keyboard, click, hover, focus, etc event handlers for the home page
var HOME_EVENT_HANDLERS = new function() {

	
	// Handler to set up event listeners. 2 callbacks passed in from home.js
	this.addAllEventListeners = function() {

        NAVBAR_EVENT_HANDLERS.addNavbarEventListeners();

	    // general keyboard event handlers
	    document.addEventListener("keydown", 
	    	function(e) { HOME_EVENT_HANDLERS.handleKeyboardEvents(e); 
	    }); 
	    
	    // search box magnifying glass expand
	    HOME_CONSTANTS.searchBoxEl.addEventListener(
	    	"click", this.expandSearchBox, false);

	    // search box close contract
	    HOME_CONSTANTS.searchIconEl.addEventListener(
	    	"click", this.contractSearchBox, false);

	    // input text search on enter
	    HOME_CONSTANTS.inputTextEl.addEventListener(
	    	"keydown", function(e) { 
                if (HOME_CONSTANTS.errorModalEl.style.display == "block") {
                    HOME_CONSTANTS.errorModalEl.style.display = "none";
                    return;
                }
                HOME_EVENT_HANDLERS.searchKeydownEnter(e); 
            }, false);

	    // search button click
	    HOME_CONSTANTS.searchButtonEl.addEventListener(
	    	"click", function(e) { 
                if (HOME_CONSTANTS.errorModalEl.style.display == "block") {
                    HOME_CONSTANTS.errorModalEl.style.display = "none";
                    return;
                }
                e.stopPropagation();
                HOME_EVENT_HANDLERS.findOrCreateRoomHandler(); 
            }, false); 
	    HOME_CONSTANTS.searchButtonEl.addEventListener(
	    	"keydown", function(e) { 
                if (HOME_CONSTANTS.errorModalEl.style.display == "block") {
                    HOME_CONSTANTS.errorModalEl.style.display = "none";
                    return;
                }
                HOME_EVENT_HANDLERS.searchKeydownEnter(e); 
            }, false);
            

        // click off of modals to close, or off to side to deselect
        window.addEventListener(
            "click", function(event) {
                HOME_CONSTANTS.errorModalEl.style.display = "none";
            }, false);

        // enter or escape on modals to close
        window.addEventListener(
            "keydown", function(event) {
                if (event.keyCode === 13 || event.keyCode == 27) {
                    if (HOME_CONSTANTS.errorModalEl.style.display == "block") {
                        HOME_CONSTANTS.errorModalEl.style.display = "none";
                        return;
                    }
                }                    
            }, false);

        HOME_CONSTANTS.errorOkButtonEl.addEventListener(
            "click", function(event) {
                event.stopPropagation();
                HOME_CONSTANTS.errorModalEl.style.display = "none";              
            }, false);
	};


	// Handler for keyboard events
	this.handleKeyboardEvents = function(e) {
	    var keycode = e.key.toLowerCase();

	    switch (keycode) {
	        case "escape": 
	        case "esc": 
	            if (HOME_CONSTANTS.searchBoxEl.classList.contains(
	            	HOME_CONSTANTS.expandedClass)) { 
                    HOME_EVENT_HANDLERS.contractSearchBox(); 

	                // no this isnt a mistake
	                HOME_EVENT_HANDLERS.expandSearchBox(); 
	            } 
	            break; 

	        case "tab":
	          	if (!HOME_CONSTANTS.searchBoxEl.classList.contains(
	          		HOME_CONSTANTS.expandedClass)) {
	                e.preventDefault();
	                HOME_EVENT_HANDLERS.expandSearchBox(); 
	            }
	            break;
	    }
	};


	// Handler for expanding the search box
	this.expandSearchBox = function() { 
	    if (HOME_CONSTANTS.searchBoxEl.classList.contains(
	    	HOME_CONSTANTS.prevClass)) {

	        HOME_CONSTANTS.searchBoxEl.classList.remove(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.searchIconEl.classList.remove(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.inputTextEl.classList.remove(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.searchButtonEl.classList.remove(
	        	HOME_CONSTANTS.prevClass);
	    }
	    else if (!HOME_CONSTANTS.searchBoxEl.classList.contains(
	    	HOME_CONSTANTS.expandedClass)) {

	        HOME_CONSTANTS.searchBoxEl.classList.add(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.searchIconEl.classList.add(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.inputTextEl.classList.add(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.searchButtonEl.classList.add(
	        	HOME_CONSTANTS.expandedClass); 
	        HOME_CONSTANTS.oldSearchEl.id = HOME_CONSTANTS.newSearchId;

	        HOME_EVENT_HANDLERS.moveCaretToEnd(HOME_CONSTANTS.inputTextEl);
	    }
	};


	// Handler for contracting the search box
	this.contractSearchBox = function() {
	    if (HOME_CONSTANTS.searchBoxEl.classList.contains(
	    	HOME_CONSTANTS.expandedClass)) {

	        HOME_CONSTANTS.searchBoxEl.classList.remove(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.searchIconEl.classList.remove(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.inputTextEl.classList.remove(
	        	HOME_CONSTANTS.expandedClass);
	        HOME_CONSTANTS.searchButtonEl.classList.remove(
	        	HOME_CONSTANTS.expandedClass); 

	        HOME_CONSTANTS.searchBoxEl.classList.add(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.searchIconEl.classList.add(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.inputTextEl.classList.add(
	        	HOME_CONSTANTS.prevClass);
	        HOME_CONSTANTS.searchButtonEl.classList.add(
	        	HOME_CONSTANTS.prevClass); 
	        document.getElementById(HOME_CONSTANTS.newSearchId).id = 
	        	HOME_CONSTANTS.oldSearchId; 
	    }      
	};


	

	// handles keydown for searching from search button
	this.searchKeydownEnter = function(e) {
	    var keycode = e.key.toLowerCase();

	    if (keycode == "enter") {
            event.stopPropagation();
            HOME_EVENT_HANDLERS.findOrCreateRoomHandler();
        }
	};


	// handles finding or creation of new room using callback provided,
	// including checking if string is valid or not
	this.findOrCreateRoomHandler = function() {
		if (HOME_CONSTANTS.searchBoxEl.classList.contains(
	    	HOME_CONSTANTS.expandedClass)) {
            var roomToSearchFor = HOME_EVENT_HANDLERS.getStorageToSearchFor();

			if (roomToSearchFor.length > 0) {
				HOME_DB.findOrCreateRoom(roomToSearchFor);
		    }
		    else 
		        HOME_EVENT_HANDLERS.displayError(
                    HOME_CONSTANTS.errorRoomLength0);
		}
    };


    this.displayError = function(errorMessage) {
        HOME_CONSTANTS.errorModalTextEl.innerHTML = errorMessage;
        HOME_CONSTANTS.errorModalEl.style.display = "block";
    };
    
    
    // trims spaces, removes single and double quotes, and returns storage name
    this.getStorageToSearchFor = function() {
        return HOME_EVENT_HANDLERS.formatString(
            HOME_CONSTANTS.inputTextEl.value.toString()).trim();
    }


	// moves the caret to the end of the input line
	this.moveCaretToEnd = function(el) { 
	    var temp = el.value;
	    el.value = '';
	    el.value = temp;
	    el.focus();
    };
    

    // formats a string to remove all single and double quotes ['"] and slashes
    this.formatString = function(text) {
        return text.replace(/['"\\\/]+/g, '');
    };
};