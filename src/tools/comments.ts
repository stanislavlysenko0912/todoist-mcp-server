import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types.js'
import z from 'zod'
import { createApiHandler } from "../utils/handlers.js";

export const COMMENTS_TOOLS: Tool[] = [
    {
        name: 'get_comments',
        description: 'Get all comments from Todoist, must be provided or `project_id` or `task_id`',
        inputSchema: {
            type: "object",
            required: [],
            properties: {
                project_id: {
                    type: "string",
                    description: 'ID of the project used to filter comments'
                },
                task_id: {
                    type: "string",
                    description: 'ID of the task used to filter comments'
                }
            }
        }
    },
    {
        name: 'create_comment',
        description: 'Create a new comment in Todoist, must be provided or `project_id` or `task_id`',
        inputSchema: {
            type: "object",
            required: ["content"],
            properties: {
                task_id: {
                    type: "string",
                    description: 'Comment\'s task ID (for task comments)'
                },
                project_id: {
                    type: "string",
                    description: 'Comment\'s project ID (for project comments)'
                },
                content: {
                    type: "string",
                    description: 'Comment markdown-formatted text and hyperlinks'
                },
                // attachment: {
                //     type: "object",
                //     description: 'Object for attachment object'
                // }
            }
        }
    },
    {
        name: 'get_comment',
        description: 'Get a comment from Todoist by ID',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the comment to retrieve'
                }
            }
        }
    },
    {
        name: 'update_comment',
        description: 'Update a comment in Todoist',
        inputSchema: {
            type: "object",
            required: ["id", "content"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the comment to update'
                },
                content: {
                    type: "string",
                    description: 'New content, markdown-formatted text and hyperlinks'
                }
            }
        }
    },
    {
        name: 'delete_comment',
        description: 'Delete a comment in Todoist',
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: 'ID of the comment to delete'
                }
            }
        }
    }
]

export const COMMENT_HANDLERS: ToolHandlers = {
    get_comments: createApiHandler({
        schemaShape: {
            project_id: z.string().optional(),
            task_id: z.string().optional(),
        },
        method: 'GET',
        path: '/comments',
        errorPrefix: 'Failed to get comments',
    }),
    create_comment: createApiHandler({
        schemaShape: {
            task_id: z.string().optional(),
            project_id: z.string().optional(),
            content: z.string(),
            // attachment: z.object({}).optional(),
        },
        method: 'POST',
        path: '/comments',
        errorPrefix: 'Failed to create comment',
    }),
    get_comment: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'GET',
        path: '/comments/{id}',
        errorPrefix: 'Failed to get comment',
    }),
    update_comment: createApiHandler({
        schemaShape: {
            id: z.string(),
            content: z.string(),
        },
        method: 'POST',
        path: '/comments/{id}',
        errorPrefix: 'Failed to update comment',
    }),
    delete_comment: createApiHandler({
        schemaShape: {
            id: z.string(),
        },
        method: 'DELETE',
        path: '/comments/{id}',
        errorPrefix: 'Failed to delete comment',
    }),
}