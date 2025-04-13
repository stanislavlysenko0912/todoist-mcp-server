import { z } from 'zod';
import {
    createApiHandler,
    createBatchApiHandler,
    createSyncApiHandler,
} from '../utils/handlers.js';

/// Common fields for create and update tasks
const create_fields = {
    content: z.string(),
    description: z.string().optional(),
    labels: z.array(z.string()).optional(),
    priority: z.number().int().min(1).max(4).optional(),
    due_string: z.string().optional(),
    due_date: z.string().optional(),
    due_datetime: z.string().optional(),
    due_lang: z.string().optional(),
    assignee_id: z.string().optional(),
    duration: z.number().int().positive().optional(),
    duration_unit: z.enum(['minute', 'day']).optional(),
};

createApiHandler({
    name: 'get_tasks_list',
    description: 'Get tasks list from Todoist',
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
});

createBatchApiHandler({
    name: 'create_tasks',
    description: 'Create new tasks in Todoist',
    itemSchema: {
        ...create_fields,
        project_id: z.string().optional(),
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
        task_id: z.string().optional(),
        task_name: z.string().optional(),
    },
    method: 'GET',
    path: '/tasks/{id}',
    mode: 'read',
    idField: 'task_id',
    nameField: 'task_name',
    findByName: (name, items) =>
        items.find(item => item.content.toLowerCase().includes(name.toLowerCase())),
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
