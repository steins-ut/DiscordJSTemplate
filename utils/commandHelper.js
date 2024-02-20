const fs = require("fs");
const path = require('path');
const { Collection } = require("discord.js");

function loadSubcommands(bot, commandPath, commandCollection, commandAliases) {
    subcmdFolders = fs.readdirSync(commandPath).filter(file => fs.lstatSync(path.resolve(commandPath, file)).isDirectory());
    for(let subcmdFolder of subcmdFolders) {
        let subcmdPath = path.resolve(commandPath, subcmdFolder);
		let subcmd = undefined;
        let subcmdName = subcmdFolder;
        try {
            subcmd = require(path.resolve(subcmdPath, "cmd.js"));
            subcmdName = subcmd.name.toLowerCase();
            if(Array.isArray(subcmd.aliases)) {
                for(let alias of subcmd.aliases) {
                    commandAliases.set(alias.toLowerCase(), subcmd.name.toLowerCase());
                }
            }
            else {
                bot.logger.warn(`The aliases of ${subcmdFolder} is not an array!`);
            }
        }
        catch(ex) {
            bot.logger.error(ex);
        }
        let subcmdCollection = new Collection();
        subcmdCollection.set(undefined, subcmd);
        commandCollection.set(subcmdName.toLowerCase(), subcmdCollection);
        let subcmdAliases = new Collection();
        commandAliases.set(subcmdName.toLowerCase(), subcmdAliases);
        loadSubcommands(bot, subcmdPath, subcmdCollection, subcmdAliases);
    }
}

module.exports = {
    loadCommands: function(bot) {
        bot.logger.info("Loading commands...");
        let commands = new Collection();
        commands.aliases = new Collection();
        let commandsPath = path.resolve(process.cwd(), "commands");
        let commandFolders = fs.readdirSync(commandsPath).filter(file => fs.lstatSync(path.resolve(commandsPath, file)).isDirectory());
        loadSubcommands(bot, commandsPath, commands, commands.aliases);
        bot.logger.info(`Loaded command folders: ${commandFolders}`);
        bot.commands = commands;
    }
};