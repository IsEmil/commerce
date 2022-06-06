module.exports = {

    discord : {
        token: process.env.DISCORD_TOKEN,
        secret: process.env.DISCORD_SECRET,

        guild: "",
        bot_channel: "",
    },

    database: {
        url: process.env.DATABASE_URI,
    }
};
