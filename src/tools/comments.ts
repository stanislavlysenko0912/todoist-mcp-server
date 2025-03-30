import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types.js'
import z from 'zod'
import { createApiHandler, createBatchApiHandler } from "../utils/handlers.js";

export const COMMENTS_TOOLS: Tool[] = [
    {
        name: 'get_comments_list',
        description: 'Get all comments from Todoist',
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
            },
            anyOf: [
                {required: ["project_id"]},
                {required: ["task_id"]}
            ]
        }
    },
    {
        name: 'create_comments',
        description: 'Create new comments in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of comment objects to create",
                    items: {
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
                            }
                            // attachment: {
                            //     type: "object",
                            //     description: 'Object for attachment object'
                            // }
                        },
                        anyOf: [
                            {required: ["task_id"]},
                            {required: ["project_id"]}
                        ]
                    }
                }
            }
        }
    },
    {
        name: 'get_comments',
        description: 'Get comments from Todoist by ID',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of comment identifiers to retrieve",
                    items: {
                        type: "object",
                        required: ["id"],
                        properties: {
                            id: {
                                type: "string",
                                description: 'ID of the comment to retrieve'
                            }
                        }
                    }
                }
            }
        }
    },
    {
        name: 'update_comments',
        description: 'Update comments in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of comment objects to update",
                    items: {
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
                }
            }
        }
    },
    {
        name: 'delete_comments',
        description: 'Delete comments in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of comments to delete",
                    items: {
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
            }
        }
    }
]

export const COMMENT_HANDLERS: ToolHandlers = {
    get_comments_list: createApiHandler({
        schemaShape: {
            project_id: z.string().optional(),
            task_id: z.string().optional(),
        },
        method: 'GET',
        path: '/comments',
        errorPrefix: 'Failed to get comments',
    }),
    create_comments: createBatchApiHandler({
        itemSchema: {
            task_id: z.string().optional(),
            project_id: z.string().optional(),
            content: z.string(),
            // attachment: z.object({}).optional(),
        },
        method: 'POST',
        path: '/comments',
        errorPrefix: 'Failed to create comments',
        mode: 'create',
    }),
    get_comments: createBatchApiHandler({
        itemSchema: {
            id: z.string(),
        },
        method: 'GET',
        path: '/comments/{id}',
        errorPrefix: 'Failed to get comments',
        mode: 'read',
        idField: 'id',
    }),
    update_comments: createBatchApiHandler({
        itemSchema: {
            id: z.string(),
            content: z.string(),
        },
        method: 'POST',
        path: '/comments/{id}',
        errorPrefix: 'Failed to update comments',
        mode: 'update',
        idField: 'id',
    }),
    delete_comments: createBatchApiHandler({
        itemSchema: {
            id: z.string(),
        },
        method: 'DELETE',
        path: '/comments/{id}',
        idField: 'id',
        errorPrefix: 'Failed to delete comments',
        mode: 'delete',
    }),
}