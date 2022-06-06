const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, Permissions, Guild, Interaction, MessageEmbed, MessageCollector, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

const crypto = require("crypto")

const GroupLog = require('../models/GroupLog.js');
const Group = require('../models/Group.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Announces a message to the server'),
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

        if (!interaction.member.roles.cache.has(groupRecord.configuration.staffRole)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("You do not have permission to use this command.")
                    .setColor("0x2f3136")
            ]
        });

        const filter = m => m.member.user.id == interaction.member.user.id

        const questionOne = new MessageEmbed()
            .setTitle('Channel')
            .setDescription('What channel would you like to announce in?')
            .setColor("0x2f3136")
        await interaction.reply({ embeds: [questionOne] }).then(async (msg) => {
            await interaction.channel.awaitMessages({ filter, max: 1 }).then(async channel => {
                if (channel.first().content.toLowerCase() === 'cancel') {
                    return channel.first().reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("Error")
                                .setDescription("Prompt cancelled.")
                                .setColor("0x2f3136")
                        ]
                    });
                }
                if (channel.first().mentions.channels.size > 0) {
                    const questionTwo = new MessageEmbed()
                        .setTitle('Title')
                        .setDescription('What would you like to set the title as')
                        .setColor("0x2f3136")
                    await channel.first().reply({ embeds: [questionTwo] }).then(async (msg) => {
                        await interaction.channel.awaitMessages({ filter, max: 1 }).then(async title => {
                            if (title.first().content.toLowerCase() === 'cancel') {
                                return title.first().reply({
                                    embeds: [
                                        new MessageEmbed()
                                            .setTitle("Error")
                                            .setDescription("Prompt cancelled.")
                                            .setColor("0x2f3136")
                                    ]
                                });
                            }
                            const questionThree = new MessageEmbed()
                                .setTitle('Message')
                                .setDescription('What would you like to say?')
                                .setColor("0x2f3136")
                            await title.first().reply({ embeds: [questionThree] }).then(async (msg) => {
                                await interaction.channel.awaitMessages({ filter, max: 1 }).then(async message => {
                                    if (message.first().content.toLowerCase() === 'cancel') {
                                        return message.first().reply({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setTitle("Error")
                                                    .setDescription("Prompt cancelled.")
                                                    .setColor("0x2f3136")
                                            ]
                                        });
                                    }
                                    const questionThree = new MessageEmbed()
                                        .setTitle('Images')
                                        .setDescription('Would you like to upload any images?\n**Type skip to skip.**')
                                        .setColor("0x2f3136")
                                    await message.first().reply({ embeds: [questionThree] }).then(async (msg) => {
                                        await interaction.channel.awaitMessages({ filter, max: 1 }).then(async images => {
                                            if (images.first().content.toLowerCase() === 'cancel') {
                                                return images.first().reply({
                                                    embeds: [
                                                        new MessageEmbed()
                                                            .setTitle("Error")
                                                            .setDescription("Prompt cancelled.")
                                                            .setColor("0x2f3136")
                                                    ]
                                                });
                                            }
                                            if (images.first().content === 'skip') {
                                                const announceEmbed = new MessageEmbed()
                                                    .setTitle(title.first().content)
                                                    .setDescription(message.first().content)
                                                    .setColor("0x2f3136")
                                                channel.first().mentions.channels.first().send({ embeds: [announceEmbed] }).then(async () => {
                                                    let embed = new MessageEmbed()
                                                        .setTitle("Sent")
                                                        .setColor("0x2f3136")
                                                        .setDescription("Announcement sent");
                                                    await images.first().reply({ embeds: [embed] });
                                                }).catch(async () => {
                                                    let embed = new MessageEmbed()
                                                        .setTitle("Error")
                                                        .setColor("0x2f3136")
                                                        .setDescription("Unable to send announcement");
                                                    await images.first().reply({ embeds: [embed] });
                                                });
                                            } else {
                                                if (images.first().attachments.first()) {
                                                    const announceEmbed = new MessageEmbed()
                                                        .setTitle(title.first().content)
                                                        .setColor(groupRecord.design.embedColor)
                                                        .setDescription(message.first().content)
                                                        .setImage(images.first().attachments.first().url)
                                                    channel.first().mentions.channels.first().send({ embeds: [announceEmbed] }).then(async () => {
                                                        let embed = new MessageEmbed()
                                                            .setTitle("Sent")
                                                            .setColor("0x2f3136")
                                                            .setDescription("Announcement sent");
                                                        await images.first().reply({ embeds: [embed] });
                                                    }).catch(async () => {
                                                        let embed = new MessageEmbed()
                                                            .setTitle("Error")
                                                            .setColor("0x2f3136")
                                                            .setDescription("Unable to send announcement");
                                                        await images.first().reply({ embeds: [embed] });
                                                    });
                                                } else {
                                                    const announceEmbed = new MessageEmbed()
                                                        .setTitle(title.first().content)
                                                        .setColor("0x2f3136")
                                                        .setDescription(message.first().content)
                                                        .setImage(images.first().content)
                                                    channel.first().mentions.channels.first().send({ embeds: [announceEmbed] }).then(async () => {
                                                        let embed = new MessageEmbed()
                                                            .setTitle("Sent")
                                                            .setColor("0x2f3136")
                                                            .setDescription("Announcement sent");
                                                        await images.first().reply({ embeds: [embed] });
                                                    }).catch(async () => {
                                                        return images.first().reply({
                                                            embeds: [
                                                                new MessageEmbed()
                                                                    .setTitle("Error")
                                                                    .setDescription("Unable to send announcement")
                                                                    .setColor("0x2f3136")
                                                            ]
                                                        });
                                                    });
                                                };
                                            };
                                        });
                                    });
                                });
                            });
                        });
                    });
                } else {
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("Error")
                                .setDescription("You did not specify a channel.")
                                .setColor("0x2f3136")
                        ]
                    });
                };
            });
        });
    },
};
