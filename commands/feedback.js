const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, Guild, Interaction, MessageEmbed, MessageCollector, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

const GroupLog = require('../models/GroupLog.js');
const Group = require('../models/Group.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Leave some feedback on one of the groups products'),
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

        if (groupRecord.commands.feedback === false) {
            console.log(`[${interaction.guild.id}]: Group not found.`);

            let Embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("This group does not have feedback enabled.")
                .setColor("0x2f3136");
            return interaction.reply({
                embeds: [Embed],
            });
        }

        const modal = new Modal()
            .setCustomId('feedbackModal')
            .setTitle('Feedback Prompt');

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
                        .setCustomId('productReview')
                        .setLabel("Give us a review of the product.")
                        .setStyle('PARAGRAPH')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('productRating')
                        .setLabel("Give us a rating of the product. (1-5)")
                        .setStyle('SHORT')
                        .setMaxLength(1)
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
