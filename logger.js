const { createLogger, format, transports } = require('winston')
const { printf, colorize, combine } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${message} ${stack ? `\nStack: ${stack}` : ''}`;
});

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.splat(), 
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logs/informations.log'  })
    ]
});

// Ver com Yago se é possível log no console apenas do server e se isso faz sentido
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new transports.Console({
//         format: combine(
//             colorize(),
//             logFormat
//         )
//     }));
// };

module.exports = logger;