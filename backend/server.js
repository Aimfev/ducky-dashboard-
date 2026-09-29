const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const {
    Client,
    GatewayIntentBits
} = require("discord.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: "none"
    }
}));

/*
========================================
DISCORD BOT
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
DISCORD OAUTH LOGIN
========================================
*/

app.get("/auth/discord", (req, res) => {
