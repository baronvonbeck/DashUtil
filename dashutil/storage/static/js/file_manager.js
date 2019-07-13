// file_object.js - class representation of a file object within
// a storage page

class FileObject {
    constructor(newFilename, newUploadPath, newCreateTimestamp, 
        newModifyTimestamp, newSize, newParentDirectory) {

        this.filename = newFilename;
        this.uploadPath = newUploadPath;
        this.createTimestamp = new Date(newCreateTimestamp);
        this.modifyTimestamp = new Date(newModifyTimestamp);
        this.size = newSize;
        this.parentDirectory = newParentDirectory;
    }

    get htmlRepresentation() {
        var fullHTMLStringRepresentation = ""
        var column1_filename_path = "";
        var column2_createTimestamp = "";
        var column3_modifyTimestamp = "";
        var column4_size = "";

        if (this.uploadPath != null) {
            column1_filename_path = "<td><a href=" + this.uploadPath + 
            " target=\"_blank\">" + this.filename + "</a></td>";
        }
        else {
            column1_filename_path = "<td>" + this.filename + "</td>"
        }

        column2_createTimestamp = "<td>" + this.formatDateToString(this.createTimestamp) + "</td>";
        column3_modifyTimestamp = "<td>" + this.formatDateToString(this.modifyTimestamp) + "</td>";
        column4_size = "<td>" + this.formatFileSizeToString(this.size) + "</td>";

        fullHTMLStringRepresentation = "<tr>" + 
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
            time = date.getHours() + ":" + date.getMinutes() + "." + 
                date.getMilliseconds() + " AM";
        }

        return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + time;
    }


    // converts file size to a human readable format, copying django filesizeformat
    // functionality. si determines whether or not to use si standard
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
        return bytes.toFixed(1) + ' ' + units[u];
    }
}

class FileManager {

}