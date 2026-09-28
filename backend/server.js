const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/*
========================================
HEALTH CHECK
========================================
*/

app.get("/", (req, res) => {
    res.json({
        status: "online",
        bot: "Ducky Bot",
        version: "1.0.0"
    });
});


/*
========================================
BOT STATUS
========================================
*/

app.get("/api/status", (req, res) => {
    res.json({
        online: true,
        bot: "Ducky Bot",
        uptime: process.uptime()
    });
});


/*
========================================
SERVER STATISTICS
========================================
*/

app.get("/api/stats", (req, res) => {
    res.json({
        members: 0,
        online: 0,
        messages: 0,
        channels: 0,
        roles: 0,
        uptime: process.uptime()
    });
});


/*
========================================
TEST MESSAGE ENDPOINT
========================================
*/

app.post("/api/test", (req, res) => {

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            error: "Message is required."
        });
    }

    console.log("Dashboard message:", message);

    res.json({
        success: true,
        message: "Message received by backend."
    });
});


/*
========================================
ERROR HANDLER
========================================
*/

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        success: false,
        error: "Internal server error."
    });

});


/*
========================================
START SERVER
========================================
*/

app.listen(PORT, "0.0.0.0", () => {

    console.log("--------------------------------");
    console.log("🦆 Ducky Bot Backend");
    console.log("--------------------------------");
    console.log(`Server running on port ${PORT}`);
    console.log("--------------------------------");

});
