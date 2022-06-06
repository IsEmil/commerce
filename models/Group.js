const mongoose = require("mongoose");
const crypto = require("crypto");

const schema = new mongoose.Schema({

    guild: {
        type: String,
        default: "0",
    },

    keys: {
        token: {
            type: String,
            default: () => crypto.randomBytes(16).toString("hex"),
        },

        apiKey: {
            type: String,
            default: () => crypto.randomBytes(16).toString("hex"),
        },
    },

    configuration: {
        name: {
            type: String,
            default: "an Commerce v1 group",
        },
    
        description: {
            type: String,
            default: "an Commerce v1 group",
        },

        staffRole: {
            type: String,
            default: "0",
        },
    },

    commands: {
        advertise: {
            type: Boolean,
            default: true,
        },

        feedback: {
            type: Boolean,
            default: true,
        },

        hire: {
            type: Boolean,
            default: true,
        },
        
        sell: {
            type: Boolean,
            default: true,
        },
    },

    channels: {
        advertise: {
            type: String,
            default: "0",
        },

        feedback: {
            type: String,
            default: "0",
        },

        hire: {
            type: String,
            default: "0",
        },
        
        sell: {
            type: String,
            default: "0",
        },

        supportCategory: {
            type: String,
            default: "0",
        },

        supportTranscript: {
            type: String,
            default: "0",
        },

        logs: {
            type: String,
            default: "0",
        },
    },

    design: {
        embedColor: {
            type: String,
            maxlength: [20, "Embed color cannot be longer than 20 characters"],
            default: "0x2f3136",
        },
    },

    created: {
        type: Date,
        default: Date.now,
    },
});

schema.set("toJSON", { virtuals: true });

schema.virtual("logs", {
    ref: "GroupLog",
    localField: "_id",
    foreignField: "group",
});

module.exports = mongoose.model("Group", schema);
