require("dotenv").config();

const { Client, Collection, Intents } = require('discord.js');
const fs = require('node:fs');

const config = require('./config');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,

        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    } catch(err) {
        console.log(err)
    }
}

async function init() {
    await require("./handlers/mongoose")();
    console.log('Loaded database!');
    await client.login(config.discord.token)
    console.log('Logged in!');
    await require("./handlers/event")(client);
    console.log('Loaded events!');
    await require("./handlers/slash")(client);
    console.log('Loaded slash commands!');
}

init();