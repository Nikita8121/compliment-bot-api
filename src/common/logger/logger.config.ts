import { Logger, LoggerModule, PinoLogger, getLoggerToken, Params } from 'nestjs-pino';
import { storage, Store } from 'nestjs-pino/storage';
import * as process from 'process';
import { randomUUID } from 'node:crypto';
import { sensitiveFields } from './masking';
import * as http from 'http';
export { Logger, LoggerModule, PinoLogger, storage, Store, getLoggerToken };

function getRedactFields() {
    const redactFields: string[] = [...sensitiveFields, 'req.headers.authorization'];

    const baseWildCards = '*.';
    const baseArrayWildCards = '*[*].';

    for (let i = 1; i <= 6; i++) {
        redactFields.push(...sensitiveFields.map(val => baseWildCards.repeat(i) + val));
        redactFields.push(...sensitiveFields.map(val => baseArrayWildCards.repeat(i) + val));
    }
    return redactFields;
}

const localTransport = {
    targets: [
        {
            target: 'pino-pretty',
            options: {
                colorize: true,
                singleLine: true,
                translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
                ignore: 'pid,hostname',
                errorLikeObjectKeys: ['err', 'error'],
            },
        },
    ],
};
function genReqId(req: http.IncomingMessage, res: http.ServerResponse) {
    const existingID = req.id ?? req.headers['x-request-id'];
    if (existingID) return existingID;
    const id = randomUUID();
    res.setHeader('X-Request-Id', id);
    return id;
}

export function createNestLoggingModuleOptions(): Params {
    const redactFields = getRedactFields();

    const transport = process.env.NODE_ENV === 'develop' ? localTransport : undefined;

    return {
        pinoHttp: {
            redact: {
                paths: redactFields,
                censor: '[REDACTED]',
            },
            base: {
                pid: process.pid,
                serviceName: process.env.SERVICE_NAME,
                serviceVersion: process.env.APP_VERSION,
            },
            transport,
            genReqId,
        },
    };
}
