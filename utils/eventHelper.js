const fs = require('fs');
const path = require('path');

module.exports = {
    loadEvents: function(bot) {
        bot.logger.info("Loading events...");
        let eventFiles = fs.readdirSync(path.resolve(process.cwd(), "events")).filter(file => file.endsWith(".js"));
        for(let file of eventFiles) {
            try {
                let eventHandler = require(path.resolve(process.cwd(), "events", file));
                bot.discord[(eventHandler.once ? "once" : "on")](eventHandler.event, (...args) => { eventHandler.execute(bot, ...args); });
            } 
            catch (ex) {
                bot.logger.error(ex);
            }

        }
        bot.logger.info(`Loaded event files: ${eventFiles}`);
    }
};