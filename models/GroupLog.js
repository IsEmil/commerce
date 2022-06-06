const mongoose = require("mongoose");

const schema = new mongoose.Schema({

    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },

    action: {
        type: String,
        required: true,
    },

    user: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
    },

    created: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("GroupLog", schema);
