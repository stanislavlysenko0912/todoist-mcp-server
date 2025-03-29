import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types.js'
import z from 'zod'
import { createApiHandler } from "../utils/handlers.js";

export const PROJECT_TOOLS: Tool[] = [
    {
        name: 'get_projects',
        description: 'Get all projects from Todoist',
        inputSchema: {
            type: "object"
        }
    },
    {
        name: 'create_project',
        description: 'Create a new project in Todoist',
        inputSchema: {
            type: "object",
            required: ["name"],
            properties: {
                name: {
                    type: "string",
                    description: 'Name of the project'
                },
                parent_id: {
                    type: "string",
                    description: 'Parent project ID'
                },
                color: {
                    type: "string",
                    description: 'The color of the project icon. Refer to the name column in the Colors guide for more info'
                },
                is_favorite: {
                    type: "boolean",
                    description: 'Whether the project is a favorite (a true or false value)'
                },
                view_style: {
                    type: "string",
                    description: 'A string value, list default. This determines the way the project is displayed',
                    enum: ["list", "board"]
                }
            }
        }
    },
    {
        name: 'get_project',
        description: 'Get a project from Todoist by ID',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the project to retrieve'
                }
            }
        }
    },
    {
        name: 'update_project',
        description: 'Update a project in Todoist',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the project to update'
                },
                name: {
                    type: "string",
                    description: 'Name of the project'
                },
                color: {
                    type: "string",
                    description: 'The color of the project icon. Refer to the name column in the Colors guide for more info'
                },
                is_favorite: {
                    type: "boolean",
                    description: 'Whether the project is a favorite (a true or false value)'
                },
                view_style: {
                    type: "string",
                    description: 'A string value (either list or board). This determines the way the project is displayed within the Todoist clients',
                    enum: ["list", "board"]
                }
            }
        }
    },
    {
        name: 'delete_project',
        description: 'Delete a project in Todoist',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the project to delete'
                }
            }
        }
    },
    {
        name: 'get_collaborators',
        description: 'Get all collaborators for a project in Todoist',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the project to get collaborators for'
                }
            }
        }
    }
]

export const PROJECT_HANDLERS: ToolHandlers = {
    get_projects: createApiHandler({
        schemaShape: {},
        method: 'GET',
        path: '/projects',
        errorPrefix: 'Failed to get projects',
    }),
    create_project: createApiHandler({
        schemaShape: {
            name: z.string(),
            parent_id: z.string().optional(),
            color: z.string().optional(),
            is_favorite: z.boolean().optional(),
            view_style: z.enum(["list", "board"]).optional()
        },
        method: 'POST',
        path: '/projects',
        errorPrefix: 'Failed to create project',
    }),
    get_project: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'GET',
        path: '/projects/{id}',
        errorPrefix: 'Failed to get project',
    }),
    update_project: createApiHandler({
        schemaShape: {
            id: z.string(),
            name: z.string().optional(),
            color: z.string().optional(),
            is_favorite: z.boolean().optional(),
            view_style: z.enum(["list", "board"]).optional()
        },
        method: 'POST',
        path: '/projects/{id}',
        errorPrefix: 'Failed to update project',
    }),
    delete_project: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'DELETE',
        path: '/projects/{id}',
        errorPrefix: 'Failed to delete project',
    }),
    get_collaborators: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'GET',
        path: '/projects/{id}/collaborators',
        errorPrefix: 'Failed to get collaborators',
    }),
}