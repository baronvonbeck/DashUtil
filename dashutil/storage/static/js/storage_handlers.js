// storage_handlers.js - handles input events and calls storage.js methods 
// to deal with page direction and displaying messages to users
'use strict';


// keyboard, click, hover, focus, etc event handlers for the storage page
var STORAGE_EVENT_HANDLERS = new function() {

	// Method to call back to upload a new file. Takes storage page name, 
	// file uploaded, and parent directory id as parameters
    this.uploadNewFilesToDirectoryCallback = null;
    
    // Method to call back to create a new directory. Takes storage page name, 
	// file uploaded, and parent directory id as parameters
    this.createNewDirectoryCallback = null;

    // Method to call back to rename a file or file(s). Takes storage page name, 
	// a list of file ids to rename, and the new name as parameters
    this.renameFilesCallback = null;

    // Method to call back to delete a file. Takes storage page name and
    // list of file ids to delete as parameters
    this.deleteFilesCallback = null;

    // Method to call back to move files. Takes storage page name, 
    // list of file ids, and destinationId as parameters
    this.moveFilesCallback = null;

    // Method to call back to delete a file. Takes storage page name and
    // list of file ids to delete as parameters
    this.expandDirectoryCallback = null;

    this.downloadFileListCallback = null;

    this.prevClickedId = null;
    this.moveIds = null;
    
    // storage variables
    this.storagePageId = null;
    this.storagePageName = null;
    this.storagePageFields = null;


    this.handlerFunctions = null;

        
	
	// Handler to set up event listeners. 1 callback passed in from storage.js
    this.addAllEventListeners = function(newUploadNewFilesToDirectoryCallback, 
        newCreateNewDirectoryCallback, newRenameFilesCallback, 
        newDeleteFilesCallback, newExpandDirectoryCallback,
        newMoveFilesCallback, newDownloadFileListCallback) {

        this.uploadNewFilesToDirectoryCallback = 
            newUploadNewFilesToDirectoryCallback;
        this.createNewDirectoryCallback = newCreateNewDirectoryCallback;
        this.renameFilesCallback = newRenameFilesCallback;
        this.deleteFilesCallback = newDeleteFilesCallback;
        this.expandDirectoryCallback = newExpandDirectoryCallback;
        this.moveFilesCallback = newMoveFilesCallback;
        this.downloadFileListCallback = newDownloadFileListCallback;

        this.handlerFunctions = [
            STORAGE_EVENT_HANDLERS.uploadNewFilesToDirectoryHandler, 
            STORAGE_EVENT_HANDLERS.downloadFilesToDirectoryHandler,
            STORAGE_EVENT_HANDLERS.createNewDirectoryHandler,
            STORAGE_EVENT_HANDLERS.renameFilesHandler,
            STORAGE_EVENT_HANDLERS.deleteFilesHandler,
            STORAGE_EVENT_HANDLERS.moveFilesHandler
        ];

        STORAGE_CONSTANTS.buttonListEl.addEventListener(
            "click", function(event) {
                STORAGE_EVENT_HANDLERS.modalOpenButtonHandler(event);
        }, false);
        
        STORAGE_CONSTANTS.modalListEl.addEventListener(
            "click", function(event) {
                STORAGE_EVENT_HANDLERS.modalInteriorButtonHandler(event);
        }, false);
        
        // click off of modals to close, or off to side to deselect
        window.addEventListener(
            "click", function(event) {
                STORAGE_EVENT_HANDLERS.windowClickHandler(event);
        }, false);


        [STORAGE_CONSTANTS.nameSortEl, STORAGE_CONSTANTS.modifySortEl, 
         STORAGE_CONSTANTS.createSortEl, STORAGE_CONSTANTS.sizeSortEl].forEach(
            function(el) {
                el.addEventListener("click", function(event) {
                    STORAGE_EVENT_HANDLERS.changeSortOrder(this);
                }, false);
            });
    };


    this.modalOpenButtonHandler = function(e) {
        for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
            if (e.target === STORAGE_CONSTANTS.modalButtonEls[i]){
                STORAGE_CONSTANTS.modalEls[i].style.display = "block";
                e.stopPropagation();
                return;
            }
        }
    }

    this.modalInteriorButtonHandler = function(e) {
        for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
            if (e.target === STORAGE_CONSTANTS.modalCloseEls[i]){
                STORAGE_CONSTANTS.modalEls[i].style.display = "none";
                e.stopPropagation();
                return;
            }
            else if (e.target === STORAGE_CONSTANTS.modalOkEls[i]) {
                STORAGE_EVENT_HANDLERS.handlerFunctions[i]();
                e.stopPropagation();
                return;
            }
        }
    }

    this.windowClickHandler = function(e) {
        for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
            if (e.target === STORAGE_CONSTANTS.modalEls[i]){
                STORAGE_CONSTANTS.modalEls[i].style.display = "none";
                e.stopPropagation();
                return;
            }
        }

        if (!event.ctrlKey && !event.shiftKey && 
                !STORAGE_CONSTANTS.mainEl.contains(event.target)) {
            STORAGE_EVENT_HANDLERS.clearClass(
                STORAGE_CONSTANTS.selectedClass);
        }
    }
    

    this.changeSortOrder = function(newSort) {
        var previousSort = document.getElementsByClassName("sorting")[0];
        var sortType = newSort.id;
        var sortOrder = "";
        
        if (previousSort.parentElement == newSort) {
            newSort = newSort.getElementsByTagName("div")[0];
            if (newSort.classList.contains(STORAGE_CONSTANTS.sortUpClass)) {
                newSort.classList.remove(STORAGE_CONSTANTS.sortUpClass);
                newSort.classList.add(STORAGE_CONSTANTS.sortDownClass);
                sortOrder = STORAGE_CONSTANTS.sortDownClass;
            }
            else {
                newSort.classList.remove(STORAGE_CONSTANTS.sortDownClass);
                newSort.classList.add(STORAGE_CONSTANTS.sortUpClass);
                sortOrder = STORAGE_CONSTANTS.sortUpClass;
            }
        }
        else {
            newSort = newSort.getElementsByTagName("div")[0];
            previousSort.classList.remove(STORAGE_CONSTANTS.sortingClass);
            newSort.classList.add(STORAGE_CONSTANTS.sortingClass);
            if (newSort.classList.contains(STORAGE_CONSTANTS.sortUpClass)) {
                sortOrder = STORAGE_CONSTANTS.sortUpClass;
            }
            else {
                sortOrder = STORAGE_CONSTANTS.sortDownClass;
            }
        }

        FILE_MANAGER.updateSortOrder(sortType, sortOrder);
    }


    // adds click callbacks to see selected files, expand/contract directories
    this.activateSelectableElementCallbacks = function(itemId) {
        var el = document.getElementById(itemId);
        el.addEventListener(
                "click", function(event) {
        
            if (STORAGE_EVENT_HANDLERS.moveIds) {
                var destinationId = 
                    FILE_MANAGER.getIdForDirOrParentIdForFile(this.id);
                    var fileIdsToMove = STORAGE_EVENT_HANDLERS.moveIds;
                
                if (FILE_MANAGER.destinationIsAChildOfFilesToMove(
                    destinationId, fileIdsToMove)) {
                        console.log("Can not move a file to itself or one of its children.");
                        console.log("Please choose another directory to move the file to.");
                        return;
                }

                var storagePageName = 
                    STORAGE_EVENT_HANDLERS.getStoragePageName();
                
                STORAGE_EVENT_HANDLERS.moveIds = null;
                
                STORAGE_EVENT_HANDLERS.moveFilesCallback(storagePageName, 
                    fileIdsToMove, destinationId);
                
                return;
            }

            if (event.ctrlKey) {
                this.classList.toggle(STORAGE_CONSTANTS.selectedClass);
               
            }
            else if (event.shiftKey && STORAGE_EVENT_HANDLERS.prevClickedId) {

                var allFiles = STORAGE_CONSTANTS.fileListEl.innerHTML.toString();
                var startEl = document.getElementById(
                    STORAGE_EVENT_HANDLERS.prevClickedId);
                var endEl = this;
               
                if (allFiles.indexOf("\"" + endEl.id + "\"") > allFiles.indexOf(
                        "\"" + startEl.id + "\"")) {
                    endEl = startEl;
                    startEl = this;
                }
               
                STORAGE_EVENT_HANDLERS.clearClass(
                    STORAGE_CONSTANTS.selectedClass);
                startEl.classList.add(STORAGE_CONSTANTS.selectedClass);
                if (startEl.id == endEl.id) return;
               
                endEl.classList.add(STORAGE_CONSTANTS.selectedClass);
               
                allFiles = allFiles.substring(
                    allFiles.indexOf("\"" + startEl.id + "\"") + startEl.id.length + 1,
                    allFiles.indexOf("\"" + endEl.id + "\"") - 1);
               
                var elIdsToSelect =
                    STORAGE_EVENT_HANDLERS.parseElementIdsFromString(allFiles);
                    
                for (var i = 0; i < elIdsToSelect.length; i ++) {
                    document.getElementById(elIdsToSelect[i]).classList.add(
                        STORAGE_CONSTANTS.selectedClass);
                } 
                
            }
            else {
                STORAGE_EVENT_HANDLERS.clearClass(
                    STORAGE_CONSTANTS.selectedClass);
                this.classList.add(STORAGE_CONSTANTS.selectedClass);
               
                if (FILE_MANAGER.checkIfFileIsDirectory(this.id)) {
                    var directoryFileList = document.getElementById(
                        this.id + STORAGE_CONSTANTS.ulIDAppend);
 
                    if (directoryFileList.style.display === "none") {
                        directoryFileList.style.display = "block";
                        STORAGE_EVENT_HANDLERS.expandDirectoryCallback(
                            STORAGE_EVENT_HANDLERS.getStoragePageName(),
                            this.id);
                       
                        this.getElementsByTagName("img")[0].src =
                            STORAGE_CONSTANTS.directoryOpenLightIcon;
                    }
                    else {
                        directoryFileList.style.display = "none";
 
                        this.getElementsByTagName("img")[0].src =
                            STORAGE_CONSTANTS.directoryCloseLightIcon;
                    }
                }
            } 

            STORAGE_EVENT_HANDLERS.prevClickedId = this.id;

        }, false);

        STORAGE_EVENT_HANDLERS.addDragEventHandlers(el);
    };


    this.addDragEventHandlers = function(el) {

        el.addEventListener("dragstart", function(event) {
            this.classList.add(STORAGE_CONSTANTS.draggingClass);
            this.classList.add(STORAGE_CONSTANTS.selectedClass);

            var selectedEls = document.getElementsByClassName(
                STORAGE_CONSTANTS.selectedClass);

            for (var i = 0; i < selectedEls.length; i ++) {
                selectedEls[i].classList.add(
                    STORAGE_CONSTANTS.draggingClass);
            }
        }, false);
        el.addEventListener("drag", function(event) {

        }, false);
        // el.addEventListener("drag", function(event) {

        // }, false);
        el.addEventListener("dragend", function(event) {
            this.classList.remove(STORAGE_CONSTANTS.draggingClass);

            STORAGE_EVENT_HANDLERS.clearClass(
                STORAGE_CONSTANTS.draggingClass);
            STORAGE_EVENT_HANDLERS.clearClass(
                STORAGE_CONSTANTS.dragToClass);
        }, false);

        el.addEventListener("dragenter", function(event) {
            // var prevDragTo = document.getElementsByClassName(
            //     STORAGE_CONSTANTS.dragToClass);
            
            // if (prevDragTo.length)    
            //     prevDragTo[0].classList.remove(STORAGE_CONSTANTS.dragToClass);

            STORAGE_EVENT_HANDLERS.clearClass(
                STORAGE_CONSTANTS.dragToClass);

            this.classList.add(STORAGE_CONSTANTS.dragToClass);
            console.log('here');

        }, false);
        
        el.addEventListener("dragover", function(event) {
            event.preventDefault();
        }, false);

        el.addEventListener("drop", function(event) {
            console.log(event.target.id);
        }, false);
        
        
    }
    
    
    // handles uploading of the file to the storage room or a subdirectory
    // using the callback provided
	this.uploadNewFilesToDirectoryHandler = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
        var filesToUpload = STORAGE_CONSTANTS.uploadFieldEl.files;
        var parentDirectoryId = 
            STORAGE_EVENT_HANDLERS.getParentDirectoriesForAction();

        if (filesToUpload.length > 0 && parentDirectoryId.length == 1) {
            STORAGE_EVENT_HANDLERS.uploadNewFilesToDirectoryCallback(
                storagePageName, filesToUpload, parentDirectoryId[0]);

            STORAGE_CONSTANTS.uploadFieldEl.value = '';
        }
        STORAGE_CONSTANTS.uploadModalEl.style.display = "none";
    };


    // handles downloading of files
	this.downloadFilesToDirectoryHandler = function() {
        var fileIdsToDownload = 
            STORAGE_EVENT_HANDLERS.getIdsOfElementsByClassName(
                STORAGE_CONSTANTS.selectedClass);
        fileIdsToDownload = 
            FILE_MANAGER.removeRedundantFiles(fileIdsToDownload);

        if (fileIdsToDownload.length == 1 && 
                !FILE_MANAGER.checkIfFileIsDirectory(fileIdsToDownload[0])) {
            FILE_MANAGER.downloadFile(fileIdsToDownload[0]);
        }
        else if (fileIdsToDownload.length > 0) {
            STORAGE_EVENT_HANDLERS.downloadFileListCallback(
                STORAGE_EVENT_HANDLERS.getStoragePageName(), 
                fileIdsToDownload);
        }
        else {
            console.log("must have 1 or more files selected to download");
        }

        STORAGE_CONSTANTS.downloadModalEl.style.display = "none";
    };


    // creates a new directory
    this.createNewDirectoryHandler = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
        var newDirectoryName = STORAGE_EVENT_HANDLERS.unicodeToChar(
            STORAGE_EVENT_HANDLERS.formatString(
                STORAGE_CONSTANTS.directoryTextEl.value));
        var parentDirectoryId = 
            STORAGE_EVENT_HANDLERS.getParentDirectoriesForAction();

        if (newDirectoryName.length > 0 && parentDirectoryId.length == 1) {
            STORAGE_EVENT_HANDLERS.createNewDirectoryCallback(
                storagePageName, newDirectoryName, parentDirectoryId[0]);
        }
        else {
            console.log("Directory must have name length greater than 0");
            console.log("Please select only 1 parent to create a new directory in");
        }

        STORAGE_CONSTANTS.directoryModalEl.style.display = "none";
    };


    // renames a selected file or list of files
    this.renameFilesHandler = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
        var renameName = STORAGE_EVENT_HANDLERS.unicodeToChar(
            STORAGE_EVENT_HANDLERS.formatString(
                STORAGE_CONSTANTS.renameTextEl.value));
        var fileIdsToRename = STORAGE_EVENT_HANDLERS.getIdsOfElementsByClassName(
            STORAGE_CONSTANTS.selectedClass);

        if (renameName.length > 0 && fileIdsToRename.length > 0) {
            STORAGE_EVENT_HANDLERS.renameFilesCallback(
                storagePageName, fileIdsToRename, renameName);
        }
        else {
            console.log("No files selected or length of new name is less than 0!");
            // error
            // say that files renamed must be > length 0
            // and that 1 or more files must be selected
        }

        STORAGE_CONSTANTS.renameModalEl.style.display = "none";
    };

    
    // renames a selected file or list of files
    this.deleteFilesHandler = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
        var fileIdsToDelete = STORAGE_EVENT_HANDLERS.getIdsOfElementsByClassName(
            STORAGE_CONSTANTS.selectedClass);
        fileIdsToDelete = FILE_MANAGER.removeRedundantFiles(
            fileIdsToDelete);

        if (fileIdsToDelete.length > 0) {
            STORAGE_EVENT_HANDLERS.deleteFilesCallback(
                storagePageName, fileIdsToDelete);
        }
        else {
            console.log("No files selected!");
            // error
            // say that files renamed must be > length 0
            // and that 1 or more files must be selected
        }

        STORAGE_CONSTANTS.deleteModalEl.style.display = "none";
    };


    // moves a selected file or list of files
    this.moveFilesHandler = function() {
        var fileIdsToMove = STORAGE_EVENT_HANDLERS.getIdsOfElementsByClassName(STORAGE_CONSTANTS.selectedClass);
        fileIdsToMove = FILE_MANAGER.removeRedundantFiles(
            fileIdsToMove);
            
        if (fileIdsToMove.length > 0) {
            STORAGE_EVENT_HANDLERS.moveIds = fileIdsToMove;
        }
        else {
            console.log("No files selected!");
            // error 1 or more files must be selected
        }
        STORAGE_CONSTANTS.moveModalEl.style.display = "none";
    };


    this.parseElementIdsFromString = function(s) {
        var elIds = [];
        var liStr = "<li id=\"";
        var ind;
       
        while ((ind = s.indexOf(liStr)) > 0) {
            s = s.substring(ind + liStr.length, s.length);
            elIds.push(s.substring(0, s.indexOf("\"")).replace(
                STORAGE_CONSTANTS.liIDAppend, ""));
          }
       
        return elIds;
    }


    // returns the parent directories an action corresponds too, based on 
    // current selected ids of clicked elements
    this.getParentDirectoriesForAction = function() {
        var idClickedList = STORAGE_EVENT_HANDLERS.getIdsOfElementsByClassName(
            STORAGE_CONSTANTS.selectedClass);

        if (idClickedList.length == 0) {
            return [STORAGE_EVENT_HANDLERS.getStoragePageId()];
        }

        for (var i = 0; i < idClickedList.length; i ++) {
            idClickedList[i] = 
                FILE_MANAGER.getIdForDirOrParentIdForFile(idClickedList[i]);
        }
        
        return idClickedList;
    };


    // gets the id(s) of clicked elements
    this.getIdsOfElementsByClassName = function(c) {
        var htmlList = document.getElementsByClassName(
            STORAGE_CONSTANTS.fileClass + " " + c);

        var idList = [];

        for (var i = 0; i < htmlList.length; i ++) {
            idList.push(htmlList[i].id);
        }

        return idList;
    };


    this.clearClass = function(c) {
        var ids = STORAGE_EVENT_HANDLERS.getIdsOfElementsByClassName(c);
        for (var i = 0; i < ids.length; i ++)
            document.getElementById(ids[i]).classList.remove(c);
    }


    // returns the storage page id, formatted to remove all single and 
    // double quotes ['"]
    this.getStoragePageId = function() {
        if (this.storagePageId == null) {
            this.storagePageId = STORAGE_EVENT_HANDLERS.getJsonFromDataString(
                storagePage.textContent).pk;
        }
        
        return this.storagePageId;
    };


    // returns the name of the storage, with unicode converted to characters
    // and formatted to remove all single and double quotes ['"]
    this.getStoragePageName = function() {
        if (this.storagePageName == null) {
            this.storagePageName = 
                STORAGE_EVENT_HANDLERS.getStoragePageFields().filename;
        }
        
        return this.storagePageName;
    };


    // returns all of the fields of the storage, with unicode converted to
    // characters and formatted to remove all single and double quotes ['"]
    this.getStoragePageFields = function() {
        if (this.storagePageFields == null) {
            this.storagePageFields = STORAGE_EVENT_HANDLERS.getJsonFromDataString(
                storagePage.textContent).fields;
        }
        
        return this.storagePageFields;
    };


    // https://icons8.com/icons/set/closed-folder
    this.getFileIcon = function(fileExtension) {
        var pathToIcon = "";
        switch(fileExtension) {
            case "":
                pathToIcon = STORAGE_CONSTANTS.directoryCloseLightIcon;
                break;
            default:
                pathToIcon = STORAGE_CONSTANTS.genericFileLightIcon;
        }
        return pathToIcon;
    }

    
    // formats a string to remove all single and double quotes ['"]
    this.formatString = function(text) {
        return text.replace(/['"]+/g, '');
    };


    // converts unicode to characters
    this.unicodeToChar = function(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    };


    // parses string into json data
    this.getJsonFromDataString = function(dataString) {
        return JSON.parse(STORAGE_EVENT_HANDLERS.unicodeToChar(
            dataString.replace('\'upload_path\': None', 
                    '\'upload_path\': null').replace(/[']+/g, '"')
                ));
    };
};