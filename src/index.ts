#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { config, log } from './utils/helpers.js';
import { version } from './utils/version.js';
import { ALL_HANDLERS, ALL_TOOLS } from './tools.js';

const server = new Server(
    {
        name: 'todoist-mcp',
        version,
    },
    { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: ALL_TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async request => {
    const toolName = request.params.name;

    log('Tool call: ', toolName);

    try {
        const handler = ALL_HANDLERS[toolName];

        if (!handler) {
            throw new Error(`Unknown tool: ${toolName}`);
        }

        return await handler(request);
    } catch (error) {
        log('Error handling tool call:', error);

        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});

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
