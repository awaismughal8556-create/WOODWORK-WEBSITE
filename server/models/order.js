const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        whatsapp: {
            type: String,
            required: true,
            trim: true
        },

        businessName: {
            type: String,
            default: "",
            trim: true
        },

        websiteType: {
            type: String,
            default: "",
            trim: true
        },

        budget: {
            type: String,
            required: true,
            trim: true
        },

        projectDetails: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Completed",
                "Cancelled"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);