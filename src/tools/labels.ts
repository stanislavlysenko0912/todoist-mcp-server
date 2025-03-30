import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types.js'
import z from 'zod'
import { createApiHandler, createBatchApiHandler } from "../utils/handlers.js";

export const LABELS_TOOLS: Tool[] = [
    {
        name: 'get_labels_list',
        description: 'Get all personal labels from Todoist',
        inputSchema: {
            type: "object",
            required: []
        }
    },
    {
        name: 'create_labels',
        description: 'Create a new personal labels in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of labels objects to create",
                    items: {
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
                                description: 'The color of the label icon. Refer to the name column in the `utils_get_colors` tool for more info'
                            },
                            is_favorite: {
                                type: "boolean",
                                description: 'Whether the label is a favorite (a true or false value)'
                            }
                        }
                    }
                }
            }
        }
    },
    {
        name: 'get_labels',
        description: 'Get a personal labels from Todoist by ID',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of label identifiers to retrieve",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: 'ID of the label to retrieve'
                            },
                            name: {
                                type: "string",
                                description: 'Name of the label to retrieve'
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
        name: 'update_labels',
        description: 'Update a personal label in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of labels objects to update, need to provide at least one of the following: id, name",
                    additionalDescription: "At least one of name, order, color or is_favorite fields must be provided besides the required id",
                    items: {
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
                            },
                        },
                    }
                }
            }
        }
    },
    {
        name: 'delete_labels',
        description: 'Delete a personal labels in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of labels to delete",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: 'ID of the label to delete (preferred over name)'
                            },
                            name: {
                                "type": "string",
                                "description": "Name of the label to delete"
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
    get_labels_list: createApiHandler({
        schemaShape: {},
        method: 'GET',
        path: '/labels',
        errorPrefix: 'Failed to get labels',
    }),
    create_labels: createBatchApiHandler({
        itemSchema: {
            name: z.string(),
            order: z.number().int().optional(),
            color: z.string().optional(),
            is_favorite: z.boolean().optional(),
        },
        method: 'POST',
        path: '/labels',
        errorPrefix: 'Failed to create labels',
        mode: 'create',
    }),
    get_labels: createBatchApiHandler({
        itemSchema: {
            id: z.string().optional(),
            name: z.string().optional(),
        },
        method: 'GET',
        path: '/labels/{id}',
        errorPrefix: 'Failed to get labels',
        mode: 'read',
        idField: 'id',
        nameField: 'name',
        findByName: (name, items) => items.find(
            item => item.name.toLowerCase().includes(name.toLowerCase())
        ),
    }),
    update_labels: createBatchApiHandler({
        itemSchema: {
            id: z.string(),
            name: z.string().optional(),
            order: z.number().int().optional(),
            color: z.string().optional(),
            is_favorite: z.boolean().optional(),
        },
        method: 'POST',
        path: '/labels/{id}',
        errorPrefix: 'Failed to update labels',
        mode: 'update',
        idField: 'id',
    }),
    delete_labels: createBatchApiHandler({
        itemSchema: {
            id: z.string().optional(),
            name: z.string().optional(),
        },
        method: 'DELETE',
        path: '/labels/{id}',
        idField: 'id',
        nameField: 'name',
        errorPrefix: 'Failed to delete labels',
        mode: 'delete',
        findByName: (name, items) => items.find(
            item => item.name.toLowerCase().includes(name.toLowerCase())
        ),
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