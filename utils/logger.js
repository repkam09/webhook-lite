const config = require('../config.json');
const fs = require('fs');

const debugmode = true;
const writetofile = true;
const timestamp = true;

let logpath = __dirname + "webhooklog.log";
if (config["logging"] && config["logging"].logpath) {
    console.log("Found logging location in config file.");
    logpath = config["logging"].logpath;
} else {
    console.log("Using the default logging location");
}

console.log("Logging to " + logpath);

module.exports = {
    level: 1,
    info: (message) => {
        printer("[I] " + message);
    },

    debug: (message) => {
        if (debugmode) {
            printer("[D] " + message);
        }
    },

    error: (message) => {
        printererror("[ERR] " + message);
    },

    verbose: (message) => {
        if (debugmode) {
            printer("[V] " + message);
        }
    }
}

function printer(message) {
    console.log(message);
    logToFile(message);
}

function printererror(message) {
    console.error(message);
    logToFile(message);
}

function logToFile(message) {
    if (timestamp) {
        let datetime = new Date().toLocaleString();
        message = datetime + " " + message;
    }

    if (writetofile) {
        // Append the log message to the file
        fs.appendFile(logpath, message + "\n", function (err) {
            if (err) {
                console.log("Error writing to file " + path + JSON.stringify(err));
            }
        });
    }
}