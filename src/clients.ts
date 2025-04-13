import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TodoistClient } from "./utils/TodoistClient.js";
import { config, version } from "./utils/helpers.js";

export const todoistApi = new TodoistClient(config.API_KEY);

export const server = new McpServer(
    {
        name: 'todoist-mcp',
        version,
    }
);
