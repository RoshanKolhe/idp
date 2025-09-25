#!/usr/bin/env node
import { Main } from "../services/nodes/main.service";
import { WorkflowInstancesRepository } from "../repositories";
import { IdpApplication } from "../application";
import { ApplicationConfig } from "@loopback/core";

async function main() {
    const config: ApplicationConfig = {
        rest: {
            port: 0,
            host: '127.0.0.1',
        },
    };

    const app = new IdpApplication(config);
    await app.boot();
    await app.start();

    const repo = await app.getRepository(WorkflowInstancesRepository);
    const mainService = await app.get<Main>('services.Main');

    try {
        const result = await mainService.main();
        console.log(JSON.stringify(result));
    } catch (err: any) {
        console.error(JSON.stringify({ error: err.message }));
        process.exit(1);
    } finally {
        console.log('stopping the app');
        await app.stop();

        // disconnect datasource if exists
        try {
            const ds: any = await app.get('datasources.db');
            if (ds?.connector?.disconnect) {
                await ds.connector.disconnect();
            }
        } catch (err) {
            console.warn('No datasource to disconnect');
        }

        setImmediate(() => process.exit(0));
    }
}

main();
