// storage_to_db.js - "interface" methods to call to access database wrapper, 
// and will do any parsing necessary on return data from ajax calls in the
// event  that a new backend is used
'use strict';

const STORAGE_DB = new function() {

    // Uploads a new file to a given directory within a storage
    // This method is called back from STORAGE_EVENT_HANDLERS
    this.uploadNewFilesToDirectory = function(storageName, filesToUpload, 
        parentDirectoryId) {

        uploadFileToStorageDB(STORAGE_DB.addNewFilesToPage, STORAGE_DB.errorMessageCaller,
            storageName, filesToUpload, parentDirectoryId);
    };

    // Gets child files for a given directory
    // This method is called back from STORAGE_EVENT_HANDLERS
    this.getFilesWithinDirectory = function(storageName, directoryId) {

        getFilesWithinDirectoryDB(STORAGE_DB.addExistingFilesToPage, 
            STORAGE_DB.errorMessageCaller, storageName, directoryId);
    };

    // Gets a list of all file path/names and urls to download from a 
    // list of fileIds, including subfiles and directories if applicable
    // This method is called back from STORAGE_EVENT_HANDLERS
    this.getFilePathsAndUrls = function(storageName, fileIdsToDownload) {
        getFilePathsAndUrlsDB(STORAGE_DB.downloadSelectedFiles, STORAGE_DB.errorMessageCaller, 
            storageName, fileIdsToDownload);
    };

    // Creates a new directory under a given directory within a storage
    // This method is called back from STORAGE_EVENT_HANDLERS
    this.createNewDirectory = function(storageName, newDirectoryName, 
        parentDirectoryId) {

        createNewDirectoryDB(STORAGE_DB.addNewFilesToPage, STORAGE_DB.errorMessageCaller,
            storageName, newDirectoryName, parentDirectoryId);
    };

    // Renames a file or list of files
    // This method is called back from STORAGE_EVENT_HANDLERS
    this.renameFiles = function(storageName, fileIdsToRename, renameName) {

        renameFilesDB(STORAGE_DB.renameExistingFiles, STORAGE_DB.errorMessageCaller,
            storageName, fileIdsToRename, renameName);
    };

    // Deletes a file or list of files
    // This method is called back from STORAGE_EVENT_HANDLERS
    this.deleteFiles = function(storageName, fileIdsToDelete) {

        deleteFilesDB(STORAGE_DB.deleteExistingFiles, STORAGE_DB.errorMessageCaller,
            storageName, fileIdsToDelete);
    };

    // Moves a file or list of files
    // This method is called back from STORAGE_EVENT_HANDLERS
    this.moveFiles = function(storageName, fileIdsToMove, destinationId) {

        moveFilesToDirectoryDB(STORAGE_DB.moveExistingFiles, STORAGE_DB.errorMessageCaller,
            storageName, fileIdsToMove, destinationId);
    };





    // Adds files/directories to the storage page
    this.addNewFilesToPage = function(files) {
        FILE_MANAGER.addNewFileListToPage(files);
        STORAGE_EVENT_HANDLERS.closeProgressModalHandler();
    }

    // Adds files/directories to the storage page
    this.addExistingFilesToPage = function(files) {
        FILE_MANAGER.addExistingFileListToPage(files);
    }

    // downloads selected fiels from the storage page
    this.downloadSelectedFiles = function(files) { 
        FILE_MANAGER.downloadFileList(files);
        STORAGE_EVENT_HANDLERS.closeProgressModalHandler();
    }

    // rename existing files on the page with new information
    this.renameExistingFiles = function(files) {
        FILE_MANAGER.renameExistingFilesOnPage(files);
    };

    // deletes existing files on the page
    this.deleteExistingFiles = function(files) {
        FILE_MANAGER.deleteExistingFilesOnPage(files);
    };

    // moves existing files on the page
    this.moveExistingFiles = function(files) {
        FILE_MANAGER.moveExistingFilesOnPage(files);
    };





    // Calls error message if ajax call fails
    this.errorMessageCaller = function(errorMessage, parentDirectoryId) {
        // TODO: handle this
    };
}