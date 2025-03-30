import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types.js'
import z from 'zod'
import { createApiHandler, createBatchApiHandler } from "../utils/handlers.js";

export const SECTION_TOOLS: Tool[] = [
    {
        name: 'get_sections_list',
        description: 'Get all sections from Todoist',
        inputSchema: {
            type: "object",
            required: [],
            properties: {
                project_id: {
                    type: "string",
                    description: 'Filter sections by project ID'
                }
            }
        }
    },
    {
        name: 'create_sections',
        description: 'Create new sections in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of section objects to create",
                    items: {
                        type: "object",
                        required: ["name", "project_id"],
                        properties: {
                            name: {
                                type: "string",
                                description: 'Section name'
                            },
                            project_id: {
                                type: "string",
                                description: 'Project ID this section should belong to'
                            },
                            order: {
                                type: "integer",
                                description: 'Order among other sections in a project'
                            }
                        }
                    }
                }
            }
        }
    },
    {
        name: 'get_sections',
        description: 'Get sections from Todoist by ID',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of section identifiers to retrieve",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: 'ID of the section to retrieve (preferred over name)'
                            },
                            name: {
                                type: "string",
                                description: 'Name of the section to retrieve'
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
        name: 'update_sections',
        description: 'Update sections in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of section objects to update",
                    items: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: {
                                type: "string",
                                description: 'ID of the section to update'
                            },
                            name: {
                                type: "string",
                                description: 'New section name'
                            },
                            order: {
                                type: "integer",
                                description: 'New order among other sections in a project'
                            }
                        }
                    }
                }
            }
        }
    },
    {
        name: 'delete_sections',
        description: 'Delete sections in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of sections to delete",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: 'ID of the section to delete (preferred over name)'
                            },
                            name: {
                                type: "string",
                                description: 'Name of the section to delete'
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
    }
]

export const SECTION_HANDLERS: ToolHandlers = {
    get_sections_list: createApiHandler({
        schemaShape: {
            project_id: z.string().optional(),
        },
        method: 'GET',
        path: '/sections',
        errorPrefix: 'Failed to get sections',
    }),
    create_sections: createBatchApiHandler({
        itemSchema: {
            name: z.string(),
            project_id: z.string(),
            order: z.number().int().optional(),
        },
        method: 'POST',
        path: '/sections',
        errorPrefix: 'Failed to create sections',
        mode: 'create',
    }),
    get_sections: createBatchApiHandler({
        itemSchema: {
            id: z.string().optional(),
            name: z.string().optional(),
        },
        method: 'GET',
        path: '/sections/{id}',
        errorPrefix: 'Failed to get sections',
        mode: 'read',
        idField: 'id',
        nameField: 'name',
        findByName: (name, items) => items.find(
            item => item.name.toLowerCase().includes(name.toLowerCase())
        ),
    }),
    update_sections: createBatchApiHandler({
        itemSchema: {
            id: z.string(),
            name: z.string().optional(),
            order: z.number().int().optional(),
        },
        method: 'POST',
        path: '/sections/{id}',
        errorPrefix: 'Failed to update sections',
        mode: 'update',
        idField: 'id',
    }),
    delete_sections: createBatchApiHandler({
        itemSchema: {
            id: z.string().optional(),
            name: z.string().optional(),
        },
        method: 'DELETE',
        path: '/sections/{id}',
        idField: 'id',
        nameField: 'name',
        errorPrefix: 'Failed to delete sections',
        mode: 'delete',
        findByName: (name, items) => items.find(
            item => item.name.toLowerCase().includes(name.toLowerCase())
        ),
    }),
}