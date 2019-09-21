// storage_handlers.js - handles input events and calls storage.js methods 
// to deal with page direction and displaying messages to users
'use strict';


// keyboard, click, hover, focus, etc event handlers for the storage page
var STORAGE_EVENT_HANDLERS = new function() {

    this.prevClickedId = null;
    this.moveIds = null;
    
    // storage variables
    this.storagePageId = null;
    this.storagePageName = null;
    this.storagePageFields = null;

    this.handlerFunctions = null;  
    this.menuHandlerFunctions = null;
	
	// Handler to set up event listeners
    this.addAllEventListeners = function() {

        this.handlerFunctions = [
            STORAGE_EVENT_HANDLERS.uploadNewFilesToDirectoryHandler, 
            STORAGE_EVENT_HANDLERS.uploadDirectoryWrapper,
            STORAGE_EVENT_HANDLERS.downloadFilesHandler,
            STORAGE_EVENT_HANDLERS.createNewDirectoryHandler,
            STORAGE_EVENT_HANDLERS.renameFilesHandler,
            STORAGE_EVENT_HANDLERS.deleteFilesHandler,
            STORAGE_EVENT_HANDLERS.moveFilesHandlerInit
        ];

        this.menuHandlerFunctions = [
            function(i) {STORAGE_CONSTANTS.modalEls[i].style.display = "block";},
            function(i) {STORAGE_CONSTANTS.modalEls[i].style.display = "block";},
            function(i) {STORAGE_EVENT_HANDLERS.handlerFunctions[i]();},
            function(i) {STORAGE_CONSTANTS.modalEls[i].style.display = "block";},
            function(i) {STORAGE_CONSTANTS.modalEls[i].style.display = "block";},
            function(i) {STORAGE_EVENT_HANDLERS.handlerFunctions[i]();},
            function(i) {STORAGE_CONSTANTS.modalEls[i].style.display = "block";}
        ];

        NAVBAR_EVENT_HANDLERS.addNavbarEventListeners();

        NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
            "click", function(e) { 
                STORAGE_EVENT_HANDLERS.switchThemesForIcons(); 
            }, false);

        NAVBAR_CONSTANTS.themeTogglerEl.addEventListener(
            "keydown", function(e) { 
                var keycode = e.key.toLowerCase();

                if (keycode == "enter") {
                    e.preventDefault();
                    STORAGE_EVENT_HANDLERS.switchThemesForIcons();
                }
            }, false);


        STORAGE_CONSTANTS.buttonListEl.addEventListener(
            "click", function(event) {
                STORAGE_CONSTANTS.menuEl.style.display = "none";
                STORAGE_EVENT_HANDLERS.modalOpenButtonHandler(event);
            }, false);
        
        STORAGE_CONSTANTS.modalListEl.addEventListener(
            "click", function(event) {
                STORAGE_EVENT_HANDLERS.modalInteriorButtonHandler(event);
            }, false);
        
        STORAGE_CONSTANTS.progressOkButtonEl.addEventListener(
            "click", function(event) {
                STORAGE_EVENT_HANDLERS.closeProgressModalHandler();
            }, false);
    

        window.addEventListener(
            "keydown", function(event) {
                if (event.keyCode === 13) {
                    if (STORAGE_CONSTANTS.progressModalEl.style.display == "block") {
                        event.preventDefault();
                        event.stopPropagation();
                        STORAGE_CONSTANTS.progressModalEl.style.display = "none";
                        return;
                    }
                    else if (STORAGE_CONSTANTS.errorModalEl.style.display == "block") {
                        STORAGE_CONSTANTS.errorModalEl.style.display = "none";
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                    }
                    for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
                        if (STORAGE_CONSTANTS.modalEls[i].style.display == "block") {
                            if ((i == 0 || i == 1) && 
                                    event.target != STORAGE_CONSTANTS.uploadFileFieldEl && 
                                    event.target != STORAGE_CONSTANTS.uploadCloseButtonEl && 
                                    event.target != STORAGE_CONSTANTS.uploadDirButtonEl && 
                                    event.target != STORAGE_CONSTANTS.uploadDirFieldEl) {
                                event.preventDefault();
                                event.stopPropagation();
                                STORAGE_EVENT_HANDLERS.handlerFunctions[i]();
                            }
                            else if (i > 1) {
                                event.preventDefault();
                                event.stopPropagation();
                                STORAGE_EVENT_HANDLERS.handlerFunctions[i]();
                            }
                                
                            
                            return;
                        }
                    }
                }
                else if (event.keyCode === 27) {
                    if (STORAGE_CONSTANTS.menuEl.style.display == "block") {
                        STORAGE_CONSTANTS.menuEl.style.display = "none";
                        return;
                    }
                    else if (STORAGE_CONSTANTS.progressModalEl.style.display == "block") {
                        STORAGE_CONSTANTS.progressModalEl.style.display = "none";
                        return;
                    }
                    else if (STORAGE_CONSTANTS.errorModalEl.style.display == "block") {
                        STORAGE_CONSTANTS.errorModalEl.style.display = "none";
                        return;
                    }
                    for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
                        if (STORAGE_CONSTANTS.modalEls[i].style.display == "block") {
                            STORAGE_CONSTANTS.modalEls[i].style.display = "none";
                            return;
                        }
                    }
                }
                else if (event.keyCode === 46) {
                    if (STORAGE_CONSTANTS.menuEl.style.display == "block" ||
                        STORAGE_CONSTANTS.progressModalEl.style.display == "block" ||
                        STORAGE_CONSTANTS.errorModalEl.style.display == "block") {
                        return;
                    }
                    for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
                        if (STORAGE_CONSTANTS.modalEls[i].style.display == "block")
                            return;
                    }
                    STORAGE_EVENT_HANDLERS.deleteFilesHandler();
                }
                
            }, false);
        
        // click off of modals to close, or off to side to deselect
        window.addEventListener(
            "click", function(event) {
                STORAGE_CONSTANTS.menuEl.style.display = "none";
                if (STORAGE_CONSTANTS.errorModalEl.style.display == "block" && 
                        event.target == STORAGE_CONSTANTS.errorModalEl) {
                    STORAGE_CONSTANTS.errorModalEl.style.display = "none";
                    return;
                }
                else if (STORAGE_CONSTANTS.progressModalEl.style.display == "block" && 
                        event.target == STORAGE_CONSTANTS.progressModalEl) {
                    STORAGE_CONSTANTS.progressModalEl.style.display = "none";
                    return;
                }
                
                STORAGE_EVENT_HANDLERS.windowClickHandler(event);
            }, false);

        STORAGE_CONSTANTS.fileListEl.addEventListener(
            "click", function(event) {
                STORAGE_CONSTANTS.menuEl.style.display = "none";
                var el = STORAGE_EVENT_HANDLERS.traverseUpDOMToFileElement(
                    event.target, this);
                var moveId = el.id;
                if (el == undefined) return;
                else if (el == this)
                    moveId = STORAGE_EVENT_HANDLERS.getStoragePageId();

                STORAGE_EVENT_HANDLERS.fileClickHandler(el, moveId, 
                    event.ctrlKey, event.shiftKey);
                event.stopPropagation();
            }, false);

        STORAGE_CONSTANTS.fileListEl.addEventListener(
            "contextmenu", function(event) {
                event.preventDefault();
                STORAGE_CONSTANTS.menuEl.style.display = "block";
                STORAGE_CONSTANTS.menuEl.style.top = event.pageY + "px";
                STORAGE_CONSTANTS.menuEl.style.left = event.pageX + "px";
            }, false);
        
        STORAGE_CONSTANTS.menuEl.addEventListener(
            "click", function(event) {
                event.stopPropagation();
                STORAGE_EVENT_HANDLERS.contextMenuHandler(event);
            }, false);

        
        
        STORAGE_EVENT_HANDLERS.addDragEventHandlers();


        [STORAGE_CONSTANTS.nameSortEl, STORAGE_CONSTANTS.modifySortEl, 
         STORAGE_CONSTANTS.createSortEl, STORAGE_CONSTANTS.sizeSortEl].forEach(
            function(el) {
                el.addEventListener("click", function(event) {
                    STORAGE_EVENT_HANDLERS.changeSortOrder(this);
                }, false);
            }
        );

        STORAGE_CONSTANTS.errorOkButtonEl.addEventListener(
            "click", function(event) {
                event.stopPropagation();
                STORAGE_CONSTANTS.errorModalEl.style.display = "none";
            }, false);

        STORAGE_EVENT_HANDLERS.switchThemesForIcons();
    };


    this.modalOpenButtonHandler = function(e) {
        for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
            if (e.target === STORAGE_CONSTANTS.modalButtonEls[i]){
                STORAGE_CONSTANTS.modalEls[i].style.display = "block";
                e.stopPropagation();
                return;
            }
        }
    };

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
    };

    this.windowClickHandler = function(e) {
        for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
            if (e.target === STORAGE_CONSTANTS.modalEls[i]){
                STORAGE_CONSTANTS.modalEls[i].style.display = "none";
                e.stopPropagation();
                return;
            }
        }

        if (!e.ctrlKey && !e.shiftKey && 
                !STORAGE_CONSTANTS.mainEl.contains(e.target)) {
            STORAGE_EVENT_HANDLERS.clearClass(
                STORAGE_CONSTANTS.selectedClass);
            STORAGE_EVENT_HANDLERS.moveIds = null;
        }
    };

    
    this.contextMenuHandler = function(e) {
        for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
            if (e.target === STORAGE_CONSTANTS.menuEls[i] || 
                e.target.parentNode === STORAGE_CONSTANTS.menuEls[i]) {
                STORAGE_CONSTANTS.menuEl.style.display = "none";
                STORAGE_EVENT_HANDLERS.menuHandlerFunctions[i](i);
                return;
            }
        }
    };

    this.buttonDropHandler = function(e) {
        for (var i = 0; i < STORAGE_CONSTANTS.numFunctions; i ++) {
            if (e.target === STORAGE_CONSTANTS.modalButtonEls[i]) {
                STORAGE_EVENT_HANDLERS.menuHandlerFunctions[i](i);
                return;
            }
        }
    };
    

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
    };


    // adds click callbacks to see selected files, expand/contract directories
    this.fileClickHandler = function(el, moveId, ctrl, shift) {
        if (STORAGE_EVENT_HANDLERS.moveIds && moveId) {
            STORAGE_EVENT_HANDLERS.moveFilesHandler(moveId);
            return;
        }

        if (ctrl) {
            el.classList.toggle(STORAGE_CONSTANTS.selectedClass);
            
        }
        else if (shift && STORAGE_EVENT_HANDLERS.prevClickedId) {

            var allFiles = 
                STORAGE_CONSTANTS.fileListEl.innerHTML.toString();
            var startEl = document.getElementById(
                STORAGE_EVENT_HANDLERS.prevClickedId);
            var endEl = el;
            
            if (allFiles.indexOf("\"" + endEl.id + "\"") > 
                    allFiles.indexOf("\"" + startEl.id + "\"")) {
                endEl = startEl;
                startEl = el;
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
            el.classList.add(STORAGE_CONSTANTS.selectedClass);
            
            if (FILE_MANAGER.checkIfFileIsDirectory(el.id)) {
                var directoryFileList = document.getElementById(
                    el.id + STORAGE_CONSTANTS.ulIDAppend);
                
                var useDark = (NAVBAR_THEME_CONTROLLER.currentTheme == 
                    NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_DARK);

                if (directoryFileList.style.display === "none") {
                    directoryFileList.style.display = "block";
                    STORAGE_DB.getFilesWithinDirectory(
                        STORAGE_EVENT_HANDLERS.getStoragePageName(),
                        el.id);
                    
                    el.getElementsByTagName("img")[0].src =
                    ( useDark ? 
                        STORAGE_CONSTANTS.directoryOpenDarkIcon :
                        STORAGE_CONSTANTS.directoryOpenLightIcon);
                }
                else {
                    directoryFileList.style.display = "none";

                    el.getElementsByTagName("img")[0].src =
                    ( useDark ? 
                        STORAGE_CONSTANTS.directoryCloseDarkIcon :
                        STORAGE_CONSTANTS.directoryCloseLightIcon);
                }
            }
        } 

        STORAGE_EVENT_HANDLERS.prevClickedId = el.id;
    };


    this.addDragEventHandlers = function() {

        STORAGE_CONSTANTS.mainEl.addEventListener("dragstart", function(e) {
            var el = STORAGE_EVENT_HANDLERS.traverseUpDOMToFileElement(
                e.target, STORAGE_CONSTANTS.fileListEl);
            if (el == undefined || el == STORAGE_CONSTANTS.fileListEl) return;

            el.classList.add(STORAGE_CONSTANTS.draggingClass);
            el.classList.add(STORAGE_CONSTANTS.selectedClass);

            var selectedEls = document.getElementsByClassName(
                STORAGE_CONSTANTS.selectedClass);

            for (var i = 0; i < selectedEls.length; i ++) {
                selectedEls[i].classList.add(
                    STORAGE_CONSTANTS.draggingClass);
            }
        }, false);

        STORAGE_CONSTANTS.mainEl.addEventListener("dragend", function(e) {
            STORAGE_EVENT_HANDLERS.clearClass(
                STORAGE_CONSTANTS.draggingClass);
            STORAGE_EVENT_HANDLERS.clearClass(
                STORAGE_CONSTANTS.dragToClass);
        }, false);

        STORAGE_CONSTANTS.mainEl.addEventListener("dragenter", function(e) {
            var el = STORAGE_EVENT_HANDLERS.traverseUpDOMToFileElement(
                e.target, STORAGE_CONSTANTS.fileListEl);
            
            if (el == STORAGE_CONSTANTS.fileListEl || el == null || 
                    el == undefined) {
                STORAGE_EVENT_HANDLERS.clearClass(
                    STORAGE_CONSTANTS.dragToClass);
                return;
            }

            STORAGE_EVENT_HANDLERS.clearClass(
                STORAGE_CONSTANTS.dragToClass);

            el.classList.add(STORAGE_CONSTANTS.dragToClass);
        }, false);
        
        STORAGE_CONSTANTS.mainEl.addEventListener("dragover", function(e) {
            e.preventDefault();
        }, false);

        STORAGE_CONSTANTS.mainEl.addEventListener("drop", async function(e) {
            e.preventDefault();
            e.stopPropagation();

            var el = STORAGE_EVENT_HANDLERS.traverseUpDOMToFileElement(
                e.target, STORAGE_CONSTANTS.fileListEl);

            if (el != null && el != undefined && e.dataTransfer.files.length) {

                let droppedFiles = await STORAGE_EVENT_HANDLERS.getAllFileEntries(
                    e.dataTransfer.items);
                STORAGE_CONSTANTS.uploadFileFieldEl.files = droppedFiles.files;

                STORAGE_EVENT_HANDLERS.clearClass(
                    STORAGE_CONSTANTS.selectedClass);
                if (el != STORAGE_CONSTANTS.fileListEl) {
                    el.classList.add(STORAGE_CONSTANTS.selectedClass);
                }
                STORAGE_EVENT_HANDLERS.uploadNewFilesToDirectoryHandler();
                STORAGE_EVENT_HANDLERS.clearClass(
                    STORAGE_CONSTANTS.draggingClass);
                STORAGE_EVENT_HANDLERS.clearClass(
                    STORAGE_CONSTANTS.dragToClass);
                return;
            }
            else if ((el == null || el == undefined) && e.dataTransfer.files.length > 0)
                return;
            
            if (e.target.parentNode == STORAGE_CONSTANTS.buttonListEl) {
                STORAGE_EVENT_HANDLERS.buttonDropHandler(e);
                return;
            }
            if (el == undefined || el == null) return;
            else if (el == STORAGE_CONSTANTS.fileListEl) {
                STORAGE_EVENT_HANDLERS.moveFilesHandlerInit();
                STORAGE_EVENT_HANDLERS.moveFilesHandler(
                    STORAGE_EVENT_HANDLERS.getStoragePageId());
            }
            else {
                STORAGE_EVENT_HANDLERS.moveFilesHandlerInit();
                STORAGE_EVENT_HANDLERS.moveFilesHandler(el.id);
            }
            
        }, false);
        window.addEventListener("drop", function(e) {
            e.preventDefault();
        }, false);
        window.addEventListener("dragover", function(e) {
            e.preventDefault();
        }, false);
    };


    this.closeProgressModalHandler = function() {
        STORAGE_CONSTANTS.progressModalEl.style.display = "none";
    }

    this.openProgressModalHandler = function(textToDisplay) {
        STORAGE_CONSTANTS.progressModalTextEl.innerHTML = textToDisplay;
        STORAGE_CONSTANTS.progressModalEl.style.display = "block";
    };
    
    
    // handles uploading of the file to the storage room or a subdirectory
	this.uploadNewFilesToDirectoryHandler = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
        var filesToUpload = STORAGE_CONSTANTS.uploadFileFieldEl.files;
        
        var parentDirectoryId = 
            STORAGE_EVENT_HANDLERS.getParentDirectoriesForAction();

        if (filesToUpload.length > 0 && parentDirectoryId.length == 1) {
            
            STORAGE_DB.uploadNewFilesToDirectory(
                storagePageName, filesToUpload, parentDirectoryId[0]);
                
            STORAGE_CONSTANTS.uploadModalEl.style.display = "none";

            STORAGE_EVENT_HANDLERS.openProgressModalHandler(
                STORAGE_CONSTANTS.uploadInProgressMessage);

            STORAGE_CONSTANTS.uploadFileFieldEl.value = '';
            STORAGE_CONSTANTS.uploadDirFieldEl.value = '';

        }
        else {
            if (!filesToUpload.length)
                STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorChooseAFile);
            if (parentDirectoryId.length != 1) {
                STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorUpload1Folder);
                STORAGE_CONSTANTS.uploadModalEl.style.display = "none";
            }
        }
    };


    this.uploadDirectoryWrapper = function() {
        if (STORAGE_CONSTANTS.uploadDirFieldEl.files.length) {
            STORAGE_CONSTANTS.uploadFileFieldEl.files = STORAGE_CONSTANTS.uploadDirFieldEl.files;
            STORAGE_EVENT_HANDLERS.uploadNewFilesToDirectoryHandler();
        }
        else 
            STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorChooseAFolder);
    };


    // handles downloading of files
	this.downloadFilesHandler = function() {
        var fileIdsToDownload = 
            STORAGE_EVENT_HANDLERS.getIdsOfElementsByClassName(
                STORAGE_CONSTANTS.selectedClass);
        fileIdsToDownload = 
            FILE_MANAGER.removeRedundantFiles(fileIdsToDownload);

        if (fileIdsToDownload.length == 1 && 
                !FILE_MANAGER.checkIfFileIsDirectory(fileIdsToDownload[0])) {
            FILE_MANAGER.downloadFile(fileIdsToDownload[0]);

            STORAGE_CONSTANTS.downloadModalEl.style.display = "none";

            STORAGE_EVENT_HANDLERS.openProgressModalHandler(
                STORAGE_CONSTANTS.downloadInProgressMessage);
        }
        else if (fileIdsToDownload.length > 0) {
            STORAGE_DB.getFilePathsAndUrls(
                STORAGE_EVENT_HANDLERS.getStoragePageName(), 
                fileIdsToDownload);
            
            STORAGE_CONSTANTS.downloadModalEl.style.display = "none";

            STORAGE_EVENT_HANDLERS.openProgressModalHandler(
                STORAGE_CONSTANTS.downloadInProgressMessage);
        }
        else 
            STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorChooseAFileDownload);

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
            STORAGE_DB.createNewDirectory(
                storagePageName, newDirectoryName, parentDirectoryId[0]);
            STORAGE_CONSTANTS.directoryModalEl.style.display = "none";
        }
        else {
            if (!newDirectoryName.length)
                STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorNewDirNameLength);
            else if (parentDirectoryId.length != 1) {
                STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorNewDir1Parent);
                STORAGE_CONSTANTS.directoryModalEl.style.display = "none";
            }
        }        
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
            STORAGE_DB.renameFiles(storagePageName, fileIdsToRename, 
                renameName);
            STORAGE_CONSTANTS.renameModalEl.style.display = "none";
        }
        else {
            if (!renameName.length)
                STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorRenameNameLength);
            else if (!fileIdsToRename.length) {
                STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorChooseAFileRename);
                STORAGE_CONSTANTS.renameModalEl.style.display = "none";
            }
        }        
    };

    
    // renames a selected file or list of files
    this.deleteFilesHandler = function() {
        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
        var fileIdsToDelete = STORAGE_EVENT_HANDLERS.getIdsOfElementsByClassName(
            STORAGE_CONSTANTS.selectedClass);
        fileIdsToDelete = FILE_MANAGER.removeRedundantFiles(
            fileIdsToDelete);

        if (fileIdsToDelete.length > 0) 
            STORAGE_DB.deleteFiles(storagePageName, fileIdsToDelete);
        else 
            STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorChooseAFileDelete);

        STORAGE_CONSTANTS.deleteModalEl.style.display = "none";
    };


    // prepares file(s) to be moved
    this.moveFilesHandlerInit = function() {
        var fileIdsToMove = STORAGE_EVENT_HANDLERS
            .getIdsOfElementsByClassName(STORAGE_CONSTANTS.selectedClass);
        fileIdsToMove = FILE_MANAGER.removeRedundantFiles(
            fileIdsToMove);
            
        if (fileIdsToMove.length > 0) 
            STORAGE_EVENT_HANDLERS.moveIds = fileIdsToMove;
        else 
            STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorChooseAFileMove);


        STORAGE_CONSTANTS.moveModalEl.style.display = "none";
    };


    // moves a selected file or list of files
    this.moveFilesHandler = function(elId) {
        var destinationId = 
                FILE_MANAGER.getIdForDirOrParentIdForFile(elId);
        var fileIdsToMove = FILE_MANAGER.removeFilesMovingToSameParent(
            destinationId, STORAGE_EVENT_HANDLERS.moveIds);
        
        STORAGE_EVENT_HANDLERS.moveIds = null;
        
        if (FILE_MANAGER.destinationIsAChildOfFilesToMove(
                destinationId, fileIdsToMove)) {
            STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorMoveParentToChild);
            return;
        }
        else if (!fileIdsToMove.length) {
            STORAGE_EVENT_HANDLERS.displayError(STORAGE_CONSTANTS.errorMoveAFile);
            return;
        }

        var storagePageName = STORAGE_EVENT_HANDLERS.getStoragePageName();
        
        STORAGE_DB.moveFiles(storagePageName, fileIdsToMove, 
            destinationId);
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
    };


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
    };


    this.traverseUpDOMToFileElement = function(startEl, endEl) {
        while (startEl && startEl != undefined && startEl != endEl) {
            if (startEl.classList != undefined && 
                    startEl.classList.contains(STORAGE_CONSTANTS.fileClass)) {
                return startEl;
            }
            startEl = startEl.parentNode;
        }
        return startEl;
    };


    // Drop handler function to get all files
    // https://codepen.io/anon/pen/gBJrOP?editors=0010#0
    this.getAllFileEntries = async function(dataTransferItemList) {
        let fileEntries = [];
        // Use BFS to traverse entire directory/file structure
        let queue = [];
        // Unfortunately dataTransferItemList is not iterable i.e. no forEach
        for (let i = 0; i < dataTransferItemList.length; i ++) {
            queue.push(dataTransferItemList[i].webkitGetAsEntry());
        }
        while (queue.length > 0) {
            let entry = queue.shift();
            if (entry.isFile) 
                fileEntries.push(await STORAGE_EVENT_HANDLERS.getFile(entry));
            else if (entry.isDirectory) {
                let reader = entry.createReader();
                queue.push(...await 
                    STORAGE_EVENT_HANDLERS.readAllDirectoryEntries(reader));
            }
        }
        fileEntries.sort( function(a, b) {
            return a.webkitRelativePath.localeCompare(b.webkitRelativePath);
        });

        var droppedFiles = new DataTransfer();
        for (let i = 0; i < fileEntries.length; i ++) {
            droppedFiles.items.add(fileEntries[i]);
        }
        return droppedFiles;
    };

    // https://codepen.io/anon/pen/gBJrOP?editors=0010#0


    // Get all the entries (files or sub-directories) in a directory by calling readEntries until it returns empty array
    // https://codepen.io/anon/pen/gBJrOP?editors=0010#0  
    this.readAllDirectoryEntries = async function(directoryReader) {
        let entries = [];
        let readEntries = await STORAGE_EVENT_HANDLERS.readEntriesPromise(
            directoryReader);
        while (readEntries.length > 0) {
            entries.push(...readEntries);
            readEntries = await STORAGE_EVENT_HANDLERS.readEntriesPromise(
                directoryReader);
        }
        return entries;
    };


    // https://stackoverflow.com/questions/45052875/how-to-convert-fileentry-to-standard-javascript-file-object-using-chrome-apps-fi
    this.getFile = async function(fileEntry) {
        try {
            var f = await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
            
            Object.defineProperty(f, 'webkitRelativePath', {
                writable: true,
                value: fileEntry.fullPath.replace("/", "")
            });

            return f;
        } 
        catch (err) {
            // console.log(err);
        }
    };
      

    // Wrap readEntries in a promise to make working with readEntries easier
    // https://codepen.io/anon/pen/gBJrOP?editors=0010#0 
    this.readEntriesPromise = async function(directoryReader) {
        try {
            return await new Promise((resolve, reject) => {
                directoryReader.readEntries(resolve, reject);
            });
        } 
        catch (err) {
            // console.log(err);
        }
    };


    this.displayError = function(errorMessage) {
        STORAGE_CONSTANTS.errorModalTextEl.innerHTML = errorMessage;
        STORAGE_CONSTANTS.errorModalEl.style.display = "block";
    };


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
            this.storagePageFields = 
                STORAGE_EVENT_HANDLERS.getJsonFromDataString(
                    storagePage.textContent).fields;
        }
        
        return this.storagePageFields;
    };


    this.switchThemesForIcons = function() {
        var useDark = (NAVBAR_THEME_CONTROLLER.currentTheme == 
            NAVBAR_CONSTANTS.NAVBAR_CONSTANTS_DARK);

        for (var i = 0; i < STORAGE_CONSTANTS.menuEls.length; i ++) {
            STORAGE_CONSTANTS.menuEls[i].getElementsByTagName("img")[0].src = 
                ( useDark ? 
                    STORAGE_CONSTANTS.menuDarkIcons[i] :
                    STORAGE_CONSTANTS.menuLightIcons[i]);
        }

        var allFiles = STORAGE_CONSTANTS.fileListEl.getElementsByClassName(
            STORAGE_CONSTANTS.fileClass);
        
        for (var i = 0; i < allFiles.length; i ++) {
            var fileExtension = FILE_MANAGER.getFileExtension(allFiles[i].id);

            allFiles[i].getElementsByTagName("img")[0].src = 
                STORAGE_EVENT_HANDLERS.getFileIcon(fileExtension, useDark);
        }
    };


    // https://icons8.com/icons/set/closed-folder
    this.getFileIcon = function(fileExtension, useDark) {
        var pathToIcon = "";
        
        switch(fileExtension) {
            case "":
                pathToIcon = ( useDark ? 
                    STORAGE_CONSTANTS.directoryCloseDarkIcon :
                    STORAGE_CONSTANTS.directoryCloseLightIcon);
                break;
            default:
                pathToIcon = ( useDark ? 
                    STORAGE_CONSTANTS.genericFileDarkIcon :
                    STORAGE_CONSTANTS.genericFileLightIcon);
        }
        return pathToIcon;
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
        return JSON.parse(STORAGE_EVENT_HANDLERS.unicodeToChar(
            dataString.replace('\'upload_path\': None', 
                    '\'upload_path\': null').replace(/[']+/g, '"')
                ));
    };
};