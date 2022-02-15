const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "group",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        }

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("contribution", contributionSchema);
