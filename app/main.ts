import { buildApp } from "@app/build";
import { logger } from "@common/config/pino-plugin";

async function app() {
    const app = await buildApp();
    const port: number = Number(process.env.APP_PORT!);
    const host: string = process.env.APP_HOST!;

    app.listen({ host, port }, (e, address) => {
        if (e) {
            logger.info(`[APP] App crashed while starting. Details:`);
            logger.error(e);
            process.exit(1);
        }
        logger.info(`[APP] Server listening on ${address}`);
    });
}

void app();
