import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TodoistClient } from './utils/TodoistClient.js';
import { config, version } from './utils/helpers.js';

export const todoistApi = new TodoistClient(config.API_KEY);

export const server = new McpServer(
    {
        name: 'todoist-mcp',
        version,
    },
    {
        instructions: 'Use this server to interact with Todoist API.\n\nNotes:\n- Todoist API priority is inverted — pass 4 for P1 (urgent), 1 for P4 (normal)',
    }
);
