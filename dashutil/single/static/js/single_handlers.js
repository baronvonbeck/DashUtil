// single_handlers.js - handles input events and calls single.js methods 
// to deal with page direction and displaying messages to users
'use strict';


// keyboard, click, hover, focus, etc event handlers for the storage page
var SINGLE_EVENT_HANDLERS = new function() {

    this.numFunctions = SINGLE_CONSTANTS.numFunctions;


    // handles uploading of the file to the storage room or a subdirectory
    // using the callback provided
	this.addFileToSinglePage = function(fileToAdd) {
        if (fileToAdd == null || fileToAdd == undefined) {
            this.numFunctions -= 1;
            return;
        }
        var fields = fileToAdd.fields;
        SINGLE_CONSTANTS.fileHolderEl.innerHTML = 
            SINGLE_EVENT_HANDLERS.getHTMLRepresentation(fileToAdd.pk, 
                fields.filename, fields.create_timestamp, 
                fields.modify_timestamp, fields.size, fields.upload_path);
    };

    this.handlerFunctions = null;  
    this.menuHandlerFunctions = null;
	
	// Handler to set up event listeners
    this.addAllEventListeners = function() {

        this.handlerFunctions = [
            SINGLE_EVENT_HANDLERS.uploadNewFilesToDirectoryHandler, 
            SINGLE_EVENT_HANDLERS.downloadFilesHandler
        ];

        this.menuHandlerFunctions = [
            function(i) {SINGLE_CONSTANTS.modalEls[i].style.display = "block";},
            function(i) {SINGLE_EVENT_HANDLERS.handlerFunctions[i]();}
        ];

        NAVBAR_EVENT_HANDLERS.addNavbarEventListeners();

        NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
            "click", function(e) { 
                SINGLE_EVENT_HANDLERS.switchThemesForIcons(); 
            }, false);

        NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
            "keydown", function(e) { 
                var keycode = e.key.toLowerCase();

                if (keycode == "enter") {
                    e.preventDefault();
                    SINGLE_EVENT_HANDLERS.switchThemesForIcons();
                }
            }, false);

	    // click off of modals to close, or off to side to deselect
        window.addEventListener(
            "click", function(event) {
                if (SINGLE_CONSTANTS.errorModalEl.style.display == "block" && 
                        event.target == SINGLE_CONSTANTS.errorModalEl) {
                    SINGLE_CONSTANTS.errorModalEl.style.display = "none";
                    return;
                }
                else if (SINGLE_CONSTANTS.progressModalEl.style.display == "block" && 
                        event.target == SINGLE_CONSTANTS.progressModalEl) {
                    SINGLE_CONSTANTS.progressModalEl.style.display = "none";
                    return;
                }
                else if (SINGLE_CONSTANTS.uploadModalEl.style.display == "block" && 
                        event.target == SINGLE_CONSTANTS.uploadModalEl) {
                    SINGLE_CONSTANTS.uploadModalEl.style.display = "none";
                    return;
                }
            }, false);

        
        SINGLE_CONSTANTS.fileHolderEl.addEventListener(
            "contextmenu", function(event) {
                event.preventDefault();
                SINGLE_CONSTANTS.menuEl.style.display = "block";
                SINGLE_CONSTANTS.menuEl.style.top = event.pageY + "px";
                SINGLE_CONSTANTS.menuEl.style.left = event.pageX + "px";
            }, false);
            SINGLE_CONSTANTS.menuEl.addEventListener(
            "click", function(event) {
                event.stopPropagation();
                SINGLE_CONSTANTS.contextMenuHandler(event);
            }, false);

        window.addEventListener(
            "keydown", function(event) {
                if (event.keyCode === 13) {
                    if (SINGLE_CONSTANTS.progressModalEl.style.display == "block") {
                        event.preventDefault();
                        event.stopPropagation();
                        SINGLE_CONSTANTS.progressModalEl.style.display = "none";
                        return;
                    }
                    else if (SINGLE_CONSTANTS.errorModalEl.style.display == "block") {
                        SINGLE_CONSTANTS.errorModalEl.style.display = "none";
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                    }
                    for (var i = 0; i < SINGLE_EVENT_HANDLERS.numFunctions; i ++) {
                        if (SINGLE_CONSTANTS.modalEls[i].style.display == "block") {
                            if (i == 0 && 
                                    event.target != SINGLE_CONSTANTS.uploadFileFieldEl && 
                                    event.target != SINGLE_CONSTANTS.uploadCloseButtonEl) {
                                event.preventDefault();
                                event.stopPropagation();
                                SINGLE_EVENT_HANDLERS.handlerFunctions[i]();
                            }
                            else if (i == 1 && event.target != SINGLE_CONSTANTS.downloadCloseButtonEl) {
                                event.preventDefault();
                                event.stopPropagation();
                                SINGLE_EVENT_HANDLERS.handlerFunctions[i]();
                            }
                                
                            return;
                        }
                    }
                }
                else if (event.keyCode === 27) {
                    if (SINGLE_CONSTANTS.menuEl.style.display == "block") {
                        SINGLE_CONSTANTS.menuEl.style.display = "none";
                        return;
                    }
                    else if (SINGLE_CONSTANTS.progressModalEl.style.display == "block") {
                        SINGLE_CONSTANTS.progressModalEl.style.display = "none";
                        return;
                    }
                    else if (SINGLE_CONSTANTS.errorModalEl.style.display == "block") {
                        SINGLE_CONSTANTS.errorModalEl.style.display = "none";
                        return;
                    }
                    for (var i = 0; i < SINGLE_EVENT_HANDLERS.numFunctions; i ++) {
                        if (SINGLE_CONSTANTS.modalEls[i].style.display == "block") {
                            SINGLE_CONSTANTS.modalEls[i].style.display = "none";
                            return;
                        }
                    }
                }
                
            }, false);


        SINGLE_CONSTANTS.errorOkButtonEl.addEventListener(
            "click", function(event) {
                event.stopPropagation();
                SINGLE_CONSTANTS.errorModalEl.style.display = "none";              
            }, false);
        
        SINGLE_CONSTANTS.progressOkButtonEl.addEventListener(
            "click", function(event) {
                event.stopPropagation();
                SINGLE_CONSTANTS.progressModalEl.style.display = "none";              
            }, false);
        

        SINGLE_CONSTANTS.openUploadModalEl.addEventListener(
            "click", function(event) {
                event.stopPropagation();
                SINGLE_CONSTANTS.uploadModalEl.style.display = "block";
            }, false);
        SINGLE_CONSTANTS.uploadCloseButtonEl.addEventListener(
            "click", function(event) {
                event.stopPropagation();
                SINGLE_CONSTANTS.uploadModalEl.style.display = "none";
            }, false);
        SINGLE_CONSTANTS.uploadFileButtonEl.addEventListener(
            "click", function(event) {
                event.stopPropagation();

                SINGLE_EVENT_HANDLERS.uploadFileToSingleHandler(
                    SINGLE_CONSTANTS.uploadFileFieldEl.files);
            }, false);

        window.addEventListener("dragenter", function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, false);
        window.addEventListener("dragover", function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, false);
        window.addEventListener("drop", function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!e.dataTransfer.items[0].webkitGetAsEntry().isDirectory) {
                SINGLE_EVENT_HANDLERS.uploadFileToSingleHandler(e.dataTransfer.files);
            }
            else {
                SINGLE_EVENT_HANDLERS.displayError(
                    SINGLE_CONSTANTS.errorUpload1File);
            }
            
        }, false);
    };


    this.contextMenuHandler = function(e) {
        for (var i = 0; i < SINGLE_EVENT_HANDLERS.numFunctions; i ++) {
            if (e.target === SINGLE_CONSTANTS.menuEls[i] || 
                e.target.parentNode === SINGLE_CONSTANTS.menuEls[i]) {
                SINGLE_CONSTANTS.menuEl.style.display = "none";
                SINGLE_EVENT_HANDLERS.menuHandlerFunctions[i](i);
                return;
            }
        }
    };
    
    
    // handles uploading of the file to the storage room or a subdirectory
    // using the callback provided
	this.uploadFileToSingleHandler = function(files) {
        if (files.length == 1) {
            SINGLE_DB.uploadFileToSingle(files[0]);

            SINGLE_CONSTANTS.uploadModalEl.style.display = "none";

            SINGLE_CONSTANTS.openProgressModalHandler(
                SINGLE_CONSTANTS.uploadInProgressMessage);
        }
        else {
            SINGLE_EVENT_HANDLERS.displayError(
                SINGLE_CONSTANTS.errorUpload1File);
        }
    };

    this.switchThemesForIcons = function() {
        var useDark = (NAVBAR_THEME_CONTROLLER.currentTheme == 
            NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_DARK);

        for (var i = 0; i < SINGLE_EVENT_HANDLERS.numFunctions; i ++) {
            SINGLE_CONSTANTS.menuEls[i].getElementsByTagName("img")[0].src = 
                ( useDark ? 
                    SINGLE_CONSTANTS.menuDarkIcons[i] :
                    SINGLE_CONSTANTS.menuLightIcons[i]);
        }

        var allFiles = SINGLE_CONSTANTS.fileListEl.getElementsByClassName(
            SINGLE_CONSTANTS.fileClass);
        
        for (var i = 0; i < allFiles.length; i ++) {
            var fileExtension = FILE_MANAGER.getFileExtension(allFiles[i].id);

            allFiles[i].getElementsByTagName("img")[0].src = 
                STORAGE_EVENT_HANDLERS.getFileIcon(fileExtension, useDark);
        }
    };


    this.displayError = function(errorMessage) {
        SINGLE_CONSTANTS.errorModalTextEl.innerHTML = errorMessage;
        SINGLE_CONSTANTS.errorModalEl.style.display = "block";
    };

    
    // formats a string to remove all single and double quotes ['"] and slashes
    this.formatString = function(text) {
        return text.replace(/['"\\\/]+/g, '');
    };


    // converts unicode to characters
    this.unicodeToChar = function(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    };


    // parses string into json data
    this.getJsonFromDataString = function(dataString) {
        return JSON.parse(SINGLE_EVENT_HANDLERS.unicodeToChar(
            dataString.replace('\'upload_path\': None', 
                    '\'upload_path\': null').replace(/[']+/g, '"')
                ));
    };


    // updates the HTML representations of the object
    this.getHTMLRepresentation = function(id, filename, 
        createTimestamp, modifyTimestamp, size, uploadPath) {
        var fileTypeRepresentation = "";
        var column1_filename_path = "";
        var column2_modifyTimestamp = "";
        var column3_createTimestamp = "";
        var column4_size = "";
        var classString = "";
        var useDark = (NAVBAR_THEME_CONTROLLER.currentTheme == 
            NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_DARK );

        classString += SINGLE_CONSTANTS.fileClass;

        if (uploadPath != null) {
            column1_filename_path = "<div class=\"file-info-name\"><a href=" + 
                uploadPath + " target=\"_blank\">" + 
                filename + "</a></div>";

            fileTypeRepresentation = "<img class=\"fileico\"src=\"" + 
                SINGLE_EVENT_HANDLERS.getFileIcon(
                    filename.split("\.").pop(), useDark) + "\">";
        }

        column2_modifyTimestamp = "<div class=\"file-info-date\">" + 
            SINGLE_EVENT_HANDLERS.formatDateToString(new Date(modifyTimestamp)) + "</div>";
        column3_createTimestamp = "<div class=\"file-info-date\">" + 
            SINGLE_EVENT_HANDLERS.formatDateToString(new Date(createTimestamp)) + "</div>";
        column4_size = "<div class=\"file-info-size\">" + 
            SINGLE_EVENT_HANDLERS.formatFileSizeToString(size) + "</div>";

        var infoHtmlRepresentation = "<div class=\"file-info-left\">" + 
            column1_filename_path + "</div><div class=\"file-info-right\">" +
            column2_modifyTimestamp + column3_createTimestamp + column4_size +
            "</div>";

            //"<li id=\"" + id + 
            //SINGLE_CONSTANTS.liIDAppend + "\">

        return "<div id=\"" + id + 
            "\" class=\"" + classString + "\">" + fileTypeRepresentation + 
            "<div id=\"" + id + SINGLE_CONSTANTS.infoIDAppend + 
            "\" class=\"file-info-container\">" + 
            infoHtmlRepresentation + "</div></div>"; // + directoryAddUL + "</li>";        
    };


    // https://icons8.com/icons/set/closed-folder
    this.getFileIcon = function(fileExtension, useDark) {
        var pathToIcon = "";
        
        switch(fileExtension) {
            case "":
                pathToIcon = ( useDark ? 
                    SINGLE_CONSTANTS.directoryCloseDarkIcon :
                    SINGLE_CONSTANTS.directoryCloseLightIcon);
                break;
            default:
                pathToIcon = ( useDark ? 
                    SINGLE_CONSTANTS.genericFileDarkIcon :
                    SINGLE_CONSTANTS.genericFileLightIcon);
        }
        return pathToIcon;
    };


    // formats a date object to a string
    // courtesy of https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site/23259289#23259289
    this.formatDateToString = function(date) {        
        var seconds = Math.floor((new Date() - date) / 1000);
        var temp;
        var intervalString = "";

        // return this.formatFullDate(date);

        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return this.formatFullDate(date);
        } 
        else {
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                intervalString += interval + " month";
                if (interval > 1) intervalString += "s";
                
                temp = Math.floor((seconds - (interval * 2592000)) / 86400);

                intervalString += ", " + temp + " day";
                if (temp != 1) intervalString += "s";
            } 
            else {
                interval = Math.floor(seconds / 86400);
                if (interval >= 1) {
                    intervalString += interval + " day";
                    if (interval > 1) intervalString += "s";

                    temp = Math.floor((seconds - (interval * 86400)) / 3600);
                    
                    intervalString += ", " + temp + " hour";
                    if (temp != 1) intervalString += "s";
                } 
                else {
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1) {
                        intervalString += interval + " hour";
                        if (interval > 1) intervalString += "s";

                        temp = Math.floor((seconds - (interval * 3600)) / 60);
                        
                        intervalString += ", " + temp + " minute";
                        if (temp != 1) intervalString += "s";
                    } 
                    else {
                        interval = Math.floor(seconds / 60);
                        if (interval >= 1) {
                            intervalString += interval + " minute";
                            if (interval > 1) intervalString += "s";

                            temp = (seconds - (interval * 60));
                            
                            intervalString += ", " + (seconds % 60) + " second";
                            if (temp != 1) intervalString += "s";
                        } 
                        else {
                            intervalString += seconds + " second";
                            if (seconds != 1) intervalString += "s";
                        }
                    }
                }
            }
        }

        return intervalString;
    };


    this.formatFullDate = function(date) {
        // var time = "";
        // var mins = String(date.getMinutes());
        // var hours = "";
        // if (date.getMinutes() < 10)
        //     mins = "0" + mins;

        // if (date.getHours() - 12 > 0)
        //     hours = String(date.getHours() - 12);
        // else 
        //     hours = String((date.getHours() == 0 ? "12" : date.getHours()));

        // if (date.getHours() < 12) time = " AM";
        // else time = " PM";

        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + 
            date.getFullYear();
            
            // + " " + hours + ":" + mins + 
            // "." + date.getMilliseconds() + time;
    };


    // converts file size to a human readable format. si determines 
    // whether or not to use si standard, default false
    this.formatFileSizeToString = function(bytes, si=false) {
        var thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + '&nbsp;&nbsp;&nbsp;B';
        }
        var units = si
            ? ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB']
            : ['KB','MB','GB','TB','PB','EB','ZB','YB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++ u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(2) + ' ' + units[u];
    }
};