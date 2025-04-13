import { z } from 'zod';
import { createApiHandler, createBatchApiHandler } from '../utils/handlers.js';

createApiHandler({
    name: 'get_sections_list',
    description: 'Get sections list from Todoist',
    schemaShape: {
        project_id: z.string().optional(),
    },
    method: 'GET',
    path: '/sections',
});

createBatchApiHandler({
    name: 'create_sections',
    description: 'Create new sections in Todoist',
    itemSchema: {
        name: z.string(),
        project_id: z.string(),
        order: z.number().int().optional(),
    },
    method: 'POST',
    path: '/sections',
    mode: 'create',
});

createBatchApiHandler({
    name: 'get_sections',
    description: 'Get sections from Todoist',
    itemSchema: {
        id: z.string().optional(),
        name: z.string().optional(),
    },
    method: 'GET',
    path: '/sections/{id}',
    mode: 'read',
    idField: 'id',
    nameField: 'name',
    findByName: (name, items) =>
        items.find(item => item.name.toLowerCase().includes(name.toLowerCase())),
});

createBatchApiHandler({
    name: 'update_sections',
    description: 'Update sections in Todoist',
    itemSchema: {
        id: z.string(),
        name: z.string().optional(),
    },
    method: 'POST',
    path: '/sections/{id}',
    mode: 'update',
    idField: 'id',
});

createBatchApiHandler({
    name: 'delete_sections',
    description: 'Delete sections in Todoist',
    itemSchema: {
        id: z.string().optional(),
        name: z.string().optional(),
    },
    method: 'DELETE',
    path: '/sections/{id}',
    idField: 'id',
    nameField: 'name',
    mode: 'delete',
    findByName: (name, items) =>
        items.find(item => item.name.toLowerCase().includes(name.toLowerCase())),
});
