const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {
    Client,
    GatewayIntentBits
} = require("discord.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/*
========================================
DISCORD BOT
========================================
*/

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

/*
========================================
MIDDLEWARE
========================================
*/

app.use(cors());
app.use(express.json());

/*
========================================
BOT EVENTS
========================================
*/

client.once("ready", () => {
    console.log("--------------------------------");
    console.log("🦆 Ducky Bot");
    console.log("--------------------------------");
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Servers: ${client.guilds.cache.size}`);
    console.log("--------------------------------");
});

/*
========================================
BOT ERROR EVENTS
========================================
*/

client.on("error", (error) => {
    console.error("❌ Discord client error:");
    console.error(error);
});

client.on("warn", (warning) => {
    console.warn("⚠️ Discord warning:");
    console.warn(warning);
});

/*
========================================
API
========================================
*/

app.get("/", (req, res) => {
    res.json({
        status: "online",
        bot: "Ducky Bot",
        discord: client.isReady(),
        version: "1.0.0"
    });
});

app.get("/api/status", (req, res) => {
    res.json({
        online: client.isReady(),
        bot: client.user
            ? client.user.tag
            : "Offline",
        servers: client.guilds.cache.size,
        uptime: process.uptime()
    });
});

app.get("/api/stats", (req, res) => {
    let members = 0;

    client.guilds.cache.forEach((guild) => {
        members += guild.memberCount || 0;
    });

    res.json({
        members,
        servers: client.guilds.cache.size,
        channels: client.channels.cache.size,
        uptime: process.uptime()
    });
});

/*
========================================
ERROR HANDLER
========================================
*/

app.use((err, req, res, next) => {
    console.error("❌ Server error:");
    console.error(err);

    res.status(500).json({
        success: false,
        error: "Internal server error."
    });
});

/*
========================================
START WEB SERVER
========================================
*/

app.listen(PORT, "0.0.0.0", () => {
    console.log("--------------------------------");
    console.log("🦆 Ducky Bot Backend");
    console.log("--------------------------------");
    console.log(`Web server running on port ${PORT}`);
    console.log("--------------------------------");
});

/*
========================================
LOGIN TO DISCORD
========================================
*/

console.log("🔍 Checking Discord token...");

if (!process.env.DISCORD_TOKEN) {

    console.error("❌ DISCORD_TOKEN is missing!");
    console.error("Go to Render → Environment and add DISCORD_TOKEN.");

} else {

    console.log("🔑 Discord token found!");
    console.log("🔌 Connecting to Discord...");

    client.login(process.env.DISCORD_TOKEN)
        .then(() => {
            console.log("✅ Discord login successful!");
        })
        .catch((error) => {
            console.error("❌ Discord login failed!");
            console.error(error);
        });
}

After you replace it

1. Tap Commit changes on GitHub.
2. Go back to Render.
3. Wait for the new deployment to finish.
4. Open Logs.

You should now see either:

"🔑 Discord token found!"

followed by:

"🔌 Connecting to Discord..."

or:

"❌ DISCORD_TOKEN is missing!"

Don't send me your token. Just tell me which message appears. 🦆
