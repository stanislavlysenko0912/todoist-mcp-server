import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types.js'
import z from 'zod'
import { createApiHandler } from "../utils/handlers.js";

export const LABELS_TOOLS: Tool[] = [
    {
        name: 'get_labels',
        description: 'Get all personal labels from Todoist',
        inputSchema: {
            type: "object",
            required: []
        }
    },
    {
        name: 'create_label',
        description: 'Create a new personal label in Todoist',
        inputSchema: {
            type: "object",
            required: ["name"],
            properties: {
                name: {
                    type: "string",
                    description: 'Name of the label'
                },
                order: {
                    type: "integer",
                    description: 'Label order'
                },
                color: {
                    type: "string",
                    description: 'The color of the label icon. Refer to the name column in the Colors guide for more info'
                },
                is_favorite: {
                    type: "boolean",
                    description: 'Whether the label is a favorite (a true or false value)'
                }
            }
        }
    },
    {
        name: 'get_label',
        description: 'Get a personal label from Todoist by ID',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the label to retrieve'
                }
            }
        }
    },
    {
        name: 'update_label',
        description: 'Update a personal label in Todoist',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the label to update'
                },
                name: {
                    type: "string",
                    description: 'New name of the label'
                },
                order: {
                    type: "integer",
                    description: 'Number that is used by clients to sort list of labels'
                },
                color: {
                    type: "string",
                    description: 'The color of the label icon. Refer to the name column in the Colors guide for more info'
                },
                is_favorite: {
                    type: "boolean",
                    description: 'Whether the label is a favorite (a true or false value)'
                }
            }
        }
    },
    {
        name: 'delete_label',
        description: 'Delete a personal label in Todoist',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the label to delete'
                }
            }
        }
    },
    {
        name: 'get_shared_labels',
        description: 'Get all shared labels from Todoist',
        inputSchema: {
            type: "object",
            required: [],
            properties: {}
        }
    },
    {
        name: 'rename_shared_label',
        description: 'Rename a shared label in Todoist',
        inputSchema: {
            type: "object",
            required: ["name", "new_name"],
            properties: {
                name: {
                    type: "string",
                    description: 'The name of the existing label to rename'
                },
                new_name: {
                    type: "string",
                    description: 'The new name for the label'
                }
            }
        }
    },
    {
        name: 'remove_shared_label',
        description: 'Remove a shared label in Todoist',
        inputSchema: {
            type: "object",
            required: ["name"],
            properties: {
                name: {
                    type: "string",
                    description: 'The name of the label to remove'
                }
            }
        }
    }
]

export const LABEL_HANDLERS: ToolHandlers = {
    get_labels: createApiHandler({
        schemaShape: {},
        method: 'GET',
        path: '/labels',
        errorPrefix: 'Failed to get labels',
    }),
    create_label: createApiHandler({
        schemaShape: {
            name: z.string(),
            order: z.number().int().optional(),
            color: z.string().optional(),
            is_favorite: z.boolean().optional(),
        },
        method: 'POST',
        path: '/labels',
        errorPrefix: 'Failed to create label',
    }),
    get_label: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'GET',
        path: '/labels/{id}',
        errorPrefix: 'Failed to get label',
    }),
    update_label: createApiHandler({
        schemaShape: {
            id: z.string(),
            name: z.string().optional(),
            order: z.number().int().optional(),
            color: z.string().optional(),
            is_favorite: z.boolean().optional(),
        },
        method: 'POST',
        path: '/labels/{id}',
        errorPrefix: 'Failed to update label',
    }),
    delete_label: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'DELETE',
        path: '/labels/{id}',
        errorPrefix: 'Failed to delete label',
    }),
    get_shared_labels: createApiHandler({
        schemaShape: {},
        method: 'GET',
        path: '/labels/shared',
        errorPrefix: 'Failed to get shared labels',
    }),
    rename_shared_label: createApiHandler({
        schemaShape: {
            name: z.string(),
            new_name: z.string(),
        },
        method: 'POST',
        path: '/labels/shared/rename',
        errorPrefix: 'Failed to rename shared label',
    }),
    remove_shared_label: createApiHandler({
        schemaShape: {
            name: z.string(),
        },
        method: 'POST',
        path: '/labels/shared/remove',
        errorPrefix: 'Failed to remove shared label',
    }),
}