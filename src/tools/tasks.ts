import { z } from 'zod';
import {
    createApiHandler,
    createBatchApiHandler,
    createSyncApiHandler,
} from '../utils/handlers.js';

/// Common fields for create and update tasks
const create_fields = {
    content: z
        .string()
        .describe('Task title (brief). May contain markdown-formatted text and hyperlinks'),
    description: z
        .string()
        .optional()
        .describe('Description (detailed). May contain markdown-formatted text and hyperlinks'),
    labels: z.array(z.string()).optional(),
    priority: z.number().int().min(1).max(4).optional().describe('From 1 (urgent) to 4 (normal)'),
    due_string: z
        .string()
        .optional()
        .describe(
            'Human defined task due date (ex.: "next Monday", "Tomorrow"). Value is set using local (not UTC) time, if not in english provided, due_lang should be set to the language of the string'
        ),
    due_date: z.string().optional().describe('Date in YYYY-MM-DD format relative to user timezone'),
    due_datetime: z.string().optional().describe('Specific date and time in RFC3339 format in UTC'),
    due_lang: z
        .string()
        .optional()
        .describe('2-letter code specifying language in case due_string is not written in english'),
    assignee_id: z
        .string()
        .optional()
        .describe('The responsible user ID (only applies to shared tasks)'),
    duration: z
        .number()
        .int()
        .positive()
        .optional()
        .describe(
            'A positive (greater than zero) integer for the amount of duration_unit the task will take'
        ),
    duration_unit: z
        .enum(['minute', 'day'])
        .optional()
        .describe(
            'The unit of time that the duration field represents. Must be either minute or day'
        ),
};

createApiHandler({
    name: 'get_tasks_list',
    description: 'Get tasks list from Todoist',
    schemaShape: {
        project_id: z.string().optional().describe('Filter by project'),
        section_id: z.string().optional().describe('Filter by section'),
        label: z.string().optional().describe('Filter by label'),
        filter: z
            .string()
            .optional()
            .describe(
                'Natural language english filter like "search: keyword", "today", "date before: +4 hours", "date after: May 5", "no date", "no time", "overdue", "7 days & @waiting", "created before: -365 days", "assigned to: person", "added by: me", "#Project & !assigned", "subtask", "!subtask", "P1 | P2", "today & @email", "@work | @office", "(today | overdue) & #Work", "all & 7 days", "!assigned", "Today & !#Work"'
            ),
        ids: z.string().optional().describe('Comma-separated list of task IDs'),
        limit: z.number().optional().default(50),
    },
    method: 'GET',
    path: '/tasks',
});

createBatchApiHandler({
    name: 'create_tasks',
    description: 'Create new tasks in Todoist',
    itemSchema: {
        ...create_fields,
        project_id: z
            .string()
            .optional()
            .describe("Task project ID. If not set, task is put to user's Inbox"),
        section_id: z.string().optional(),
        parent_id: z.string().optional(),
    },
    method: 'POST',
    path: '/tasks',
    mode: 'create',
});

createBatchApiHandler({
    name: 'get_tasks',
    description: 'Get tasks from Todoist',
    itemSchema: {
        task_id: z.string().optional().describe('ID of the task to retrieve (preferred)'),
        task_name: z
            .string()
            .optional()
            .describe('Name of the task to retrieve (if ID not provided)'),
    },
    method: 'GET',
    path: '/tasks/{id}',
    mode: 'read',
    idField: 'task_id',
    nameField: 'task_name',
    findByName: (name, items) =>
        items.find(item => item.content.toLowerCase().includes(name.toLowerCase())),
    validateItem: item => {
        if (!item.task_id && !item.task_name) {
            return {
                valid: false,
                error: 'Either task_id or task_name must be provided',
            };
        }
        return { valid: true };
    },
});

createBatchApiHandler({
    name: 'update_tasks',
    description: 'Update tasks in Todoist',
    itemSchema: {
        task_id: z.string().optional(),
        task_name: z.string().optional(),
        ...create_fields,
    },
    method: 'POST',
    path: '/tasks/{id}',
    mode: 'update',
    idField: 'task_id',
    nameField: 'task_name',
    findByName: (name, items) =>
        items.find(item => item.content.toLowerCase().includes(name.toLowerCase())),
    validateItem: item => {
        if (!item.task_id && !item.task_name) {
            return {
                valid: false,
                error: 'Either task_id or task_name must be provided',
            };
        }
        return { valid: true };
    },
});

createBatchApiHandler({
    name: 'close_tasks',
    description: 'Close tasks in Todoist',
    itemSchema: {
        task_id: z.string().optional(),
        task_name: z.string().optional(),
    },
    method: 'POST',
    path: '/tasks/{id}/close',
    mode: 'update',
    idField: 'task_id',
    nameField: 'task_name',
    findByName: (name, items) =>
        items.find(item => item.content.toLowerCase().includes(name.toLowerCase())),
    validateItem: item => {
        if (!item.task_id && !item.task_name) {
            return {
                valid: false,
                error: 'Either task_id or task_name must be provided',
            };
        }
        return { valid: true };
    },
});

createBatchApiHandler({
    name: 'reopen_tasks',
    description: 'Reopen tasks in Todoist',
    itemSchema: {
        task_id: z.string().optional(),
        task_name: z.string().optional(),
    },
    method: 'POST',
    path: '/tasks/{id}/reopen',
    mode: 'update',
    idField: 'task_id',
    nameField: 'task_name',
    findByName: (name, items) =>
        items.find(item => item.content.toLowerCase().includes(name.toLowerCase())),
    validateItem: item => {
        if (!item.task_id && !item.task_name) {
            return {
                valid: false,
                error: 'Either task_id or task_name must be provided',
            };
        }

        return { valid: true };
    },
});

createBatchApiHandler({
    name: 'delete_tasks',
    description: 'Delete tasks from Todoist',
    itemSchema: {
        task_id: z.string().optional(),
        task_name: z.string().optional(),
    },
    method: 'DELETE',
    path: '/tasks/{id}',
    mode: 'delete',
    idField: 'task_id',
    nameField: 'task_name',
    findByName: (name, items) =>
        items.find(item => item.content.toLowerCase().includes(name.toLowerCase())),
    validateItem: item => {
        if (!item.task_id && !item.task_name) {
            return {
                valid: false,
                error: 'Either task_id or task_name must be provided',
            };
        }

        return { valid: true };
    },
});

createSyncApiHandler({
    name: 'move_tasks',
    description: 'Move tasks to a different parent or section in Todoist',
    itemSchema: {
        task_id: z.string().optional(),
        task_name: z.string().optional(),
        parent_id: z.string().optional(),
        section_id: z.string().optional(),
        project_id: z.string().optional(),
    },
    commandType: 'item_move',
    idField: 'task_id',
    nameField: 'task_name',
    lookupPath: '/tasks',
    findByName: (name, items) =>
        items.find(item => item.content && item.content.toLowerCase().includes(name.toLowerCase())),
    buildCommandArgs: (item, itemId) => {
        const args: {
            id: string;
            parent_id?: string;
            section_id?: string;
            project_id?: string;
        } = { id: itemId };

        // Only one destination option
        if (item.parent_id) args.parent_id = item.parent_id;
        else if (item.section_id) args.section_id = item.section_id;
        else if (item.project_id) args.project_id = item.project_id;

        return args;
    },
    validateItem: item => {
        // Ensure exactly one destination is specified
        const destinationCount = [item.parent_id, item.section_id, item.project_id].filter(
            Boolean
        ).length;

        if (destinationCount !== 1) {
            return {
                valid: false,
                error: 'Exactly one of parent_id, section_id, or project_id must be provided',
            };
        }

        return { valid: true };
    },
});
