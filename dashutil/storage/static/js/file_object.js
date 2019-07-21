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
        this.htmlRepresentation = this.updateHTMLRepresentation();
    }

    get getHTMLRepresentation() {
        return this.htmlRepresentation;
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


    // updates the size of the object. size will be negative or positive
    updateSize(sizeChange) {
        this.size += sizeChange;
        this.htmlRepresentation = this.updateHTMLRepresentation();
    }


    // updates the directory level of the object, or how many subdirectories
    // down the file is within the context of the storage page
    updateLevel(newLevel) {
        this.level = newLevel;
        this.htmlRepresentation = this.updateHTMLRepresentation();
    }


    // updates the filename and timestamps of an object
    updateFilenameAndTimestamps(newFilename, newCreateTimestamp, 
            newModifyTimestamp) {
        this.filename = newFilename;
        this.createTimestamp = new Date(newCreateTimestamp);
        this.modifyTimestamp = new Date(newModifyTimestamp);
        this.htmlRepresentation = this.updateHTMLRepresentation();
    }


    // updates the HTML Representation of the object
    updateHTMLRepresentation() {
        var fullHTMLStringRepresentation = "";
        var column1_filename_path = "";
        var column2_createTimestamp = "";
        var column3_modifyTimestamp = "";
        var column4_size = "";
        var htmlNode = document.getElementById(this.id);
        var classString = "";

        if (this.parentDirectoryId != null) {
            classString += STORAGE_CONSTANTS.fileClass;
        }
        if (htmlNode && document.getElementById(this.id)
                .classList.contains(STORAGE_CONSTANTS.selectedClass)) {
            classString += " " + STORAGE_CONSTANTS.selectedClass;
        }

        if (this.uploadPath != null) {
            column1_filename_path = "<td><a href=" + this.uploadPath + 
            " target=\"_blank\">" + this.filename + "</a></td>";
        }
        else {
            column1_filename_path = "<td>" + this.filename + "</td>"
        }

        column2_createTimestamp = "<td>" + 
            this.formatDateToString(this.createTimestamp) + "</td>";
        column3_modifyTimestamp = "<td>" + 
            this.formatDateToString(this.modifyTimestamp) + "</td>";
        column4_size = "<td>" + 
            this.formatFileSizeToString(this.size) + "</td>";

        fullHTMLStringRepresentation = "<tr id=\"" + this.id + 
            "\" class=\"" + classString + "\">" +
            column1_filename_path + column2_createTimestamp + 
            column3_modifyTimestamp + column4_size + "</tr>";

        return fullHTMLStringRepresentation;
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
            ? ['KB','MB','GB','TB','PB','EB','ZB','YB']
            : ['KB','MB','GB','TB','PB','EB','ZB','YB']
            // : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(2) + ' ' + units[u];
    }
}
