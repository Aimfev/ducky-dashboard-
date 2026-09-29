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

    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        response_type: "code",
        scope: "identify guilds"
    });

    res.redirect(
        `https://discord.com/oauth2/authorize?${params.toString()}`
    );
});

app.get("/auth/discord/callback", async (req, res) => {

    try {

        const code = req.query.code;

        if (!code) {
            return res.status(400).send("Missing OAuth code.");
        }

        const tokenResponse = await fetch(
            "https://discord.com/api/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: process.env.DISCORD_CLIENT_ID,
                    client_secret: process.env.DISCORD_CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: process.env.REDIRECT_URI
                })
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("OAuth token error:", tokenData);
            return res.status(400).send("Discord OAuth login failed.");
        }

        const userResponse = await fetch(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    Authorization: `${tokenData.token_type} ${tokenData.access_token}`
                }
            }
        );

        const user = await userResponse.json();

        req.session.user = user;
        req.session.accessToken = tokenData.access_token;

        res.redirect(process.env.FRONTEND_URL);

    } catch (error) {

        console.error("❌ OAuth error:");
        console.error(error);

        res.status(500).send("OAuth login failed.");

    }

});

/*
========================================
CURRENT USER
========================================
*/

app.get("/api/me", (req, res) => {

    if (!req.session.user) {
        return res.json({
            loggedIn: false
        });
    }

    res.json({
        loggedIn: true,
        user: req.session.user
    });

});

/*
========================================
LOGOUT
========================================
*/

app.get("/auth/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect(process.env.FRONTEND_URL);
    });

});

/*
========================================
BOT STATUS
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

/*
========================================
BOT STATS
========================================
*/

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
START SERVER
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
DISCORD LOGIN
========================================
*/

console.log("🔍 Checking Discord token...");

if (!process.env.DISCORD_TOKEN) {

    console.error("❌ DISCORD_TOKEN is missing!");

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
