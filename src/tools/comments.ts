import { z } from 'zod';
import { createApiHandler, createBatchApiHandler } from '../utils/handlers.js';

createApiHandler({
    name: 'get_comments_list',
    description: 'Get comments list from Todoist',
    schemaShape: {
        project_id: z.string().optional(),
        task_id: z.string().optional(),
    },
    method: 'GET',
    path: '/comments',
});

createBatchApiHandler({
    name: 'create_comments',
    description: 'Create new comments in Todoist',
    itemSchema: {
        task_id: z.string().optional(),
        project_id: z.string().optional(),
        content: z.string(),
        // attachment: z.object({}).optional(),
    },
    method: 'POST',
    path: '/comments',
    mode: 'create',
});

createBatchApiHandler({
    name: 'get_comments',
    description: 'Get comments from Todoist by ID',
    itemSchema: {
        id: z.string(),
    },
    method: 'GET',
    path: '/comments/{id}',
    mode: 'read',
    idField: 'id',
});

createBatchApiHandler({
    name: 'update_comments',
    description: 'Update comments in Todoist',
    itemSchema: {
        id: z.string(),
        content: z.string(),
    },
    method: 'POST',
    path: '/comments/{id}',
    mode: 'update',
    idField: 'id',
});

createBatchApiHandler({
    name: 'delete_comments',
    description: 'Delete comments in Todoist',
    itemSchema: {
        id: z.string(),
    },
    method: 'DELETE',
    path: '/comments/{id}',
    idField: 'id',
    mode: 'delete',
});
