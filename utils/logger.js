const { createLogger, format, transports } = require('winston');

module.exports = (() => {
    let date = new Date();
    let dateString = date.getDay().toString() + "-" + date.getMonth().toString() + "-" + date.getFullYear().toString() + "-" + Math.round(date.getTime() / 1000).toString();
    return createLogger({
        format: format.combine(
            format.timestamp({format: "DD-MM-YYYY HH:mm:ss"}),
            format.splat(),
            format.align(),
            format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`)
        ),
        transports: [
            new transports.File({
                level: "info",
                filename: `logs/combined-${dateString}.log`,
            }),
			new transports.File({
                level: "debug",
                filename: `logs/debug-${dateString}.log`,
            }),
            new transports.Console({
                level: "info"
            })
        ]
    });
})();