const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, Guild, Interaction, MessageEmbed, MessageCollector, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

const crypto = require("crypto")

const GroupLog = require('../models/GroupLog.js');
const Group = require('../models/Group.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wipe')
        .setDescription('Wipe your server'),
    /**
     * 
     * @param {Interaction} interaction 
     * @param {GuildMember} user 
     * @param {Guild} guild 
     */
    async execute(interaction, user, guild) {
        const filter = m => m.author.id != interaction.client.user.id
        const filterButton = i => { return i.user.id === interaction.user.id; };

        if (interaction.user.id !== "922546696876064788") {
            if (user.id !== guild.ownerId) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Error")
                        .setDescription("You must be the server owner to use this command.")
                        .setColor("0x2f3136")
                ]
            });
        }

        const groupRecord = await Group.findOne({ guild: interaction.guild.id }).exec();

        if (!groupRecord) {
            console.log(`[${interaction.guild.id}]: Group not found.`);

            let Embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("This server is not registered. Please use `/register` to register your server.")
                .setColor("0x2f3136");
            return interaction.reply({
                embeds: [Embed],
            });
        };

        let Embed = new MessageEmbed()
            .setTitle("Wipe")
            .setDescription("Please select an option below to edit")
            .setColor("0x2f3136");
        interaction.reply({
            embeds: [Embed],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('continue')
                        .setLabel('Yes')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('cancel')
                        .setLabel('No')
                        .setStyle('DANGER'),
                )
            ]
        });
        interaction.channel.awaitMessageComponent({ filterButton, componentType: 'BUTTON', time: 60000 }).then(async (menuReply) => {
            if (menuReply.customId === "continue") {
                await GroupLog.deleteMany({ group: groupRecord._id });
                await Group.deleteOne({ _id: groupRecord._id });

                let Embed = new MessageEmbed()
                    .setTitle("Completed")
                    .setDescription("Your server has been wiped.")
                    .setColor("0x2f3136");
                return interaction.editReply({ embeds: [Embed], components: [] });
            } else if (menuReply.customId === "cancel") {
                let Embed = new MessageEmbed()
                    .setTitle("Cancelled")
                    .setDescription("This prompt was cancelled by the user")
                    .setColor("0x2f3136");
                return interaction.editReply({ embeds: [Embed], components: [] });
            }
        });
    },
};
