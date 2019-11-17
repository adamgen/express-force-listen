import { logger } from '@adamgen/logger';
import { Express } from 'express';
import killPort from 'kill-port';

export function forceListen(app: Express) {
    const port = parseInt(process.env.PORT) || 3000;
    const server = app.listen(port);

    server.addListener('error', function listenErrorCallback(err: { code: string }) {
        logger.green('killed port', port);
        if (err.code === 'EADDRINUSE') {
            killPort(port)
                .then(() => {
                    server.listen(port);
                })
                .catch((killPortErr: Error) => {
                    console.log(killPortErr);
                });
        }
    });

    server.addListener('listening', function listeningCallback() {
        logger.green('server code runs on port', port);
        logger.message('RESTART_SUCCESS');
    });

}
