const discord = require("discord.js");

const config = require("../config");

/**
 * @param {discord.Client} client
 */
module.exports = exports = (client) => {
    client.once('ready', () => {
        console.log('Ready!');

        client.user.setActivity("for marketplaces", { type: "WATCHING" });
    });
};