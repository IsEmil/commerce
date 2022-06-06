const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, Guild, Interaction, MessageEmbed, MessageCollector, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

const GroupLog = require('../models/GroupLog.js');
const Group = require('../models/Group.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hire')
        .setDescription('Hire a staff from the marketplace'),
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

        if (groupRecord.commands.hire === false) {
            console.log(`[${interaction.guild.id}]: Hire command disabled.`);

            let Embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("This group does not have hire enabled.")
                .setColor("0x2f3136");
            return interaction.reply({
                embeds: [Embed],
            });
        }

        const modal = new Modal()
            .setCustomId('hireModal')
            .setTitle('Hiring Prompt');

        modal.addComponents(
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('staffName')
                        .setLabel("What are the jobs you are looking for?")
                        .setStyle('SHORT')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('staffDescription')
                        .setLabel("Provide a description of the job.")
                        .setStyle('PARAGRAPH')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('staffPayment')
                        .setLabel("What is the payment for the job?")
                        .setStyle('SHORT')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('staffRequirements')
                        .setLabel("What are the requirements for the job?")
                        .setStyle('PARAGRAPH')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('staffImage')
                        .setLabel("What is the image URL of the job?")
                        .setStyle('SHORT')
                        .setRequired(true)
                ),
        );

        await interaction.showModal(modal);
    },
};
