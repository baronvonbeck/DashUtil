// file_manager.js - manages all file representation on a storage page
'use strict';


var FILE_MANAGER = new function() {

    // map of file uuid -> file object
    this.idToFileMap = new Map();

    // map of parent uuid -> list of child file uuids
    this.parentToChildMap = new Map();

    /**
     * @description adds existing files to the page 
     * @param {array} fileJSONList the list of esisting files to add
     * @return {none}
     */
    this.addExistingFileListToPage = function(fileJSONList) {
        for (var i = 0; i < fileJSONList.length; i ++) {

            if (!FILE_MANAGER.idToFileMap.has(fileJSONList[i].pk)) {
                FILE_MANAGER.createNewFileRecord(fileJSONList[i].pk, 
                    fileJSONList[i].fields);
            }
        }
    };

    /**
     * @description adds new files to the page, and updates the sizes
     * @param {array} fileJSONList the list of new files to add
     * @return {none}
     */
    this.addNewFileListToPage = function(fileJSONList) {
        var sizeChange = 0;

        for (var i = 0; i < fileJSONList.length; i ++) {

            sizeChange += fileJSONList[i].fields.size;
            
            FILE_MANAGER.createNewFileRecord(fileJSONList[i].pk, 
                fileJSONList[i].fields);    
        }

        FILE_MANAGER.iterativelyUpdateDirectorySizes(
            FILE_MANAGER.idToFileMap.get(
                fileJSONList[0].fields.parent_directory), 
            sizeChange);
    };


    /**
     * @description renames files and directories
     * @param {array} fileJSONList the list of files to rename
     * @return {none}
     */
    this.renameExistingFilesOnPage = function(fileJSONList) {
        for (var i = 0; i < fileJSONList.length; i ++) {

            FILE_MANAGER.renameExistingFileRecord(fileJSONList[i].pk, 
                fileJSONList[i].fields);    
        }
    };


    /**
     * @description deletes files, directories, and their contents completely,
     *      and updates sizes
     * @param {array} fileJSONList the list of files to delete
     * @return {none}
     */
    this.deleteExistingFilesOnPage = function(fileJSONList) {
        var fileIdList = fileJSONList.map(function(o) {
            return o.pk;
        });
            
        fileIdList = FILE_MANAGER.removeRedundantFilesToDelete(fileIdList);

        for (var i = 0; i < fileIdList.length; i ++) {
            var fileToRemove = FILE_MANAGER.idToFileMap.get(fileIdList[i]);
   
            FILE_MANAGER.iterativelyUpdateDirectorySizes(
                FILE_MANAGER.idToFileMap.get(
                    fileToRemove.getParentDirectoryId), 
                fileToRemove.getSize * -1);

            FILE_MANAGER.deleteFileRecord(fileToRemove.getParentDirectoryId, 
                fileToRemove.getId, true);
        }
    };


    /**
     * @description moves files, directories, and their contents from one
     *      directory to another
     * @param {string} parentId the directory id to move the file to
     * @param {array} fileIdList the list of ids of files to move
     * @param {boolean} initial whether or not the file is top level selected;
            true if yes, false if no
     * @return {none}
     */
    this.moveFilesToDirectory = function(parentId, fileJSONList, initial) {
        newParent = FILE_MANAGER.idToFileMap.get(parentId);
        var sizeChange = 0;

        for (var i = 0; i < fileJSONList.length; i ++) {
            var fileToMove = FILE_MANAGER.idToFileMap.get(fileJSONList[i].pk);
            var subIdList = FILE_MANAGER.parentToChildMap.get(fileJSONList[i].pk);
            
            // we assume all file sizes up to this point have been maintained 
            // correctly, so subtract the initially selected sizes. subfile sizes 
            // don't matter with this assumption
            if (initial) {
                sizeChange += fileToMove.getSize;
                FILE_MANAGER.iterativelyUpdateDirectorySizes(
                    FILE_MANAGER.idToFileMap.get(
                        fileToMove.getParentDirectoryId), 
                    fileToMove.getSize * -1);
            }

             // if the file to remove is a directory, and it has contents that have
            // been previously expanded, move the files. we don't care about
            // sizes for these, as they are tracked by the parent (current) dir
            if (subIdList != undefined) {
                this.moveFilesToDirectory(fileToMove.getId, subIdList, false);
            }

            FILE_MANAGER.moveFileRecord(destinationId, fileToMove.getId, false);
        }

        if (initial) { 
            FILE_MANAGER.iterativelyUpdateDirectorySizes(
                newParent, sizeChange);
        }
    };

    
    /**
     * @description creates the container storage record, updates its own
     *      and its parent's file id maps, and adds the storage info to html
     * @param {string} fileId the storage file id mapping to create
     * @param {json} fileJSONObject a json dict with the information to
     *      create the storage with
     * @return {none}
     */
    this.createStorageFileRecord = function(fileId, fileJSONObject) {
        var newFile = new FileObject(fileId, fileJSONObject.filename, 
            null, fileJSONObject.create_timestamp, 
            fileJSONObject.modify_timestamp, fileJSONObject.size, 
            null, 0);

        FILE_MANAGER.createIdToFileMapEntry(fileId, newFile);

        STORAGE_CONSTANTS.storagePageInfoEl.innerHTML = 
            newFile.getFullHTMLRepresentation;

        STORAGE_CONSTANTS.listIdEl.id = fileId + STORAGE_CONSTANTS.ulIDAppend;
    };


    /**
     * @description creates a single new file, updates its own and its
     *      parent's file id maps, and adds the new file to html along with
     *      necessary event listeners
     * @param {string} fileId the file id mapping to create
     * @param {json} fileJSONObject a json dict with the information to
     *      create the file with
     * @return {none}
     */
    this.createNewFileRecord = function(fileId, fileJSONObject) {
        var newFile = new FileObject(fileId, fileJSONObject.filename, 
            fileJSONObject.upload_path, fileJSONObject.create_timestamp, 
            fileJSONObject.modify_timestamp, fileJSONObject.size, 
            fileJSONObject.parent_directory, FILE_MANAGER.idToFileMap.get(
                fileJSONObject.parent_directory).level + 1);

        FILE_MANAGER.createIdToFileMapEntry(fileId, newFile);
        FILE_MANAGER.createParentToChildMapEntry(
            fileJSONObject.parent_directory, fileId);

        document.getElementById(fileJSONObject.parent_directory + 
            STORAGE_CONSTANTS.ulIDAppend).insertAdjacentHTML(
                "beforeend", newFile.getFullHTMLRepresentation);

        STORAGE_EVENT_HANDLERS.activateClickToSelectItemCallback(fileId);
    };


    /**
     * @description renames an existing file record, both the file object
     *      and the html
     * @param {string} fileId the file id mapping to update
     * @param {json} fileJSONObject a json dict with the new information to
     *      update the file with
     * @return {none}
     */
    this.renameExistingFileRecord = function(fileId, fileJSONObject) {
        FILE_MANAGER.idToFileMap.get(fileId).updateFilenameAndTimestamps(
            fileJSONObject.filename, fileJSONObject.create_timestamp, 
            fileJSONObject.modify_timestamp);

        document.getElementById(fileId + 
            STORAGE_CONSTANTS.infoIDAppend).innerHTML = 
                FILE_MANAGER.idToFileMap.get(
                    fileId).getInfoHTMLRepresentation;
    };


    /**
     * @description deletes an existing file record, both the file object
     *      and the html
     * @param {string} parentId the file's parent id
     * @param {string} fileId the id of the file mapping to delete
     * @param {boolean} initial true if it is the topmost file to delete, 
     *      false if it is a child file or descendent
     * @return {none}
     */
    this.deleteFileRecord = function(parentId, fileId, initial) {
        if (FILE_MANAGER.parentToChildMap.has(fileId)) {
            var childIdsOfFile = FILE_MANAGER.parentToChildMap.get(fileId);
            for (var i = 0; i < childIdsOfFile.length; i ++) {
                FILE_MANAGER.deleteFileRecord(fileId, childIdsOfFile[i],
                    false);
            }
        }
        
        if (initial) {
            FILE_MANAGER.removeParentToChildMapEntries(
                parentId, fileId);
            document.getElementById(fileId + 
                STORAGE_CONSTANTS.liIDAppend).innerHTML = "";
            document.getElementById(fileId + 
                STORAGE_CONSTANTS.liIDAppend).remove();
        }
        else {
            FILE_MANAGER.removeParentIdMapEntry(fileId);
        }

        FILE_MANAGER.removeIdToFileMapEntry(fileId);
    };


    /**
     * @description moves an existing file record
     * @param {string} parentId the directory id to move the file to
     * @param {string} fileId the id of the file or directory to move
     * @return {none}
     */
    this.moveFileRecord = function(parentId, fileId, initial) {

        if (initial) {
            FILE_MANAGER.removeParentToChildMapEntry(parentId, fileId);
            FILE_MANAGER.createParentToChildMapEntry(parentId, fileId);
        }

        fileToMove = FILE_MANAGER.idToFileMap.get(fileId);
        // fileToMove.updateLevel();
        // update html so that parent element now contains fileId
        // document.getElementById(destinationId).innerHTML = 
        //         directory.getHTMLRepresentation;
    };


    /**
     * @description iteratively finds all of a directory's parents
     * @param {FileObject} directory the directory to find parents of
     * @return {array} parentIdList the list of all of the directory's parents
     */
    this.iterativelyGetListOfParents = function(directory) {
        var parentIdList = [];

        while (directory != undefined && directory != null) {
            parentIdList.push(directory.getId);
            directory = FILE_MANAGER.idToFileMap.get(
                directory.getParentDirectoryId);
        }
        return parentIdList;
    };


    /**
     * @description iteratively update directory sizes upwards along a chain,
     *      both file representations and html
     * @param {FileObject} directory the directory to update
     * @param {int} sizeChange the amount, positive or negative, to update
     *      the directory size by
     * @return {none}
     */
    this.iterativelyUpdateDirectorySizes = function(directory, sizeChange) {
        while (directory != undefined && directory != null) {
            directory.updateSize(sizeChange);
            document.getElementById(directory.getId + 
                STORAGE_CONSTANTS.infoIDAppend).innerHTML = 
                    directory.getInfoHTMLRepresentation;
            directory = FILE_MANAGER.idToFileMap.get(
                directory.getParentDirectoryId);
        }
    };


    /**
     * @description recursively update directory sizes upwards along a chain,
     *      both file representations and html
     * @param {FileObject} directory the directory to update
     * @param {int} sizeChange the amount, positive or negative, to update
     *      the directory size by
     * @return {none}
     */
    this.recursivelyUpdateDirectorySizes = function(directory, sizeChange) {
        if (directory != undefined && directory != null) {
            directory.updateSize(sizeChange);
            document.getElementById(directory.getId + 
                STORAGE_CONSTANTS.infoIDAppend).innerHTML = 
                    directory.getInfoHTMLRepresentation;
            FILE_MANAGER.recursivelyUpdateDirectorySizes(
                FILE_MANAGER.idToFileMap.get(directory.getParentDirectoryId),
                sizeChange);
        }
    };


    /**
     * @description creates a mapping of file id to file representation object
     * @param {string} fileId the id of the file to map
     * @param {FileObject} newFileObject the file object to map to
     * @return {none}
     */
    this.createIdToFileMapEntry = function(fileId, newFileObject) {
        FILE_MANAGER.idToFileMap.set(fileId, newFileObject);
    };


    /**
     * @description removes a fileId to file object mapping
     * @param {string} fileId the file id mapping to remove
     * @return {none}
     */
    this.removeIdToFileMapEntry = function(fileId) {
        FILE_MANAGER.idToFileMap.delete(fileId);
    };


    /**
     * @description creates a new parent to child mapping
     * @param {string} parentId the parent id
     * @param {string} childId the child id to add to the parent's child list
     * @return {none}
     */
    this.createParentToChildMapEntry = function(parentId, childId) {
        if (!FILE_MANAGER.parentToChildMap.has(parentId)) {
            this.parentToChildMap.set(parentId, [childId]);
            return;
        }
        FILE_MANAGER.parentToChildMap.get(parentId).push(childId);
    };

    
    /**
     * @description removes childId from the parentId map's list of children,
     *      and then if the child is a parent itself, deletes the child
     * @param {string} parentId the parent id containing the child
     * @param {string} childId the child id to delete entirely
     * @return {none}
     */
    this.removeParentToChildMapEntries = function(parentId, childId) {
        FILE_MANAGER.removeParentToChildMapEntry(parentId, childId);
        FILE_MANAGER.removeParentIdMapEntry(childId);
    };


    /**
     * @description removes a file from parent mapping
     * @param {string} fileId the id of the file to remove from parent mapping
     * @return {none}
     */
    this.removeParentIdMapEntry = function(fileId) {
        FILE_MANAGER.parentToChildMap.delete(fileId);
    };


    /**
     * @description removes childId from the parentId map's list of children
     * @param {string} parentId the parent id containing the child
     * @param {string} childId the child to remove
     * @return {none}
     */
    this.removeParentToChildMapEntry = function(parentId, childId) {
        var childIdsOfParent = FILE_MANAGER.parentToChildMap.get(parentId);

        for (var i = childIdsOfParent.length - 1; i >= 0; -- i) {
            if (childIdsOfParent[i] == childId) {
                childIdsOfParent.splice(i, 1);
                return;
            }
        }
    };


    /**
     * @description check if a directory has already been expanded
     * @param {string} directoryId id of the directory to check
     * @return {boolean} true|false if directory has been expanded
     */
    this.checkIfDirectoryisExpanded = function(directoryId) {
        return FILE_MANAGER.parentToChildMap.has(directoryId);
    };


    /**
     * @description check if a fileId is a directory
     * @param {string} directoryId id of the file to check
     * @return {boolean} true|false if file is a directory
     */
    this.checkIfFileIsDirectory = function(fileId) {
        return FILE_MANAGER.idToFileMap.get(fileId).getUploadPath == null;
    }


    /**
     * @description removes any redundant files from a deletion list. For
     *      example, if a parent directory is marked for deletion along
     *      with a descandant child file or directory, only deletion
     *      of the parent is necessary
     * @param {array} fileIdList the storage file id mapping to create
     * @return {none}
     */
    this.removeRedundantFilesToDelete = function(fileIdList) {
        var highestRelevantParent = [];
        
        for (var i = 0; i < fileIdList.length; i ++) {
            var id = fileIdList[i];
            var allParentsOfId = FILE_MANAGER.iterativelyGetListOfParents(
                FILE_MANAGER.idToFileMap.get(
                    FILE_MANAGER.idToFileMap.get(id).getParentDirectoryId));

            if (!FILE_MANAGER.checkIfValueExistsInBothArrays(
                    fileIdList, allParentsOfId)) {
                highestRelevantParent.push(id);
            }
        }

        return highestRelevantParent;
    }


    /**
     * @description determine if an array contains one or more items from 
     *      another array
     * @param {array} searchList the array to search.
     * @param {array} arr an array of items to search for in thesearchList.
     * @return {boolean} true|false if searchList contains at least one 
     *      item from arr
     */
    this.checkIfValueExistsInBothArrays = function(searchList, arr) {
        return arr.some(function (v) {
            return searchList.indexOf(v) >= 0;
        });
    };
}
