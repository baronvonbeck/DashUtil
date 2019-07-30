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

    get getFilename() {
        return this.filename;
    }

    get getModifyTimestamp() {
        return this.modifyTimestamp;
    }

    get getCreateTimestamp() {
        return this.createTimestamp;
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
        var fileTypeRepresentation = "";
        var column1_filename_path = "";
        var column2_modifyTimestamp = "";
        var column3_createTimestamp = "";
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
            column1_filename_path = "<div class=\"file-info-name\"><a href=" + 
                this.uploadPath + " target=\"_blank\">" + 
                this.filename + "</a></div>";

            fileTypeRepresentation = "<img class=\"fileico\"src=\"" + 
                STORAGE_EVENT_HANDLERS.getFileIcon(
                    this.filename.split("\.").pop()) + "\">";
        }
        else {
            column1_filename_path = "<div class=\"file-info-name\">" + 
                this.filename + "</div>";

            if (this.level > 0) {
                fileTypeRepresentation = "<img class=\"fileico\" src=\"" + 
                    STORAGE_EVENT_HANDLERS.getFileIcon("") + "\">";

                directoryAddUL = "<ul id=\"" + this.id + 
                    STORAGE_CONSTANTS.ulIDAppend + "\" style=\"display: ";
            
               var existingDirectory = document.getElementById(
                    this.id + STORAGE_CONSTANTS.ulIDAppend);

                if (existingDirectory) {
                    directoryAddUL += 
                        (existingDirectory.style.display === "block" ? 
                            "block" : "none") + ";\">";
                    directoryAddUL += existingDirectory.innerText;
                }
                else {
                    directoryAddUL += "none;\">";
                }
                directoryAddUL += "</ul>";
            }
        }

        column2_modifyTimestamp = "<div class=\"file-info-date\">" + 
            this.formatDateToString(this.modifyTimestamp) + "</div>";
        column3_createTimestamp = "<div class=\"file-info-date\">" + 
            this.formatDateToString(this.createTimestamp) + "</div>";
        column4_size = "<div class=\"file-info-size\">" + 
            this.formatFileSizeToString(this.size) + "</div>";

        this.infoHtmlRepresentation = "<div class=\"file-info-left\">" + 
            column1_filename_path + "</div><div class=\"file-info-right\">" +
            column2_modifyTimestamp + column3_createTimestamp + column4_size +
            "</div>";

        this.fullHtmlRepresentation = "<li id=\"" + this.id + 
            STORAGE_CONSTANTS.liIDAppend + "\"><div id=\"" + this.id + 
            "\" class=\"" + classString + "\">" + fileTypeRepresentation + 
            "<div id=\"" + this.id + STORAGE_CONSTANTS.infoIDAppend + 
            "\" class=\"file-info-container\">" + 
            this.infoHtmlRepresentation + "</div></div>" + directoryAddUL + "</li>";        
    }


    // formats a date object to a string
    // courtesy of https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site/23259289#23259289
    formatDateToString(date) {        
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
    }

    formatFullDate(date) {
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
    }


    // converts file size to a human readable format. si determines 
    // whether or not to use si standard, default false
    formatFileSizeToString(bytes, si=false) {
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
}
