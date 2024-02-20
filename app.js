require("dotenv").config();
const { Client } = require("discord.js");
const logger = require("./utils/logger.js");
const commandHelper = require("./utils/commandHelper.js");
const eventHelper = require("./utils/eventHelper.js");

function Bot() {
    let bot = {};

    bot.logger = logger;
    bot.discord = new Client({
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
        partials: ["CHANNEL", "MESSAGE"]
    });

    bot.discord.once("ready", (discord) => {
        eventHelper.loadEvents(bot);
        commandHelper.loadCommands(bot);
        bot.logger.info("Bot is ready for shenanigans!");
    });

    return bot;
}

var bot = Bot();
bot.discord.login(process.env.BOT_TOKEN);