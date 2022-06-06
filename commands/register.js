const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, Guild, Interaction, MessageEmbed, MessageCollector, MessageActionRow, MessageButton, MessageSelectMenu, Permissions } = require("discord.js");

const GroupLog = require('../models/GroupLog.js');
const Group = require('../models/Group.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register your server'),
    /**
     * 
     * @param {Interaction} interaction 
     * @param {GuildMember} user 
     * @param {Guild} guild 
     */
    async execute(interaction, user, guild) {
        const groupRecord = await Group.findOne({ guild: interaction.guild.id }).exec();

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

        if (groupRecord) {
            console.log(`[${interaction.guild.id}]: Group found.`);

            let Embed = new MessageEmbed()
                .setTitle("Error")
                .setDescription("This server is already registered.")
                .setColor("0x2f3136");
            return interaction.reply({
                embeds: [Embed],
            });
        };

        let Embed = new MessageEmbed()
            .setTitle("Registering Server")
            .setDescription("We are currently creating your server's database. Please wait a moment.")
            .setColor("0x2f3136");
        interaction.reply({
            embeds: [Embed],
        });

        let Category = await interaction.guild.channels.create("Marketplace", {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                    deny: [Permissions.FLAGS.SEND_MESSAGES],
                },
            ],
        });

        let ChannelHire = await interaction.guild.channels.create("hiring", {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                    deny: [Permissions.FLAGS.SEND_MESSAGES],
                },
            ],
        });

        let ChannelSell = await interaction.guild.channels.create("selling", {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                    deny: [Permissions.FLAGS.SEND_MESSAGES],
                },
            ],
        });

        let ChannelFeed = await interaction.guild.channels.create("feedback", {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                    deny: [Permissions.FLAGS.SEND_MESSAGES],
                },
            ],
        });

        let ChannelAdve = await interaction.guild.channels.create("advertising", {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                    deny: [Permissions.FLAGS.SEND_MESSAGES],
                },
            ],
        });


        await ChannelAdve.setParent(Category);
        await ChannelFeed.setParent(Category);
        await ChannelHire.setParent(Category);
        await ChannelSell.setParent(Category);

        let AdvertiseEmbed = new MessageEmbed()
            .setTitle("Advertising")
            .setDescription("Run the `/advertise` slash command in an command channel, or press the button below to start advertising prompt.")
            .setColor("0x2f3136");
        ChannelAdve.send({
            embeds: [AdvertiseEmbed],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("advertise_prompt")
                        .setLabel('Advertise')
                        .setStyle('PRIMARY'),
                )
            ]
        }).then((msg) => {msg.pin()});

        let FeedbackEmbed = new MessageEmbed()
            .setTitle("Feedback")
            .setDescription("Run the `/feedback` slash command in an command channel, or press the button below to start feedback prompt.")
            .setColor("0x2f3136");
        ChannelFeed.send({
            embeds: [FeedbackEmbed],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("feedback_prompt")
                        .setLabel('Feedback')
                        .setStyle('PRIMARY'),
                )
            ]
        }).then((msg) => {msg.pin()});

        let HireEmbed = new MessageEmbed()
            .setTitle("Hiring")
            .setDescription("Run the `/hire` slash command in an command channel, or press the button below to start hiring prompt.")
            .setColor("0x2f3136");
        ChannelHire.send({
            embeds: [HireEmbed],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("hire_prompt")
                        .setLabel('Hire')
                        .setStyle('PRIMARY'),
                )
            ]
        }).then((msg) => {msg.pin()});

        let SellEmbed = new MessageEmbed()
            .setTitle("Selling")
            .setDescription("Run the `/sell` slash command in an command channel, or press the button below to start selling prompt.")
            .setColor("0x2f3136");
        ChannelSell.send({
            embeds: [SellEmbed],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("sell_prompt")
                        .setLabel('Sell')
                        .setStyle('PRIMARY'),
                )
            ]
        }).then((msg) => {msg.pin()});

        const groupNewRecord = new Group({
            guild: guild.id,
            channels: {
                advertise: ChannelAdve.id,
                feedback: ChannelFeed.id,
                hire: ChannelHire.id,
                sell: ChannelSell.id,
            },
        });

        await groupNewRecord.save();

        let EmbedSuccess = new MessageEmbed()
            .setTitle("Success")
            .setDescription("Your server has been registered.")
            .setColor("0x2f3136");
        interaction.editReply({
            embeds: [EmbedSuccess],
        });

        const groupLogRecord = await GroupLog({
            group: groupNewRecord._id,
            user: interaction.user.id,
            action: `Group has been created.`,
            role: "Owner",
        })

        await groupLogRecord.save();

        let EmbedOwner = new MessageEmbed()
            .setTitle("Commerce Details")
            .setDescription("These are your secret keys. Please keep them safe.")
            .addFields(
                { name: "Token", value: `||${groupNewRecord.keys.token}||`, inline: true },
                { name: "Api", value: `||${groupNewRecord.keys.apiKey}||`, inline: true },
            )
            .setColor("0x2f3136");
        interaction.user.send({
            embeds: [EmbedOwner],
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel('Dashboard')
                        .setURL(`https://intelect.cc/commerce/dashboard/${groupNewRecord.keys.apiKey}`)
                        .setStyle('LINK'),
                )
            ]
        });
    },
};
