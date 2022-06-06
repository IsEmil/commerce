const mongoose = require("mongoose");

module.exports = exports = () => {
    return new Promise(async (resolve, reject) => {
        await mongoose.connect("mongodb://IntelectDB:Ea7efacdgg52348vYDBiZ6h@70.34.204.187:27017/?authMechanism=DEFAULT", {
            useUnifiedTopology: true 
        });
        console.log("Connected to MongoDB");
        resolve();
    });
};