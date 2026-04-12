import { todoistApi } from '../clients.js';
import { log } from './helpers.js';

const HEADER = 'Use this server to interact with Todoist API.';

const NOTES = [
    'Notes:',
    '- Todoist API priority is inverted: P1 (urgent) = 4, P2 = 3, P3 = 2, P4 (normal) = 1',
].join('\n');

/**
 * Fetches user context (projects, labels) and builds dynamic server instructions
 */
export async function buildInstructions(): Promise<string> {
    try {
        const [projects, labels] = await Promise.all([
            todoistApi.get('/projects', {}),
            todoistApi.get('/labels', {}),
        ]);

        const parts = [HEADER];

        if (Array.isArray(projects) && projects.length > 0) {
            const projectList = projects
                .map((p: { name: string; id: string }) => `- ${p.name} (id: ${p.id})`)
                .join('\n');
            parts.push(`\nUser projects:\n${projectList}`);
        }

        if (Array.isArray(labels) && labels.length > 0) {
            const labelList = labels.map((l: { name: string }) => l.name).join(', ');
            parts.push(`\nUser labels: ${labelList}`);
        }

        parts.push(`\n${NOTES}`);

        return parts.join('');
    } catch (error) {
        log('Failed to fetch user context for instructions:', error);
        return `${HEADER}\n\n${NOTES}`;
    }
}
