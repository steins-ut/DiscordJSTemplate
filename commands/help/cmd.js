module.exports = {
    name: "help",
    aliases: ["help"],
    description: "Displays all the commands and information about them.",
    usage: "help <command> <subcommand> <subcommand2> ....",
    allowedInGuild: true,
    allowedInDM: true,
    execute: async function(bot, message, args) {
		message.channel.send(`User ${message.author} pinged with arguments "${args}". Pong!`);
        bot.logger.info(`User ${message.author.username} pinged with arguments "${args}". Pong!`);
    }
};