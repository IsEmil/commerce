const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const discord = require("discord.js");
const fs = require('node:fs');

const config = require("../config");

const commands = [];
const commandFiles = fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`${__dirname}/../commands/${file}`);
        console.log(`Loaded command '${file}'`)
        commands.push(command.data.toJSON());
    } catch (err) {
        console.log(`Failed to load command '${file}'`)
        console.log(err.toString());
    }
}

/**
 * @param {discord.Client} client
 */
module.exports = exports = (client) => {
    const rest = new REST({ version: '9' }).setToken(config.discord.token);

    /**rest.put(Routes.applicationGuildCommands(client.user.id, config.discord.guild), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);*/
    rest.put(Routes.applicationCommands(client.user.id), { body: commands })
        .then(() => {
            console.log('Successfully registered application commands.')
        })
        .catch(console.error);
};