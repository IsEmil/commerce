const { default: discord, MessageActionRow, Modal, TextInputComponent } = require("discord.js");

const config = require("../config");

/**
 * @param {discord.Client} client
 */
module.exports = exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (interaction.customId === "advertise_prompt") {
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
                            .setLabel("What is the image URL of the group? (Skip)")
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
        }

        if (interaction.customId === "sell_prompt") {
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
                            .setLabel("What is the image URL of the product? (Skip)")
                            .setStyle('SHORT')
                            .setRequired(true)
                    ),
            );

            await interaction.showModal(modal);
        }

        if (interaction.customId === "hire_prompt") {
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
                            .setLabel("What is the image URL of the job? (Skip)")
                            .setStyle('SHORT')
                            .setRequired(true)
                    ),
            );

            await interaction.showModal(modal);
        }

        if (interaction.customId === "feedback_prompt") {
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
                            .setLabel("What is the image URL of the product? (Skip)")
                            .setStyle('SHORT')
                            .setRequired(true)
                    ),
            );

            await interaction.showModal(modal);
        }
    });
};