require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();

const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================
app.use(cors({
    origin: "https://woodwork-website-production.up.railway.app",
    credentials: true
}));

app.use(express.json());
app.use(
    "/admin",
    express.static(path.join(__dirname, "../admin"))
);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "woodwork_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 4 * 60 * 60 * 1000
        }
    })
);

// ================= ORDER MODEL =================

const orderSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        projectType: {
            type: String,
            required: true
        },

        budget: {
            type: String,
            required: true
        },

        projectDetails: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

// ================= HOME =================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Woodwork Website Backend Running"
    });
});

// ================= ADMIN LOGIN =================

app.post("/api/admin/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordHash = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        const passwordMatch = await bcrypt.compare(
            password,
            passwordHash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        req.session.adminId = "admin";

        res.json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {

        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});

// ================= CHECK LOGIN =================

app.get("/api/admin/check", (req, res) => {

    if (!req.session.adminId) {
        return res.status(401).json({
            success: false,
            loggedIn: false
        });
    }

    res.json({
        success: true,
        loggedIn: true
    });
});

// ================= LOGOUT =================

app.post("/api/admin/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            success: true,
            message: "Logged out successfully"
        });

    });
});

// ================= ADMIN SECURITY =================

function requireAdmin(req, res, next) {

    if (!req.session.adminId) {
        return res.status(401).json({
            success: false,
            message: "Admin login required"
        });
    }

    next();
}

// ================= CREATE ORDER =================

app.post("/api/orders", async (req, res) => {

    try {

        const {
            fullName,
            email,
            phone,
            projectType,
            budget,
            projectDetails
        } = req.body;

        if (
            !fullName ||
            !email ||
            !phone ||
            !projectType ||
            !budget ||
            !projectDetails
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const order = await Order.create({
            fullName,
            email,
            phone,
            projectType,
            budget,
            projectDetails
        });

        res.status(201).json({
            success: true,
            message: "Order submitted successfully",
            order
        });

    } catch (error) {

        console.error("Create Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create order"
        });
    }
});

// ================= GET ORDERS =================

app.get("/api/orders", requireAdmin, async (req, res) => {

    try {

        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {

        console.error("Get Orders Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
});

// ================= UPDATE ORDER =================

app.put("/api/orders/:id", requireAdmin, async (req, res) => {

    try {

        const { status } = req.body;

        if (!["Pending", "Completed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order updated",
            order
        });

    } catch (error) {

        console.error("Update Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order"
        });
    }
});

// ================= DELETE ORDER =================

app.delete("/api/orders/:id", requireAdmin, async (req, res) => {

    try {

        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order deleted"
        });

    } catch (error) {

        console.error("Delete Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete order"
        });
    }
});

// ================= MONGODB =================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {

        console.log("✅ MongoDB Connected");

        app.listen(PORT, () => {

            console.log(
                `🚀 Server running on http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.error("❌ MongoDB Connection Error:");
        console.error(error.message);

    });