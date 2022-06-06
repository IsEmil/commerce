const discord = require("discord.js");

const config = require("../config");

/**
 * @param {discord.Client} client
 */
module.exports = exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
    
        const command = client.commands.get(interaction.commandName);
    
        if (!command) return;
    
        try {
            await command.execute(interaction, interaction.user, interaction.guild);
        } catch (err) {
            console.log(err.toString());
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });
};