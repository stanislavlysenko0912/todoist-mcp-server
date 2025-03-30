import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers } from '../utils/types.js'
import z from 'zod'
import { createApiHandler, createBatchApiHandler } from "../utils/handlers.js";

/// Common fields for create and update tasks
const create_fields = {
    content: {
        type: "string",
        description: 'Task content. This value may contain markdown-formatted text and hyperlinks'
    },
    description: {
        type: "string",
        description: 'A description for the task. This value may contain markdown-formatted text and hyperlinks'
    },
    labels: {
        type: "array",
        items: {
            type: "string"
        },
        description: 'The task\'s labels (a list of names that may represent either personal or shared labels)'
    },
    priority: {
        type: "integer",
        description: 'Task priority from 1 (normal) to 4 (urgent)',
        enum: [1, 2, 3, 4]
    },
    due_string: {
        type: "string",
        description: 'Human defined task due date (ex.: "next Monday", "Tomorrow"). Value is set using local (not UTC) time, if not in english provided, due_lang should be set to the language of the string',
    },
    due_date: {
        type: "string",
        description: 'Specific date in YYYY-MM-DD format relative to user\'s timezone'
    },
    due_datetime: {
        type: "string",
        description: 'Specific date and time in RFC3339 format in UTC'
    },
    due_lang: {
        type: "string",
        description: '2-letter code specifying language in case due_string is not written in English',
        default: 'en',
    },
    assignee_id: {
        type: "string",
        description: 'The responsible user ID (only applies to shared tasks)'
    },
    duration: {
        type: "integer",
        description: 'A positive (greater than zero) integer for the amount of duration_unit the task will take'
    },
    duration_unit: {
        type: "string",
        description: 'The unit of time that the duration field represents. Must be either minute or day',
        enum: ["minute", "day"]
    }
}

export const TASKS_TOOLS: Tool[] = [
    {
        name: 'get_tasks_list',
        description: 'Get tasks list from Todoist',
        inputSchema: {
            type: "object",
            required: [],
            properties: {
                project_id: {
                    type: "string",
                    description: 'Filter tasks by project ID',
                },
                section_id: {
                    type: "string",
                    description: 'Filter tasks by section ID',
                },
                label: {
                    type: "string",
                    description: 'Filter by label name',
                },
                filter: {
                    type: "string",
                    description: 'Natural language english filter like "search: keyword", "date: today", "date before: +4 hours", "date after: May 5", "no date", "no time", "overdue", "7 days & @waiting", "created before: -365 days", "assigned to: person", "added by: me", "#Project & !assigned", "subtask", "!subtask", "P1 | P2", "today & @email", "@work | @office", "(today | overdue) & #Work", "all & 7 days", "!assigned", "Today & !#Work"',
                },
                ids: {
                    type: "string",
                    description: 'A list of the task IDs to retrieve, this should be a comma separated list',
                },
                limit: {
                    type: "number",
                    description: 'Maximum number of tasks to return, provided by server not api of todoist',
                    default: 50
                }
            }
        }
    },
    {
        name: 'create_tasks',
        description: 'Create tasks in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of tasks to create",
                    items: {
                        type: "object",
                        required: ["content"],
                        properties: {
                            ...create_fields,
                            project_id: {
                                type: "string",
                                description: 'Task project ID. If not set, task is put to user\'s Inbox'
                            },
                            section_id: {
                                type: "string",
                                description: 'ID of section to put task into'
                            },
                            parent_id: {
                                type: "string",
                                description: 'Parent task ID'
                            },
                            order: {
                                type: "integer",
                                description: 'Non-zero integer value used by clients to sort tasks under the same parent'
                            }
                        }
                    }
                }
            }
        }
    },
    {
        name: 'get_tasks',
        description: 'Get a tasks from Todoist by ID or name',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of task identifiers to retrieve",
                    items: {
                        type: "object",
                        properties: {
                            task_id: {
                                type: "string",
                                description: "ID of the task to retrieve (preferred)"
                            },
                            task_name: {
                                type: "string",
                                description: "Name of the task to retrieve (if ID not provided)"
                            }
                        },
                        anyOf: [
                            {required: ["task_id"]},
                            {required: ["task_name"]}
                        ]
                    }
                }
            }
        }
    },
    {
        name: 'update_tasks',
        description: 'Update tasks in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of tasks to update",
                    items: {
                        type: "object",
                        properties: {
                            task_id: {
                                type: "string",
                                description: "ID of the task to update (preferred)"
                            },
                            task_name: {
                                type: "string",
                                description: "Name of the task to update (if ID not provided)"
                            },
                            ...create_fields
                        },
                        anyOf: [
                            {required: ["task_id"]},
                            {required: ["task_name"]}
                        ]
                    }
                }
            }
        }
    },
    {
        name: 'close_tasks',
        description: 'Close tasks in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of tasks to close",
                    items: {
                        type: "object",
                        properties: {
                            task_id: {
                                type: "string",
                                description: "ID of the task to close (preferred)"
                            },
                            task_name: {
                                type: "string",
                                description: "Name of the task to close (if ID not provided)"
                            }
                        },
                        anyOf: [
                            {required: ["task_id"]},
                            {required: ["task_name"]}
                        ]
                    }
                }
            }
        }
    },
    {
        name: 'reopen_tasks',
        description: 'Reopen tasks in Todoist',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of tasks to reopen",
                    items: {
                        type: "object",
                        properties: {
                            task_id: {
                                type: "string",
                                description: "ID of the task to reopen (preferred)"
                            },
                            task_name: {
                                type: "string",
                                description: "Name of the task to reopen (if ID not provided)"
                            }
                        },
                        anyOf: [
                            {required: ["task_id"]},
                            {required: ["task_name"]}
                        ]
                    }
                }
            }
        }
    },
    {
        name: 'delete_tasks',
        description: 'Delete tasks in Todoist, be careful, this action is irreversible',
        inputSchema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    description: "Array of tasks to delete",
                    items: {
                        type: "object",
                        properties: {
                            task_id: {
                                type: "string",
                                description: "ID of the task to delete (preferred)"
                            },
                            task_name: {
                                type: "string",
                                description: "Name of the task to delete (if ID not provided)"
                            }
                        },
                        anyOf: [
                            {required: ["task_id"]},
                            {required: ["task_name"]}
                        ]
                    }
                }
            }
        }
    }
];

export const TASK_HANDLERS: ToolHandlers = {
    get_tasks_list: createApiHandler({
        schemaShape: {
            project_id: z.string().optional(),
            section_id: z.string().optional(),
            label: z.string().optional(),
            filter: z.string().optional(),
            ids: z.string().optional(),
            limit: z.number().optional(),
        },
        method: 'GET',
        path: '/tasks',
        errorPrefix: 'Failed to get tasks',
        processResult: (results, args) => {
            let filteredTasks = results;
            filteredTasks = filteredTasks.slice(0, args.limit || 50);
            return filteredTasks;
        }
    }),

    create_tasks: createBatchApiHandler({
        itemSchema: {
            content: z.string(),
            description: z.string().optional(),
            project_id: z.string().optional(),
            section_id: z.string().optional(),
            parent_id: z.string().optional(),
            order: z.number().int().optional(),
            labels: z.array(z.string()).optional(),
            priority: z.number().int().min(1).max(4).optional(),
            due_string: z.string().optional(),
            due_date: z.string().optional(),
            due_datetime: z.string().optional(),
            due_lang: z.string().optional(),
            assignee_id: z.string().optional(),
            duration: z.number().int().positive().optional(),
            duration_unit: z.enum(["minute", "day"]).optional()
        },
        method: 'POST',
        path: '/tasks',
        errorPrefix: 'Failed to create tasks',
        mode: 'create'
    }),

    get_tasks: createBatchApiHandler({
        itemSchema: {
            task_id: z.string().optional(),
            task_name: z.string().optional(),
        },
        method: 'GET',
        path: '/tasks/{id}',
        errorPrefix: 'Failed to get task',
        mode: 'read',
        idField: 'task_id',
        nameField: 'task_name',
        findByName: (name, items) => items.find(item =>
            item.content && item.content.toLowerCase().includes(name.toLowerCase())
        )
    }),

    update_tasks: createBatchApiHandler({
        itemSchema: {
            task_id: z.string().optional(),
            task_name: z.string().optional(),
            content: z.string().optional(),
            description: z.string().optional(),
            labels: z.array(z.string()).optional(),
            priority: z.number().int().min(1).max(4).optional(),
            due_string: z.string().optional(),
            due_date: z.string().optional(),
            due_datetime: z.string().optional(),
            due_lang: z.string().optional(),
            assignee_id: z.string().optional(),
            duration: z.number().int().positive().optional(),
            duration_unit: z.enum(["minute", "day"]).optional()
        },
        method: 'POST',
        path: '/tasks/{id}',
        errorPrefix: 'Failed to update tasks',
        mode: 'update',
        idField: 'task_id',
        nameField: 'task_name',
        findByName: (name, items) => items.find(item =>
            item.content && item.content.toLowerCase().includes(name.toLowerCase())
        )
    }),

    close_tasks: createBatchApiHandler({
        itemSchema: {
            task_id: z.string().optional(),
            task_name: z.string().optional(),
        },
        method: 'POST',
        basePath: '/tasks',
        pathSuffix: '/{id}/close',
        errorPrefix: 'Failed to close tasks',
        mode: 'update',
        idField: 'task_id',
        nameField: 'task_name',
        findByName: (name, items) => items.find(item =>
            item.content && item.content.toLowerCase().includes(name.toLowerCase())
        )
    }),

    reopen_tasks: createBatchApiHandler({
        itemSchema: {
            task_id: z.string().optional(),
            task_name: z.string().optional(),
        },
        method: 'POST',
        basePath: '/tasks',
        pathSuffix: '/{id}/reopen',
        errorPrefix: 'Failed to reopen tasks',
        mode: 'update',
        idField: 'task_id',
        nameField: 'task_name',
        findByName: (name, items) => items.find(item =>
            item.content && item.content.toLowerCase().includes(name.toLowerCase())
        )
    }),

    delete_tasks: createBatchApiHandler({
        itemSchema: {
            task_id: z.string().optional(),
            task_name: z.string().optional(),
        },
        method: 'DELETE',
        path: '/tasks/{id}',
        errorPrefix: 'Failed to delete tasks',
        mode: 'delete',
        idField: 'task_id',
        nameField: 'task_name',
        findByName: (name, items) => items.find(item =>
            item.content && item.content.toLowerCase().includes(name.toLowerCase())
        )
    })
};