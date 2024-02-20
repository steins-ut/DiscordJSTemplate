module.exports = {
    event: "messageCreate",
    description: "Fires when a new message is created.",
    once: false,
    parseCommand: function(commands, commandAliases, commandArgs, pathString) {
        if(commandArgs.length != 0) {
            let commandName = commandArgs[0].toLowerCase();
            let subcommands = commands.get(commandName);
            if(typeof(subcommands) === "undefined") {
                let realCommandName = commandAliases.get(commandName);
                if(realCommandName === undefined) {
					return {
                        command: commands.get(undefined),
                        pathString: pathString
					};
                }
                else {
                    let subcommandAliases = commandAliases.get(realCommandName);
                    subcommands = commands.get(realCommandName);
                    pathString += commandArgs.shift();
                    return this.parseCommand(subcommands, subcommandAliases, commandArgs, pathString);
                }
            }
            else {
                let subcommandAliases = commandAliases.get(commandName);
                pathString += commandArgs.shift();
                return this.parseCommand(subcommands, subcommandAliases, commandArgs, pathString);
            }
        }
        else {
            return {
                command: commands.get(undefined),
                pathString: pathString
			};
		}
    },
    handleMessage: async function(bot, message) {
        if((!message.content.startsWith("prefix!") && message.guild) || message.author.bot) { return; }
        
        let commandArgs = message.content.slice("prefix!".length).trim().split(/ +/);
        let joinedArgs = commandArgs.join(" ");
        let commandObject = this.parseCommand(bot.commands, bot.commands.aliases, commandArgs, "");
        let command = commandObject.command;

        if(command === undefined) {
            message.channel.send(`Command with path "${joinedArgs}" not found. (Check out the help command!)`);
        }
        else {
            if(typeof(command.execute) !== "function") {
                message.channel.send(`Command "${command.name}" is not executable! (Maybe it is a subcommand parent? Check out the help command!)`);
            }
            else {
                if((command.allowedInGuild && message.guild !== null) || (command.allowedInDM && message.guild === null)) {
                    command.execute(bot, message, commandArgs);
                }
                else {
                    message.channel.send(`This command is not usable in ${message.guild === null ? "DMs" : "guilds"}!`);
                }
            }
        }
    },
    execute: async function(bot, message) {
        if(message.partial) {
            message.fetch().then((fetchedMessage) => {
                this.handleMessage(bot, fetchedMessage);
            }).catch((ex) => {
                bot.logger.error(ex);
            });
        }
        else {
            this.handleMessage(bot, message);
        }
    }
};