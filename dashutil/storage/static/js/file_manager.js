// file_manager.js - manages all file representation on a storage page
'use strict';


var FILE_MANAGER = new function() {

    // map of file uuid -> file object
    this.idToFileMap = new Map();

    // map of parent uuid -> list of child file objects
    this.parentToChildMap = new Map();

    // adds a list of files to the file manager
    //TODO: update sizes if applicable
    this.addFileListToPage = function(fileList) {
        for (var i = 0; i < fileList.length; i ++) {

            var f = fileList[i].fields;
            var newRow = new FileObject(fileList[i].pk, f.filename, 
                f.upload_path, f.create_timestamp, f.modify_timestamp,
                f.size, f.parent_directory);
    
            FILE_MANAGER.createIdToFileMapEntry(fileList[i].pk, newRow);
            FILE_MANAGER.createParentToChildMapEntry(f.parent_directory, newRow);

            STORAGE_CONSTANTS.tableBodyEl.innerHTML += newRow.getHTMLRepresentation;
        }
    };


    //TODO: update sizes if applicable
    this.removeFileListFromPage = function(fileList) {
        for (var i = 0; i < fileList.length; i ++) {
            var f = fileList[i];
            
        }
    }

    this.createIdToFileMapEntry = function(fileId, newFileObject) {
        this.idToFileMap.set(fileId, newFileObject);
    }

    this.removeEntryFromIdToFileMap = function(fileId) {
        this.idToFileMap.delete(fileId);
    }

    this.createParentToChildMapEntry = function(parentId, newFileObject) {
        if (!this.parentToChildMap.has(parentId)) {
            this.parentToChildMap.set(parentId, [newFileObject]);
            return;
        }
        this.parentToChildMap.get(parentId).push(newFileObject);
    }
}