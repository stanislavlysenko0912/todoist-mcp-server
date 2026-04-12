import { todoistApi } from '../clients.js';
import { log } from './helpers.js';

const HEADER = 'Use this server to interact with Todoist API.';
const PREVIEW_LIMIT = 20;

const NOTES = [
    'Notes:',
    '- Todoist API priority is inverted: P1 (urgent) = 4, P2 = 3, P3 = 2, P4 (normal) = 1',
].join('\n');

/**
 * Truncates a list and appends "(+N more)" if it exceeds the limit
 */
function truncateList(items: string[]): string {
    const visible = items.slice(0, PREVIEW_LIMIT);
    const remaining = items.length - visible.length;
    const result = visible.join(', ');
    return remaining > 0 ? `${result} (+${remaining} more)` : result;
}

/**
 * Fetches user context (projects, labels) and builds dynamic server instructions
 */
export async function buildInstructions(): Promise<string> {
    try {
        const [projects, personalLabels, sharedLabels] = await Promise.all([
            todoistApi.get('/projects', {}),
            todoistApi.get('/labels', {}),
            todoistApi.get('/labels/shared', {}),
        ]);

        const parts = [HEADER];

        if (Array.isArray(projects) && projects.length > 0) {
            const projectList = projects
                .map((p: { name: string; id: string }) => `- ${p.name} (id: ${p.id})`)
                .join('\n');
            parts.push(`\nUser projects:\n${projectList}`);
        }

        if (Array.isArray(personalLabels) && personalLabels.length > 0) {
            const names = personalLabels.map((l: { name: string }) => l.name);
            parts.push(`\nPersonal labels: ${truncateList(names)}`);
        }

        if (Array.isArray(sharedLabels) && sharedLabels.length > 0) {
            parts.push(`\nShared labels: ${truncateList(sharedLabels)}`);
        }

        parts.push(`\n${NOTES}`);

        return parts.join('');
    } catch (error) {
        log('Failed to fetch user context for instructions:', error);
        return `${HEADER}\n\n${NOTES}`;
    }
}
