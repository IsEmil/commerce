const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, Guild, Interaction, MessageEmbed, MessageCollector, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

const crypto = require("crypto")

const GroupLog = require('../models/GroupLog.js');
const Group = require('../models/Group.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Configure and view settings'),
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
            .setTitle("Settings")
            .setDescription("Please select an option below to edit")
            .setColor("0x2f3136");
        interaction.reply({
            embeds: [Embed],
            components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId('settings_menu')
                        .setPlaceholder('Select an option to edit')
                        .addOptions([
                            {
                                label: 'Discord Settings',
                                description: 'Configure your Discord settings',
                                value: 'discord_settings',
                            },
                            {
                                label: 'Group Settings',
                                description: 'Configure your Group settings',
                                value: 'group_settings',
                            },
                            {
                                label: 'Secret Keys',
                                description: 'View or Configure your Secret Keys',
                                value: 'secret_keys',
                            },
                        ]),
                )
            ]
        }).then(() => {
            interaction.channel.awaitMessageComponent({ filterButton, componentType: 'SELECT_MENU', time: 60000 }).then((menuReply) => {
                menuReply["values"].forEach((id) => {
                    if (id === "discord_settings") {
                        console.log(`[${interaction.guild.id}]: Selected Discord Settings`);

                        let Embed = new MessageEmbed()
                            .setTitle("Discord Settings")
                            .setDescription("Please select a discord settings option")
                            .setColor("0x2f3136");
                        menuReply.update({
                            embeds: [Embed],
                            components: [
                                new MessageActionRow().addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId('discord_settings')
                                        .setPlaceholder('Select an option to edit')
                                        .addOptions([
                                            {
                                                label: 'Staff Role',
                                                description: groupRecord.configuration.staffRole,
                                                value: 'staff_role',
                                            },
                                            {
                                                label: 'Log Channel',
                                                description: groupRecord.channels.logs,
                                                value: 'log_channel',
                                            },
                                            {
                                                label: 'Hire Channel',
                                                description: groupRecord.channels.hire,
                                                value: 'hire_channel',
                                            },
                                            {
                                                label: 'Sell Channel',
                                                description: groupRecord.channels.sell,
                                                value: 'sell_channel',
                                            },
                                            {
                                                label: 'Advertise Channel',
                                                description: groupRecord.channels.advertise,
                                                value: 'advertise_channel',
                                            },
                                        ]),
                                )
                            ]
                        })

                        interaction.channel.awaitMessageComponent({ filterButton, componentType: 'SELECT_MENU', time: 60000 }).then((menuReply) => {
                            menuReply["values"].forEach((id) => {
                                if (id === "staff_role") {
                                    let Embed = new MessageEmbed()
                                        .setTitle("Staff Role")
                                        .setDescription("Please enter the staff role below\n**You must tag the staff role with @.**")
                                        .setColor("0x2f3136")
                                        .setFooter({ text: "To cancel this prompt type `cancel`" });
                                    menuReply.update({ embeds: [Embed], components: [] })
                                    interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (staffRole) => {
                                        if (staffRole.first().content === "cancel") {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Cancelled")
                                                .setDescription("This prompt was cancelled by the user")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        } else if (staffRole.first().content.startsWith('<@&') && staffRole.first().content.endsWith('>')) {
                                            if (interaction.guild.roles.cache.find(role => role.id === staffRole.first().content.slice(3, -1))) {
                                                const groupStaffRecord = await Group.findOneAndUpdate({ _id: groupRecord._id }, { $set: { "configuration.staffRole": staffRole.first().content.slice(3, -1).toString() } }, { new: true });
                                                const groupLogRecord = await GroupLog({
                                                    group: groupRecord._id,
                                                    user: interaction.user.id,
                                                    action: `Changed Staff Role to ${staffRole.first().content.slice(3, -1)}`,
                                                    role: "Staff",
                                                })

                                                await groupLogRecord.save();

                                                let Embed = new MessageEmbed()
                                                    .setTitle("Success")
                                                    .setDescription("Staff role updated")
                                                    .addFields(
                                                        { name: "Staff Role", value: groupStaffRecord.configuration.staffRole, inline: true },
                                                    )
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            } else {
                                                let Embed = new MessageEmbed()
                                                    .setTitle("Error")
                                                    .setDescription("The staff role you entered is not a valid role")
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            }
                                        } else {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Error")
                                                .setDescription("The staff role you entered is not a valid role")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        }
                                    });
                                } else if (id === "log_channel") {
                                    let Embed = new MessageEmbed()
                                        .setTitle("Log Channel")
                                        .setDescription("Please enter the log channel below\n**You must tag the channel with #.**")
                                        .setColor("0x2f3136")
                                        .setFooter({ text: "To cancel this prompt type `cancel`" });
                                    menuReply.update({ embeds: [Embed], components: [] })
                                    interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (logChannel) => {
                                        if (logChannel.first().content === "cancel") {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Cancelled")
                                                .setDescription("This prompt was cancelled by the user")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        } else if (logChannel.first().content.startsWith('<#') && logChannel.first().content.endsWith('>')) {
                                            if (interaction.guild.channels.cache.find(channel => channel.id === logChannel.first().content.slice(2, -1))) {
                                                const groupLogsRecord = await Group.findOneAndUpdate({ _id: groupRecord._id }, { $set: { "channels.logs": logChannel.first().content.slice(2, -1).toString() } }, { new: true });
                                                const groupLogRecord = await GroupLog({
                                                    group: groupRecord._id,
                                                    user: interaction.user.id,
                                                    action: `Changed Log Channel to #${interaction.guild.channels.cache.find(channel => channel.id === logChannel.first().content.slice(2, -1)).name} (${logChannel.first().content.slice(2, -1)})`,
                                                    role: "Staff",
                                                })

                                                await groupLogRecord.save();

                                                let Embed = new MessageEmbed()
                                                    .setTitle("Success")
                                                    .setDescription("Log channel updated")
                                                    .addFields(
                                                        { name: "Log Channel", value: groupLogsRecord.channels.logs, inline: true },
                                                    )
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            } else {
                                                let Embed = new MessageEmbed()
                                                    .setTitle("Error")
                                                    .setDescription("The log channel you entered is not a valid channel")
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            }
                                        } else {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Error")
                                                .setDescription("The log channel you entered is not a valid channel")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        }
                                    });
                                } else if (id === "hire_channel") {
                                    let Embed = new MessageEmbed()
                                        .setTitle("Hire Channel")
                                        .setDescription("Please enter the hire channel below\n**You must tag the channel with #.**")
                                        .setColor("0x2f3136")
                                        .setFooter({ text: "To cancel this prompt type `cancel`" });
                                    menuReply.update({ embeds: [Embed], components: [] })
                                    interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (hireChannel) => {
                                        if (hireChannel.first().content === "cancel") {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Cancelled")
                                                .setDescription("This prompt was cancelled by the user")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        } else if (hireChannel.first().content.startsWith('<#') && hireChannel.first().content.endsWith('>')) {
                                            if (interaction.guild.channels.cache.find(channel => channel.id === hireChannel.first().content.slice(2, -1))) {
                                                const groupHireRecord = await Group.findOneAndUpdate({ _id: groupRecord._id }, { $set: { "channels.hire": hireChannel.first().content.slice(2, -1).toString() } }, { new: true });
                                                const groupLogRecord = await GroupLog({
                                                    group: groupRecord._id,
                                                    user: interaction.user.id,
                                                    action: `Changed Hire Channel to #${interaction.guild.channels.cache.find(channel => channel.id === hireChannel.first().content.slice(2, -1)).name} (${hireChannel.first().content.slice(2, -1)})`,
                                                    role: "Staff",
                                                })

                                                await groupLogRecord.save();

                                                let Embed = new MessageEmbed()
                                                    .setTitle("Success")
                                                    .setDescription("Hire channel updated")
                                                    .addFields(
                                                        { name: "Hire Channel", value: groupHireRecord.channels.hire, inline: true },
                                                    )
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            } else {
                                                let Embed = new MessageEmbed()
                                                    .setTitle("Error")
                                                    .setDescription("The hire channel you entered is not a valid channel")
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            }
                                        } else {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Error")
                                                .setDescription("The hire channel you entered is not a valid channel")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        }
                                    });
                                } else if (id === "sell_channel") {
                                    let Embed = new MessageEmbed()
                                        .setTitle("Sell Channel")
                                        .setDescription("Please enter the sell channel below\n**You must tag the channel with #.**")
                                        .setColor("0x2f3136")
                                        .setFooter({ text: "To cancel this prompt type `cancel`" });
                                    menuReply.update({ embeds: [Embed], components: [] })
                                    interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (sellChannel) => {
                                        if (sellChannel.first().content === "cancel") {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Cancelled")
                                                .setDescription("This prompt was cancelled by the user")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        } else if (sellChannel.first().content.startsWith('<#') && sellChannel.first().content.endsWith('>')) {
                                            if (interaction.guild.channels.cache.find(channel => channel.id === sellChannel.first().content.slice(2, -1))) {
                                                const groupSellRecord = await Group.findOneAndUpdate({ _id: groupRecord._id }, { $set: { "channels.sell": sellChannel.first().content.slice(2, -1).toString() } }, { new: true });
                                                const groupLogRecord = await GroupLog({
                                                    group: groupRecord._id,
                                                    user: interaction.user.id,
                                                    action: `Changed Sell Channel to #${interaction.guild.channels.cache.find(channel => channel.id === sellChannel.first().content.slice(2, -1)).name} (${sellChannel.first().content.slice(2, -1)})`,
                                                    role: "Staff",
                                                })

                                                await groupLogRecord.save();

                                                let Embed = new MessageEmbed()
                                                    .setTitle("Success")
                                                    .setDescription("Sell channel updated")
                                                    .addFields(
                                                        { name: "Sell Channel", value: groupSellRecord.channels.sell, inline: true },
                                                    )
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            } else {
                                                let Embed = new MessageEmbed()
                                                    .setTitle("Error")
                                                    .setDescription("The sell channel you entered is not a valid channel")
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            }
                                        } else {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Error")
                                                .setDescription("The sell channel you entered is not a valid channel")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        }
                                    });
                                } else if (id === "advertise_channel") {
                                    let Embed = new MessageEmbed()
                                        .setTitle("Advertise Channel")
                                        .setDescription("Please enter the advertise channel below\n**You must tag the channel with #.**")
                                        .setColor("0x2f3136")
                                        .setFooter({ text: "To cancel this prompt type `cancel`" });
                                    menuReply.update({ embeds: [Embed], components: [] })
                                    interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (advertiseChannel) => {
                                        if (advertiseChannel.first().content === "cancel") {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Cancelled")
                                                .setDescription("This prompt was cancelled by the user")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        } else if (advertiseChannel.first().content.startsWith('<#') && advertiseChannel.first().content.endsWith('>')) {
                                            if (interaction.guild.channels.cache.find(channel => channel.id === advertiseChannel.first().content.slice(2, -1))) {
                                                const groupAdvertiseRecord = await Group.findOneAndUpdate({ _id: groupRecord._id }, { $set: { "channels.advertise": advertiseChannel.first().content.slice(2, -1).toString() } }, { new: true });
                                                const groupLogRecord = await GroupLog({
                                                    group: groupRecord._id,
                                                    user: interaction.user.id,
                                                    action: `Changed Advertise Channel to #${interaction.guild.channels.cache.find(channel => channel.id === advertiseChannel.first().content.slice(2, -1)).name} (${advertiseChannel.first().content.slice(2, -1)})`,
                                                    role: "Staff",
                                                })

                                                await groupLogRecord.save();

                                                let Embed = new MessageEmbed()
                                                    .setTitle("Success")
                                                    .setDescription("Advertise channel updated")
                                                    .addFields(
                                                        { name: "Advertise Channel", value: groupAdvertiseRecord.channels.advertise, inline: true },
                                                    )
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            } else {
                                                let Embed = new MessageEmbed()
                                                    .setTitle("Error")
                                                    .setDescription("The advertise channel you entered is not a valid channel")
                                                    .setColor("0x2f3136");
                                                return interaction.editReply({ embeds: [Embed] });
                                            }
                                        } else {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Error")
                                                .setDescription("The advertise channel you entered is not a valid channel")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        }
                                    });
                                }
                            });
                        });
                    } else if (id === "group_settings") {
                        console.log(`[${interaction.guild.id}]: Selected Group Settings`);

                        let Embed = new MessageEmbed()
                            .setTitle("Group Settings")
                            .setDescription("Please select a group settings option")
                            .setColor("0x2f3136");
                        menuReply.update({
                            embeds: [Embed],
                            components: [
                                new MessageActionRow().addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId('group_settings')
                                        .setPlaceholder('Select an option to edit')
                                        .addOptions([
                                            {
                                                label: 'Group Name',
                                                description: groupRecord.configuration.name,
                                                value: 'group_name',
                                            },
                                            {
                                                label: 'Group Description',
                                                description: groupRecord.configuration.description,
                                                value: 'group_description',
                                            },
                                            {
                                                label: 'Embed Color',
                                                description: groupRecord.design.embedColor,
                                                value: 'embed_color',
                                            },
                                        ]),
                                )
                            ]
                        });

                        interaction.channel.awaitMessageComponent({ filterButton, componentType: 'SELECT_MENU', time: 60000 }).then((menuReply) => {
                            menuReply["values"].forEach((id) => {
                                if (id === "group_name") {
                                    let Embed = new MessageEmbed()
                                        .setTitle("Group Name")
                                        .setDescription("Please enter the group name below.")
                                        .setColor("0x2f3136")
                                        .setFooter({ text: "To cancel this prompt type `cancel`" });
                                    menuReply.update({ embeds: [Embed], components: [] })
                                    interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (groupName) => {
                                        if (groupName.first().content === "cancel") {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Cancelled")
                                                .setDescription("This prompt was cancelled by the user")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        } else {
                                            const groupNameRecord = await Group.findOneAndUpdate({ _id: groupRecord._id }, { $set: { "configuration.name": groupName.first().content } }, { new: true });
                                            const groupLogRecord = await GroupLog({
                                                group: groupRecord._id,
                                                user: interaction.user.id,
                                                action: `Changed Group Name to ${groupName.first().content}`,
                                                role: "Staff",
                                            })

                                            await groupLogRecord.save();

                                            let Embed = new MessageEmbed()
                                                .setTitle("Success")
                                                .setDescription("Group name updated")
                                                .addFields(
                                                    { name: "Group Name", value: groupNameRecord.configuration.name, inline: true },
                                                )
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        }
                                    });
                                } else if (id === "group_description") {
                                    let Embed = new MessageEmbed()
                                        .setTitle("Group Description")
                                        .setDescription("Please enter the group description below.")
                                        .setColor("0x2f3136")
                                        .setFooter({ text: "To cancel this prompt type `cancel`" });
                                    menuReply.update({ embeds: [Embed], components: [] })
                                    interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (groupDescription) => {
                                        if (groupDescription.first().content === "cancel") {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Cancelled")
                                                .setDescription("This prompt was cancelled by the user")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        } else {
                                            const groupDescRecord = await Group.findOneAndUpdate({ _id: groupRecord._id }, { $set: { "configuration.description": groupDescription.first().content } }, { new: true });
                                            const groupLogRecord = await GroupLog({
                                                group: groupRecord._id,
                                                user: interaction.user.id,
                                                action: `Changed Group Description to ${groupDescription.first().content}`,
                                                role: "Staff",
                                            })

                                            await groupLogRecord.save();

                                            let Embed = new MessageEmbed()
                                                .setTitle("Success")
                                                .setDescription("Group description updated")
                                                .addFields(
                                                    { name: "Group Description", value: groupDescRecord.configuration.description, inline: true },
                                                )
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        }
                                    });
                                } else if (id === "embed_color") {
                                    let Embed = new MessageEmbed()
                                        .setTitle("Embed Color")
                                        .setDescription("Please enter the embed color below\n**You must have with #.**")
                                        .setColor("0x2f3136")
                                        .setFooter({ text: "To cancel this prompt type `cancel`" });
                                    menuReply.update({ embeds: [Embed], components: [] })
                                    interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (embedColor) => {
                                        if (embedColor.first().content === "cancel") {
                                            let Embed = new MessageEmbed()
                                                .setTitle("Cancelled")
                                                .setDescription("This prompt was cancelled by the user")
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        } else {
                                            const groupDescRecord = await Group.findOneAndUpdate({ _id: groupRecord._id }, { $set: { "design.embedColor": embedColor.first().content } }, { new: true });
                                            const groupLogRecord = await GroupLog({
                                                group: groupRecord._id,
                                                user: interaction.user.id,
                                                action: `Changed Embed Color to ${embedColor.first().content}`,
                                                role: "Staff",
                                            })

                                            await groupLogRecord.save();

                                            let Embed = new MessageEmbed()
                                                .setTitle("Success")
                                                .setDescription("Embed Color updated")
                                                .addFields(
                                                    { name: "Embed Color", value: groupDescRecord.design.embedColor, inline: true },
                                                )
                                                .setColor("0x2f3136");
                                            return interaction.editReply({ embeds: [Embed] });
                                        }
                                    });
                                }
                            });
                        });
                    } else if (id === "secret_keys") {
                        console.log(`[${interaction.guild.id}]: Selected Secret Keys`);

                        let Embed = new MessageEmbed()
                            .setTitle("Secret Keys")
                            .setDescription("Please select a option")
                            .setColor("0x2f3136");
                        menuReply.update({
                            embeds: [Embed],
                            components: [
                                new MessageActionRow().addComponents(
                                    new MessageButton()
                                        .setCustomId('token_key')
                                        .setLabel('Send Token Key')
                                        .setStyle('SUCCESS'),
                                    new MessageButton()
                                        .setCustomId('apikey_key')
                                        .setLabel('Send Api Key')
                                        .setStyle('SUCCESS'),
                                    new MessageButton()
                                        .setCustomId('key_reset')
                                        .setLabel('Reset Keys')
                                        .setStyle('DANGER'),
                                    new MessageButton()
                                        .setCustomId('cancel')
                                        .setLabel('Cancel')
                                        .setStyle('DANGER'),
                                )
                            ]
                        });

                        interaction.channel.awaitMessageComponent({ filterButton, componentType: 'BUTTON', time: 60000 }).then(async (menuReply) => {
                            if (menuReply.customId === "token_key") {
                                menuReply.deferUpdate();

                                let EmbedOwner = new MessageEmbed()
                                    .setTitle("Your Token Key")
                                    .setDescription("This is your token key. Please keep it safe.")
                                    .addFields(
                                        { name: "Token", value: `||${groupRecord.keys.token}||`, inline: true },
                                    )
                                    .setColor("0x2f3136");
                                interaction.user.send({
                                    embeds: [EmbedOwner]
                                });
                            } else if (menuReply.customId === "apikey_key") {
                                menuReply.deferUpdate();

                                let EmbedOwner = new MessageEmbed()
                                    .setTitle("Your Api Key")
                                    .setDescription("This is your api key. Please keep it safe.")
                                    .addFields(
                                        { name: "Api", value: `||${groupRecord.keys.apiKey}||`, inline: true },
                                    )
                                    .setColor("0x2f3136");
                                interaction.user.send({
                                    embeds: [EmbedOwner]
                                });
                            } else if (menuReply.customId === "key_reset") {
                                const groupNewTokenRecord = await Group.findOneAndUpdate({ _id: groupRecord._id }, { $set: { "keys.token": crypto.randomBytes(16).toString("hex"), "keys.apiKey": crypto.randomBytes(16).toString("hex") } }, { new: true });
                                const groupLogRecord = await GroupLog({
                                    group: groupRecord._id,
                                    user: interaction.user.id,
                                    action: `Reset Keys to ${groupNewTokenRecord.keys.token} & ${groupNewTokenRecord.keys.apiKey}`,
                                    role: "Staff",
                                })

                                await groupLogRecord.save();

                                menuReply.deferUpdate();

                                let EmbedOwner = new MessageEmbed()
                                    .setTitle("Your New Keys")
                                    .setDescription("This is your new keys. Please keep it safe.")
                                    .addFields(
                                        { name: "Token", value: `||${groupNewTokenRecord.keys.token}||`, inline: true },
                                        { name: "Api", value: `||${groupNewTokenRecord.keys.apiKey}||`, inline: true },
                                    )
                                    .setColor("0x2f3136");
                                interaction.user.send({
                                    embeds: [EmbedOwner]
                                });
                            } else if (menuReply.customId === "cancel") {
                                let Embed = new MessageEmbed()
                                    .setTitle("Cancelled")
                                    .setDescription("This prompt was cancelled by the user")
                                    .setColor("0x2f3136");
                                return menuReply.update({ embeds: [Embed], components: [] });
                            }
                        }).catch((err) => {
                            console.log(`[${interaction.guild.id}]: ${err.toString()}`)

                            let Embed = new MessageEmbed()
                                .setTitle("Cancelled")
                                .setDescription("Collector received no interactions before ending because it timed out.")
                                .setColor("0x2f3136");
                            return interaction.reply({ embeds: [Embed] })
                        });
                    }
                })
            }).catch((err) => {
                console.log(`[${interaction.guild.id}]: ${err.toString()}`)

                let Embed = new MessageEmbed()
                    .setTitle("Cancelled")
                    .setDescription("Collector received no interactions before ending because it timed out.")
                    .setColor("0x2f3136");
                return interaction.reply({ embeds: [Embed] })
            });
        });
    },
};
