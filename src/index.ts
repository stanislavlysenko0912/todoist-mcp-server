#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './clients.js';
import { config, log } from './utils/helpers.js';
import { buildInstructions } from './utils/instructions.js';

import './prompts.js';
import './tools.js';

export async function main() {
    if (!config.API_KEY || config.API_KEY.length === 0) {
        log('Missing required configuration: API_KEY');
        process.exit(1);
    }

    try {
        (server.server as unknown as { _instructions: string })._instructions =
            await buildInstructions();

        const transport = new StdioServerTransport();
        await server.connect(transport);

        process.stdin.resume();

        log('Server connected and running');
    } catch (error) {
        log('Fatal error:', error);
        process.exit(1);
    }
}

main().then();
