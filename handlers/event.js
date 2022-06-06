const discord = require("discord.js");
const path = require("path");
const fs = require("fs");

const config = require("../config");

/**
 * @param {discord.Client} client
 */
module.exports = exports = (client) => {
    var startupFolder = path.join(__dirname, "/../events");
    fs.readdir(startupFolder, (err, files) => {
        if (err) {
            console.log("Unable to read events folder")
            botErrorLog("Read Error", err.message);
        } else {
            files.forEach((file) => {
                if (file.length >= 4) { // so we can safeley substring
                    if (file.substring(file.length - 3) === ".js") { // whoo its a javascript file!
                        try {
                            let module = require(path.resolve(`${__dirname}/../events/${file}`))(client); // 'src' is required in the path else it gets confused
                            console.log(`Loaded event '${file}'`)
                        } catch (e) {
                            console.log(`Unbale to load event '${file}'`);
                        }
                    }
                }
            });
        }
    });
};