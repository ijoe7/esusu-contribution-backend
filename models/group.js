const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            }
        ],
        private: {
            type: Boolean,
            default: false,
        },
        uniqueKey: {
            type: String
        },
        totalAmount: {
            type: Number,
            default: 0
        },
        contributions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "contribution",
            }
        ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("group", groupSchema);
