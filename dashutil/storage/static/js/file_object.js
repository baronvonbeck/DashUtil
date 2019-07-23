// file_object.js - class representation of a file object within
// a storage page
'use strict';

// Representation of a file object within the storage page and
// directory structure
class FileObject {
    constructor(newId, newFilename, newUploadPath, newCreateTimestamp, 
        newModifyTimestamp, newSize, newParentDirectoryId, newLevel) {

        this.id = newId;
        this.filename = newFilename;
        this.uploadPath = newUploadPath;
        this.createTimestamp = new Date(newCreateTimestamp);
        this.modifyTimestamp = new Date(newModifyTimestamp);
        this.size = newSize;
        this.parentDirectoryId = newParentDirectoryId;
        this.level = newLevel;
        this.fullHtmlRepresentation = "";
        this.infoHtmlRepresentation = "";
        this.updateHTMLRepresentation();
    }

    get getFullHTMLRepresentation() {
        return this.fullHtmlRepresentation;
    }

    get getInfoHTMLRepresentation() {
        return this.infoHtmlRepresentation;
    }

    get getId() {
        return this.id;
    }

    get getParentDirectoryId() {
        return this.parentDirectoryId;
    }

    get getSize() {
        return this.size;
    }

    get getUploadPath() {
        return this.uploadPath;
    }


    // updates the size of the object. size will be negative or positive
    updateSize(sizeChange) {
        this.size += sizeChange;
        this.updateHTMLRepresentation();
    }


    // updates the directory level of the object, or how many subdirectories
    // down the file is within the context of the storage page
    updateLevel(newLevel) {
        this.level = newLevel;
        this.updateHTMLRepresentation();
    }


    // updates the filename and timestamps of an object
    updateFilenameAndTimestamps(newFilename, newCreateTimestamp, 
            newModifyTimestamp) {
        this.filename = newFilename;
        this.createTimestamp = new Date(newCreateTimestamp);
        this.modifyTimestamp = new Date(newModifyTimestamp);
        this.updateHTMLRepresentation();
    }


    // updates the HTML representations of the object
    updateHTMLRepresentation() {
        var fullHTMLStringRepresentation = "";
        var column1_filename_path = "";
        var column2_createTimestamp = "";
        var column3_modifyTimestamp = "";
        var column4_size = "";
        var htmlNode = document.getElementById(this.id);
        var directoryAddUL = "";
        var classString = "";

        if (this.parentDirectoryId != null) {
            classString += STORAGE_CONSTANTS.fileClass;
        }
        if (htmlNode && htmlNode.classList.contains(
            STORAGE_CONSTANTS.selectedClass)) {
                classString += " " + STORAGE_CONSTANTS.selectedClass;
        }

        if (this.uploadPath != null) {
            column1_filename_path = "<div class=\"fileinfo\"><a href=" + 
                this.uploadPath + " target=\"_blank\">" + 
                this.filename + "</a></div>";
        }
        else {
            column1_filename_path = "<div class=\"fileinfo\">" + 
                this.filename + "</div>";

            if (this.level > 0) {
                directoryAddUL = "<ul id=\"" + this.id + 
                    STORAGE_CONSTANTS.ulIDAppend + "\">";

                if (document.getElementById(
                    this.id + STORAGE_CONSTANTS.ulIDAppend)) {
                        directoryAddUL += document.getElementById(
                            this.id + STORAGE_CONSTANTS.ulIDAppend).innerText;
                }
                directoryAddUL += "</ul>";
            }
        }

        column2_createTimestamp = "<div class=\"fileinfo\">" + 
            this.formatDateToString(this.createTimestamp) + "</div>";
        column3_modifyTimestamp = "<div class=\"fileinfo\">" + 
            this.formatDateToString(this.modifyTimestamp) + "</div>";
        column4_size = "<div class=\"fileinfo\">" + 
            this.formatFileSizeToString(this.size) + "</div>";

        fullHTMLStringRepresentation = "<li id=\"" + this.id + 
            "\" class=\"" + classString + "\"><div id=\"" + this.id + 
            STORAGE_CONSTANTS.infoIDAppend + "\">" + column1_filename_path + 
            column2_createTimestamp + column3_modifyTimestamp + column4_size +
            "</div>" + directoryAddUL + "</li>";

        this.fullHtmlRepresentation = fullHTMLStringRepresentation;
        this.infoHtmlRepresentation = column1_filename_path + 
            column2_createTimestamp + column3_modifyTimestamp + column4_size;
    }


    // formats a date object to a string
    formatDateToString(date) {
        var time = "";
        if (date.getHours() - 12 > 0) {
            var temp = date.getHours() - 12;
            time = temp + ":" + date.getMinutes() + "." + 
                date.getMilliseconds() + " PM";
        }
        else {
            time = (date.getHours() == 0 ? "12" : date.getHours()) + 
                ":" + date.getMinutes() + "." + date.getMilliseconds() + " AM";
        }

        return date.getMonth() + "/" + date.getDate() + "/" + 
            date.getFullYear() + " " + time;
    }


    // converts file size to a human readable format. si determines 
    // whether or not to use si standard, default false
    formatFileSizeToString(bytes, si=false) {
        var thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' bytes';
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
}
