#!/usr/bin/env node

import { server } from './clients.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config, log } from './utils/helpers.js';

import './prompts.js';

export async function main() {
    if (!config.API_KEY || config.API_KEY.length === 0) {
        log('Missing required configuration: API_KEY');
        process.exit(1);
    }

    try {
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
