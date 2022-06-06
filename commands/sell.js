const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, Guild, Interaction, MessageEmbed, MessageCollector, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

const GroupLog = require('../models/GroupLog.js');
const Group = require('../models/Group.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription('Sell a product on the marketplace'),
    /**
     * 
     * @param {Interaction} interaction 
     * @param {GuildMember} user 
     * @param {Guild} guild 
     */
    async execute(interaction, user, guild) {
        const groupRecord = await Group.findOne({ guild: interaction.guild.id }).exec();

        if (!groupRecord) {
            console.log(`[${interaction.guild.id}]: Group not found.`);

            let Embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("This server is not registered.")
                .setColor("0x2f3136");
            return interaction.reply({
                embeds: [Embed],
            });
        };

        if (groupRecord.commands.sell === false) {
            console.log(`[${interaction.guild.id}]: Sell command disabled.`);

            let Embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("This group does not have sell enabled.")
                .setColor("0x2f3136");
            return interaction.reply({
                embeds: [Embed],
            });
        }

        const modal = new Modal()
            .setCustomId('sellModal')
            .setTitle('Selling Prompt');

        modal.addComponents(
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('productName')
                        .setLabel("What is the name of the product?")
                        .setStyle('SHORT')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('productDescription')
                        .setLabel("What is the description of the product?")
                        .setStyle('PARAGRAPH')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('productPrice')
                        .setLabel("What is the price for the product?")
                        .setStyle('SHORT')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('productImage')
                        .setLabel("What is the image URL of the product?")
                        .setStyle('SHORT')
                        .setRequired(true)
                ),
        );

        await interaction.showModal(modal);
    },
};
