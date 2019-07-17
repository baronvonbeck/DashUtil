// file_manager.js - manages all file representation on a storage page
'use strict';


var FILE_MANAGER = new function() {

    // map of file uuid -> file object
    this.idToFileMap = new Map();

    // map of parent uuid -> list of child file uuids
    this.parentToChildMap = new Map();

    // adds existing files to the page (expansion of directory).
    // does not increase size
    this.addExistingFileListToPage = function(fileList) {
        for (var i = 0; i < fileList.length; i ++) {

            FILE_MANAGER.createNewFileRecord(fileList[i].pk, 
                fileList[i].fields);
        }
    }

    // adds new files to the page. updates the size
    this.addNewFileListToPage = function(fileList) {
        var sizeChange = 0;

        for (var i = 0; i < fileList.length; i ++) {

            sizeChange += fileList[i].fields.size;
            
            FILE_MANAGER.createNewFileRecord(fileList[i].pk, 
                fileList[i].fields);    
        }

        FILE_MANAGER.iterativelyUpdateDirectorySizes(
            FILE_MANAGER.idToFileMap.get(fileList[0].fields.parent_directory), 
            sizeChange);
    }


    // moves files, directories, and their contents from one 
    // directory to another
    this.moveFilesToDirectory = function(destinatiomId, fileIdList, initial) {
        newParent = FILE_MANAGER.idToFileMap.get(destinatiomId);
        var sizeChange = 0;

        for (var i = 0; i < fileIdList.length; i ++) {
            var fileToMove = FILE_MANAGER.idToFileMap.get(fileIdList[i]);
            var subIdList = FILE_MANAGER.parentToChildMap.get(fileIdList[i]);
            
            // we assume all file sizes up to this point have been maintained 
            // correctly, so subtract the initially selected sizes. subfile sizes 
            // don't matter with this assumption
            if (initial) {
                sizeChange += fileToMove.getSize;
                FILE_MANAGER.iterativelyUpdateDirectorySizes(
                    FILE_MANAGER.idToFileMap.get(fileToMove.getParentDirectoryId), 
                    fileToMove.getSize * -1);
            }

             // if the file to remove is a directory, and it has contents that have
            // been previously expanded, move the files. we don't care about
            // sizes for these, as they are tracked by the parent (current) dir
            if (subIdList != undefined) {
                this.moveFilesToDirectory(fileToMove.getId, subIdList, false);
            }

            FILE_MANAGER.moveFileRecord(destinationId, fileIdList[i], false);
        }

        if (initial) { 
            FILE_MANAGER.iterativelyUpdateDirectorySizes(
                newParent, sizeChange);
        }
    }

    // removes files, directories, and their contents completely
    // passes in a list of file ids to remove
    this.removeFileListFromPage = function(fileIdList, initial) {
        for (var i = 0; i < fileIdList.length; i ++) {
            var fileToRemove = FILE_MANAGER.idToFileMap.get(fileIdList[i]);
            var subIdList = FILE_MANAGER.parentToChildMap.get(fileIdList[i]);

            // we assume all file sizes up to this point have been maintained 
            // correctly, so subtract the initially selected sizes. subfile sizes 
            // don't matter with this assumption
            if (initial) {    
                FILE_MANAGER.iterativelyUpdateDirectorySizes(
                    FILE_MANAGER.idToFileMap.get(fileToRemove.getParentDirectoryId), 
                    fileToRemove.getSize * -1);
            }
            
            // if the file to remove is a directory, and it has contents that have
            // been previously expanded, remove the files. we don't care about
            // sizes for these, as they are tracked by the parent (current) dir
            if (subIdList != undefined) {
                this.removeFileListFromPage(subIdList, false);
            }

            FILE_MANAGER.deleteFileRecord(
                fileToRemove.getParentDirectoryId, fileIdList[i]);
        }
    }


    // moves a single existing file, updates id maps
    // TODO: update innerHTML
    this.moveFileRecord = function(destinationId, fileId, initial) {

        if (initial) {
            FILE_MANAGER.removeParentToChildMapEntry(destinatiomId, fileId);
            FILE_MANAGER.createParentToChildMapEntry(destinationId, fileId);
        }

        fileToMove = FILE_MANAGER.idToFileMap.get(fileId);
        // fileToMove.updateLevel();
        // update html so that parent element now contains fileId
        // document.getElementById(destinationId).innerHTML = 
        //         directory.getHTMLRepresentation;
    }


    // deletes a single existing file, updates id maps and UI
    this.deleteFileRecord = function(parentId, fileId) {
        FILE_MANAGER.removeIdToFileMapEntry(fileId);
        FILE_MANAGER.removeParentToChildMapEntries(
            parentId, fileId);

        document.getElementById(fileId).innerHTML = "";
    }

    // creates a single new file, updates id maps, returns the size of created file
    // TODO: update innerHTML
    this.createNewFileRecord = function(fileId, fileJSONObject) {
        var newFile = new FileObject(fileId, fileJSONObject.filename, 
            fileJSONObject.upload_path, fileJSONObject.create_timestamp, 
            fileJSONObject.modify_timestamp, fileJSONObject.size, 
            fileJSONObject.parent_directory,
            FILE_MANAGER.idToFileMap.get(fileJSONObject.parent_directory).level + 1
        );

        FILE_MANAGER.createIdToFileMapEntry(fileId, newFile);
        FILE_MANAGER.createParentToChildMapEntry(
            fileJSONObject.parent_directory, fileId);

        STORAGE_CONSTANTS.tableBodyEl.innerHTML += newFile.getHTMLRepresentation;

        // TODO: update innerHTML so that parent now contains the new fileID
        // document.getElementById(destinationId).innerHTML = 
        //         directory.getHTMLRepresentation;
    }


    // creates the initial Storage file representation at level 0. All other 
    // files will be within this "directory"
    this.createStorageFileRecord = function(fileId, fileJSONObject) {
        var newFile = new FileObject(fileId, fileJSONObject.filename, 
            null, fileJSONObject.create_timestamp, 
            fileJSONObject.modify_timestamp, fileJSONObject.size, 
            null, 0
        );

        FILE_MANAGER.createIdToFileMapEntry(fileId, newFile);

        STORAGE_CONSTANTS.storagePageInfoEl.innerHTML += newFile.getHTMLRepresentation;
    }


    // recursibely update directory sizes upwards along a chain
    this.recursivelyUpdateDirectorySizes = function(directory, sizeChange) {
        if (directory != undefined && directory != null) {
            directory.updateSize(sizeChange);
            document.getElementById(directory.getId).innerHTML = 
                directory.getHTMLRepresentation;
            FILE_MANAGER.recursivelyUpdateDirectorySizes(
                FILE_MANAGER.idToFileMap.get(directory.getParentDirectoryId),
                sizeChange);
        }
    }


    // iteratively update directory sizes upwards along a chain
    this.iterativelyUpdateDirectorySizes = function(directory, sizeChange) {
        while (directory != undefined && directory != null) {
            directory.updateSize(sizeChange);
            document.getElementById(directory.getId).innerHTML = 
                directory.getHTMLRepresentation;
            directory = FILE_MANAGER.idToFileMap.get(directory.getParentDirectoryId);
        }
    }
    

    // creates a mapping of id to a file representation
    this.createIdToFileMapEntry = function(fileId, newFileObject) {
        FILE_MANAGER.idToFileMap.set(fileId, newFileObject);
    }


    // removes an id and its corresponding file
    this.removeIdToFileMapEntry = function(fileId) {
        FILE_MANAGER.idToFileMap.delete(fileId);
    }


    // creates a new parent containing a new child, or updates an existing 
    // parent id with the new child
    this.createParentToChildMapEntry = function(parentId, childId) {
        if (!FILE_MANAGER.parentToChildMap.has(parentId)) {
            this.parentToChildMap.set(parentId, [childId]);
            return;
        }
        FILE_MANAGER.parentToChildMap.get(parentId).push(childId);
    }

    
    // removes childId from the parentId's list of children, and then
    // if childId is itself a parent, deletes childId
    this.removeParentToChildMapEntries = function(parentId, childId) {
        FILE_MANAGER.removeParentToChildMapEntry(parentId, childId);
        FILE_MANAGER.parentToChildMap.delete(childId);
    }


    // reoves childId from the parentId's list of children
    this.removeParentToChildMapEntry = function(parentId, childId) {
        childIdsOfParent = FILE_MANAGER.parentToChildMap.get(parentId);

        for (var i = childIdsOfParent.length - 1; i >= 0; -- i) {
            if (childIdsOfParent[i] == childId) {
                childIdsOfParent.splice(i, 1);
                return;
            }
        }
    }
}