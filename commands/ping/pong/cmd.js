module.exports = {
    name: "pong",
    aliases: ["pongping"],
    description: "Pongs the ping!",
    usage: "<text>",
    allowedInGuild: true,
    allowedInDM: true,
    execute: async function(bot, message, args) {
		message.channel.send(`User ${message.author} ponged with arguments "${args}". Ping!`);
        bot.logger.info(`User ${message.author} ponged with arguments "${args}". Ping!`);
    }
};