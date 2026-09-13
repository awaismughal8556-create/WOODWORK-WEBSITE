const express = require("express");

const Order = require("../models/order");

const router = express.Router();

/* ================= CREATE ORDER ================= */

router.post("/", async (req, res) => {
    try {
        const {
            fullName,
            email,
            whatsapp,
            businessName,
            websiteType,
            budget,
            projectDetails
        } = req.body;

        if (
            !fullName ||
            !email ||
            !whatsapp ||
            !budget ||
            !projectDetails
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const order = await Order.create({
            fullName,
            email,
            whatsapp,
            businessName,
            websiteType,
            budget,
            projectDetails
        });

        res.status(201).json({
            success: true,
            message: "Order submitted successfully!",
            order
        });

    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error while creating order.",
            error: error.message
        });
    }
});


/* ================= GET ALL ORDERS ================= */

router.get("/", async (req, res) => {
    try {
        const orders = await Order
            .find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("GET ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders."
        });
    }
});


/* ================= GET SINGLE ORDER ================= */

router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch order."
        });
    }
});


/* ================= UPDATE STATUS ================= */

router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Completed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status."
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        res.json({
            success: true,
            message: "Order status updated.",
            order
        });

    } catch (error) {
        console.error("UPDATE STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update status."
        });
    }
});


/* ================= DELETE ORDER ================= */

router.delete("/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        res.json({
            success: true,
            message: "Order deleted successfully."
        });

    } catch (error) {
        console.error("DELETE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete order."
        });
    }
});


module.exports = router;