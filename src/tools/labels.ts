import { z } from 'zod';
import { createApiHandler, createBatchApiHandler } from '../utils/handlers.js';

createApiHandler({
    name: 'get_labels_list',
    description: 'Get all personal labels from Todoist',
    schemaShape: {},
    method: 'GET',
    path: '/labels',
});

createBatchApiHandler({
    name: 'create_labels',
    description: 'Create a new personal labels in Todoist',
    itemSchema: {
        name: z.string(),
        order: z.number().int().optional(),
        color: z
            .string()
            .optional()
            .describe('Refer to the name column in the `utils_get_colors` tool for more info'),
        is_favorite: z.boolean().optional(),
    },
    method: 'POST',
    path: '/labels',
    mode: 'create',
});

createBatchApiHandler({
    name: 'get_labels',
    description: 'Get a personal label from Todoist',
    itemSchema: {
        id: z.string().optional().describe('ID of the label to retrieve (preferred over name)'),
        name: z.string().optional().describe('Name of the label to retrieve'),
    },
    method: 'GET',
    path: '/labels/{id}',
    mode: 'read',
    idField: 'id',
    nameField: 'name',
    findByName: (name, items) =>
        items.find(item => item.name.toLowerCase().includes(name.toLowerCase())),
    validateItem: item => {
        if (!item.name && !item.id) {
            return {
                valid: false,
                error: 'Either name or id must be provided',
            };
        }

        return { valid: true };
    },
});

createBatchApiHandler({
    name: 'update_labels',
    description: 'Update a personal label in Todoist',
    itemSchema: {
        id: z.string(),
        name: z.string().optional(),
        order: z.number().int().optional(),
        color: z
            .string()
            .optional()
            .describe('Refer to the name column in the `utils_get_colors` tool for more info'),
        is_favorite: z.boolean().optional(),
    },
    method: 'POST',
    path: '/labels/{id}',
    mode: 'update',
    idField: 'id',
});

createBatchApiHandler({
    name: 'delete_labels',
    description: 'Delete a personal label in Todoist',
    itemSchema: {
        id: z.string().optional().describe('ID of the label to delete (preferred over name)'),
        name: z.string().optional().describe('Name of the label to delete'),
    },
    method: 'DELETE',
    path: '/labels/{id}',
    idField: 'id',
    nameField: 'name',
    mode: 'delete',
    findByName: (name, items) =>
        items.find(item => item.name.toLowerCase().includes(name.toLowerCase())),
    validateItem: item => {
        if (!item.name && !item.id) {
            return {
                valid: false,
                error: 'Either name or id must be provided',
            };
        }

        return { valid: true };
    },
});

createApiHandler({
    name: 'get_shared_labels',
    description: 'Get all shared labels from Todoist',
    schemaShape: {},
    method: 'GET',
    path: '/labels/shared',
});

createBatchApiHandler({
    name: 'rename_shared_labels',
    description: 'Rename a shared label in Todoist',
    itemSchema: {
        name: z.string(),
        new_name: z.string(),
    },
    method: 'POST',
    path: '/labels/shared/rename',
    mode: 'update',
});

createBatchApiHandler({
    name: 'remove_shared_labels',
    description: 'Remove a shared label in Todoist',
    itemSchema: {
        name: z.string(),
    },
    method: 'POST',
    path: '/labels/shared/remove',
    mode: 'delete',
});
