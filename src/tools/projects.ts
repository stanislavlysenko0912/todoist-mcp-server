import { z } from 'zod';
import {
    createApiHandler,
    createBatchApiHandler,
    createSyncApiHandler,
} from '../utils/handlers.js';

createApiHandler({
    name: 'get_projects_list',
    description: 'Get all projects from Todoist',
    schemaShape: {},
    method: 'GET',
    path: '/projects',
});

createBatchApiHandler({
    name: 'create_projects',
    description: 'Create new projects in Todoist',
    itemSchema: {
        name: z.string(),
        parent_id: z.string().optional(),
        color: z.string().optional(),
        is_favorite: z.boolean().optional(),
        view_style: z.enum(['list', 'board']).optional(),
    },
    method: 'POST',
    path: '/projects',
    mode: 'create',
});

createBatchApiHandler({
    name: 'get_projects',
    description: 'Get projects from Todoist',
    itemSchema: {
        id: z.string().optional().describe('ID of the project to retrieve (preferred over name)'),
        name: z.string().optional().describe('Name of the project to retrieve'),
    },
    method: 'GET',
    path: '/projects/{id}',
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
    name: 'update_projects',
    description: 'Update projects in Todoist',
    itemSchema: {
        id: z.string().optional().describe('ID of the project to update (preferred over name)'),
        name: z.string().optional().describe('Name of the project to update'),
        color: z.string().optional(),
        is_favorite: z.boolean().optional(),
        view_style: z.enum(['list', 'board']).optional(),
    },
    method: 'POST',
    path: '/projects/{id}',
    mode: 'update',
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
    name: 'delete_projects',
    description: 'Delete projects from Todoist',
    itemSchema: {
        id: z.string().optional().describe('ID of the project to delete (preferred over name)'),
        name: z.string().optional().describe('Name of the project to delete'),
    },
    method: 'DELETE',
    path: '/projects/{id}',
    mode: 'delete',
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

createApiHandler({
    name: 'get_collaborators',
    description: 'Get all collaborators for a project in Todoist',
    schemaShape: {
        id: z.string(),
    },
    method: 'GET',
    path: '/projects/{id}/collaborators',
});

createSyncApiHandler({
    name: 'move_projects',
    description: 'Move a projects to a different parent in Todoist',
    itemSchema: {
        id: z.string().optional().describe('ID of the project to move (preferred over name)'),
        name: z.string().optional().describe('Name of the project to move'),
        parent_id: z.string().nullable(),
    },
    commandType: 'project_move',
    idField: 'id',
    nameField: 'name',
    lookupPath: '/projects',
    findByName: (name, items) =>
        items.find(item => item.name.toLowerCase().includes(name.toLowerCase())),
    buildCommandArgs: (item, itemId) => {
        return {
            id: itemId,
            parent_id: item.parent_id,
        };
    },
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
