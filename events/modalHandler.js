const { default: discord, MessageActionRow, MessageEmbed, Modal, TextInputComponent, MessageButton } = require("discord.js");

const noblox = require("noblox.js");

const GroupLog = require('../models/GroupLog.js');
const Group = require('../models/Group.js');

function makerating(length) {
    var result = "";
    var characters = '⭐'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * @param {discord.Client} client
 */
module.exports = exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === "advertiseModal") {
            const groupRecord = await Group.findOne({ guild: interaction.guild.id }).exec();

            if (!groupRecord) {
                console.log(`[${interaction.guild.id}]: Group not found.`);

                let Embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("This server is not registered.")
                    .setColor("0x2f3136");
                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true
                });
            };

            const groupName = interaction.fields.getTextInputValue('groupName');
            const groupDescription = interaction.fields.getTextInputValue('groupDescription');
            const groupImage = interaction.fields.getTextInputValue('groupImage');
            const discordInvite = interaction.fields.getTextInputValue('discordInvite');
            const robloxGroup = interaction.fields.getTextInputValue('robloxGroup');

            const Embed = new MessageEmbed()
                .setTitle(groupName)
                .setDescription(groupDescription)
                .setThumbnail(await noblox.getLogo(robloxGroup))
                .setImage(groupImage === "skip" ? "" : groupImage)
                .setColor(groupRecord.design.embedColor)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL() });
            client.guilds.cache.get(interaction.guild.id).channels.cache.get(groupRecord.channels.advertise).send({
                embeds: [Embed],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel('Discord')
                                .setURL(discordInvite.startsWith("https://discord.gg/") ? discordInvite : `https://discord.gg/${discordInvite}`)
                                .setStyle('LINK'),
                            new MessageButton()
                                .setLabel('Roblox')
                                .setURL(`https://roblox.com/groups/${robloxGroup}`)
                                .setStyle('LINK'),
                        )
                ]
            }).then((msg) => {
                let Embed = new MessageEmbed()
                    .setTitle("Success")
                    .setDescription(`Your advertisement prompt has been sent to the group.`)
                    .setColor("0x2f3136");
                interaction.reply({
                    embeds: [Embed],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setLabel('Jump to message')
                                .setURL(`https://discord.com/channels/@me/${msg.channelId}/${msg.id}`)
                                .setStyle('LINK'),
                        )
                    ],
                    ephemeral: true
                })
            }).catch(() => {
                let Embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("An error occured while sending the advertisement.")
                    .setColor("0x2f3136");
                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true
                });
            });
        };

        if (interaction.customId === "feedbackModal") {
            const groupRecord = await Group.findOne({ guild: interaction.guild.id }).exec();

            if (!groupRecord) {
                console.log(`[${interaction.guild.id}]: Group not found.`);

                let Embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("This server is not registered.")
                    .setColor("0x2f3136");
                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true
                });
            };

            const productName = interaction.fields.getTextInputValue('productName');
            const productReview = interaction.fields.getTextInputValue('productReview');
            const productRating = interaction.fields.getTextInputValue('productRating')
            const productImage = interaction.fields.getTextInputValue('productImage');

            if (isNaN(parseFloat(productRating))) {
                let Embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("Please enter a valid rating.")
                    .setColor("0x2f3136");
                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true
                });
            };

            const Embed = new MessageEmbed()
                .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL() })
                .addFields(
                    { name: "Product", value: productName },
                    { name: "Review", value: productReview },
                    { name: "Rating", value: makerating(productRating) },
                )
                .setImage(productImage === "skip" ? "" : productImage)
                .setColor(groupRecord.design.embedColor)
            client.guilds.cache.get(interaction.guild.id).channels.cache.get(groupRecord.channels.feedback).send({
                embeds: [Embed],
            }).then((msg) => {
                let Embed = new MessageEmbed()
                    .setTitle("Success")
                    .setDescription(`Your feedback prompt has been sent to the group.`)
                    .setColor("0x2f3136");
                interaction.reply({
                    embeds: [Embed],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setLabel('Jump to message')
                                .setURL(`https://discord.com/channels/@me/${msg.channelId}/${msg.id}`)
                                .setStyle('LINK'),
                        )
                    ],
                    ephemeral: true
                })
            }).catch(() => {
                let Embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("An error occured while sending the feedback.")
                    .setColor("0x2f3136");
                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true
                });
            });
        };

        if (interaction.customId === "hireModal") {
            const groupRecord = await Group.findOne({ guild: interaction.guild.id }).exec();

            if (!groupRecord) {
                console.log(`[${interaction.guild.id}]: Group not found.`);

                let Embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("This server is not registered.")
                    .setColor("0x2f3136");
                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true
                });
            };

            const staffName = interaction.fields.getTextInputValue('staffName');
            const staffDescription = interaction.fields.getTextInputValue('staffDescription');
            const staffPayment = interaction.fields.getTextInputValue('staffPayment')
            const staffRequirements = interaction.fields.getTextInputValue('staffRequirements');
            const staffImage = interaction.fields.getTextInputValue('staffImage');
            
            const Embed = new MessageEmbed()
                .setTitle(`Hiring: ${staffName}`)
                .addFields(
                    { name: "Description", value: staffDescription },
                    { name: "Payment", value: staffPayment },
                    { name: "Requirements", value: staffRequirements },
                    { name: `Contact`, value: `${interaction.user.username}#${interaction.user.discriminator}` }
                )
                .setImage(staffImage === "skip" ? "" : staffImage)
                .setColor(groupRecord.design.embedColor);
            client.guilds.cache.get(interaction.guild.id).channels.cache.get(groupRecord.channels.hire).send({
                embeds: [Embed],
            }).then((msg) => {
                let Embed = new MessageEmbed()
                    .setTitle("Success")
                    .setDescription(`Your hiring prompt has been sent to the group.`)
                    .setColor("0x2f3136");
                interaction.reply({
                    embeds: [Embed],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setLabel('Jump to message')
                                .setURL(`https://discord.com/channels/@me/${msg.channelId}/${msg.id}`)
                                .setStyle('LINK'),
                        )
                    ],
                    ephemeral: true
                })
            }).catch(() => {
                let Embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("An error occured while sending the hiring.")
                    .setColor("0x2f3136");
                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true
                });
            });
        };

        if (interaction.customId === "sellModal") {
            const groupRecord = await Group.findOne({ guild: interaction.guild.id }).exec();

            if (!groupRecord) {
                console.log(`[${interaction.guild.id}]: Group not found.`);

                let Embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("This server is not registered.")
                    .setColor("0x2f3136");
                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true
                });
            };

            const productName = interaction.fields.getTextInputValue('productName');
            const productDescription = interaction.fields.getTextInputValue('productDescription');
            const productPrice = interaction.fields.getTextInputValue('productPrice')
            const productImage = interaction.fields.getTextInputValue('productImage');
            
            const Embed = new MessageEmbed()
                .setTitle(`Selling: ${productName}`)
                .addFields(
                    { name: "Description", value: productDescription },
                    { name: "Price", value: productPrice },
                    { name: `Contact`, value: `${interaction.user.username}#${interaction.user.discriminator}` }
                )
                .setImage(productImage === "skip" ? "" : productImage)
                .setColor(groupRecord.design.embedColor);
            client.guilds.cache.get(interaction.guild.id).channels.cache.get(groupRecord.channels.sell).send({
                embeds: [Embed],
            }).then((msg) => {
                let Embed = new MessageEmbed()
                    .setTitle("Success")
                    .setDescription(`Your selling prompt has been sent to the group.`)
                    .setColor("0x2f3136");
                interaction.reply({
                    embeds: [Embed],
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setLabel('Jump to message')
                                .setURL(`https://discord.com/channels/@me/${msg.channelId}/${msg.id}`)
                                .setStyle('LINK'),
                        )
                    ],
                    ephemeral: true
                })
            }).catch(() => {
                let Embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("An error occured while sending the selling.")
                    .setColor("0x2f3136");
                return interaction.reply({
                    embeds: [Embed],
                    ephemeral: true
                });
            });
        };
    });
};