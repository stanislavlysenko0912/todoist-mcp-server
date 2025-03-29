import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types.js'
import z from 'zod'
import { createApiHandler } from "../utils/handlers.js";

export const SECTION_TOOLS: Tool[] = [
    {
        name: 'get_sections',
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
        name: 'create_section',
        description: 'Create a new section in Todoist',
        inputSchema: {
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
    },
    {
        name: 'get_section',
        description: 'Get a section from Todoist by ID',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the section to retrieve'
                }
            }
        }
    },
    {
        name: 'update_section',
        description: 'Update a section in Todoist',
        inputSchema: {
            type: "object",
            required: ["id", "name"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the section to update'
                },
                name: {
                    type: "string",
                    description: 'Section name'
                }
            }
        }
    },
    {
        name: 'delete_section',
        description: 'Delete a section in Todoist',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the section to delete'
                }
            }
        }
    }
]

export const SECTION_HANDLERS: ToolHandlers = {
    get_sections: createApiHandler({
        schemaShape: {
            project_id: z.string().optional(),
        },
        method: 'GET',
        path: '/sections',
        errorPrefix: 'Failed to get sections',
    }),
    create_section: createApiHandler({
        schemaShape: {
            name: z.string(),
            project_id: z.string(),
            order: z.number().int().optional(),
        },
        method: 'POST',
        path: '/sections',
        errorPrefix: 'Failed to create section',
    }),
    get_section: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'GET',
        path: '/sections/{id}',
        errorPrefix: 'Failed to get section',
    }),
    update_section: createApiHandler({
        schemaShape: {
            id: z.string(),
            name: z.string(),
        },
        method: 'POST',
        path: '/sections/{id}',
        errorPrefix: 'Failed to update section',
    }),
    delete_section: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'DELETE',
        path: '/sections/{id}',
        errorPrefix: 'Failed to delete section',
    }),
}