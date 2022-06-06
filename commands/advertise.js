const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, Guild, Interaction, MessageEmbed, MessageCollector, MessageActionRow, MessageButton, MessageSelectMenu, Modal, TextInputComponent } = require("discord.js");

const GroupLog = require('../models/GroupLog.js');
const Group = require('../models/Group.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('advertise')
        .setDescription('Advertise your group on the marketplace'),
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

        if (groupRecord.commands.advertise === false) {
            console.log(`[${interaction.guild.id}]: Advertise command disabled.`);

            let Embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("This group does not have advertise enabled.")
                .setColor("0x2f3136");
            return interaction.reply({
                embeds: [Embed],
            });
        }

        const modal = new Modal()
            .setCustomId('advertiseModal')
            .setTitle('Advertisement Prompt');

        modal.addComponents(
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('groupName')
                        .setLabel("What is the name of the group?")
                        .setStyle('SHORT')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('groupDescription')
                        .setLabel("What is the description of the group?")
                        .setStyle('PARAGRAPH')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('groupImage')
                        .setLabel("What is the image URL of the group?")
                        .setStyle('SHORT')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('discordInvite')
                        .setLabel("What is the invite link to the group?")
                        .setStyle('SHORT')
                        .setRequired(true)
                ),
            new MessageActionRow()
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('robloxGroup')
                        .setLabel("What is the id to the group on roblox?")
                        .setStyle('SHORT')
                        .setRequired(true)
                )
        );

        await interaction.showModal(modal);
    },
};
