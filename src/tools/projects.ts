import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types.js'
import z from 'zod'
import { createApiHandler, createBatchApiHandler, createSyncApiHandler } from "../utils/handlers.js";

export const PROJECT_TOOLS: Tool[] = [
    {
        name: 'get_projects_list',
        description: 'Get all projects from Todoist',
        inputSchema: {
            type: "object",
            required: []
        }
    },
    {
        name: 'create_projects',
        description: 'Create new projects in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of project objects to create",
                    items: {
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
                }
            }
        }
    },
    {
        name: 'get_projects',
        description: 'Get projects from Todoist by ID',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of project identifiers to retrieve",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: 'ID of the project to retrieve'
                            },
                            name: {
                                type: "string",
                                description: 'Name of the project to retrieve'
                            }
                        },
                        anyOf: [
                            {required: ["id"]},
                            {required: ["name"]}
                        ]
                    }
                }
            }
        }
    },
    {
        name: 'update_projects',
        description: 'Update projects in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of project objects to update",
                    additionalDescription: "At least one of name, color, is_favorite or view_style fields must be provided besides the required id",
                    items: {
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
                }
            }
        }
    },
    {
        name: 'delete_projects',
        description: 'Delete projects in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of projects to delete",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: 'ID of the project to delete (preferred over name)'
                            },
                            name: {
                                type: "string",
                                description: 'Name of the project to delete'
                            }
                        },
                        anyOf: [
                            {required: ["id"]},
                            {required: ["name"]}
                        ]
                    }
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
    },
    {
        name: 'move_projects',
        description: 'Move a projects to a different parent in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of projects to move",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: 'ID of the project to move (preferred over name)'
                            },
                            name: {
                                type: "string",
                                description: 'Name of the project to move'
                            },
                            parent_id: {
                                type: "string",
                                description: 'ID of the parent project to move this project under. Use null to move to root level.'
                            }
                        },
                        required: ["parent_id"],
                        anyOf: [
                            {required: ["id"]},
                            {required: ["name"]}
                        ]
                    }
                }
            }
        }
    }
]

export const PROJECT_HANDLERS: ToolHandlers = {
    get_projects_list: createApiHandler({
        schemaShape: {},
        method: 'GET',
        path: '/projects',
        errorPrefix: 'Failed to get projects',
    }),

    create_projects: createBatchApiHandler({
        itemSchema: {
            name: z.string(),
            parent_id: z.string().optional(),
            color: z.string().optional(),
            is_favorite: z.boolean().optional(),
            view_style: z.enum(["list", "board"]).optional()
        },
        method: 'POST',
        path: '/projects',
        errorPrefix: 'Failed to create projects',
        mode: 'create',
    }),

    get_projects: createBatchApiHandler({
        itemSchema: {
            id: z.string().optional(),
            name: z.string().optional(),
        },
        method: 'GET',
        path: '/projects/{id}',
        errorPrefix: 'Failed to get projects',
        mode: 'read',
        idField: 'id',
        nameField: 'name',
        findByName: (name, items) => items.find(
            item => item.name.toLowerCase().includes(name.toLowerCase())
        ),
    }),

    update_projects: createBatchApiHandler({
        itemSchema: {
            id: z.string(),
            name: z.string().optional(),
            color: z.string().optional(),
            is_favorite: z.boolean().optional(),
            view_style: z.enum(["list", "board"]).optional()
        },
        method: 'POST',
        path: '/projects/{id}',
        errorPrefix: 'Failed to update projects',
        mode: 'update',
        idField: 'id',
    }),

    delete_projects: createBatchApiHandler({
        itemSchema: {
            id: z.string().optional(),
            name: z.string().optional(),
        },
        method: 'DELETE',
        path: '/projects/{id}',
        idField: 'id',
        nameField: 'name',
        errorPrefix: 'Failed to delete projects',
        mode: 'delete',
        findByName: (name, items) => items.find(
            item => item.name.toLowerCase().includes(name.toLowerCase())
        ),
    }),

    get_collaborators: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'GET',
        path: '/projects/{id}/collaborators',
        errorPrefix: 'Failed to get collaborators',
    }),

    move_projects: createSyncApiHandler({
        itemSchema: {
            id: z.string().optional(),
            name: z.string().optional(),
            parent_id: z.string().nullable(),
        },
        commandType: 'project_move',
        errorPrefix: 'Failed to move projects',
        idField: 'id',
        nameField: 'name',
        lookupPath: '/projects',
        findByName: (name, items) => items.find(
            item => item.name.toLowerCase().includes(name.toLowerCase())
        ),
        buildCommandArgs: (item, itemId) => {
            return {
                id: itemId,
                parent_id: item.parent_id
            };
        }
    })
}