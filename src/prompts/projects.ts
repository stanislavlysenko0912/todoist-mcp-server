import { server, todoistApi } from "../clients.js";

type SectionType = {
    id: string | number;
    name: string;
    project_id: string | number;
};

type SectionsByProjectType = {
    [key: string | number]: SectionType[];
};

type Project = {
    is_inbox_project: boolean;
    is_shared: boolean;
    url: string;
    id: string | number;
    name: string;
    order: number;
    parent_id: number;
    view_style: string;
    description: string;
};

export const PROJECT_LIST_PROMPT = {
    name: 'projects_list',
    description: 'List of projects',
};

server.prompt(PROJECT_LIST_PROMPT.name, {}, async () => {
        const [projects, sections] = await Promise.all([
            todoistApi.get('/projects'),
            todoistApi.get('/sections'),
        ]);

        const sectionsByProject: SectionsByProjectType = sections.reduce(
            (acc: SectionsByProjectType, section: SectionType) => {
                acc[section.project_id] = acc[section.project_id] || [];
                acc[section.project_id].push(section);
                return acc;
            },
            {}
        );

        const markdownParts = [
            '# Todoist Projects Overview',
            '',
            `*Total Projects: ${ projects.length }*`,
            '',
        ];

        projects.forEach((project: Project) => {
            const projectSections = sectionsByProject[project.id] || [];

            markdownParts.push(`## ${ project.name }`);

            markdownParts.push('| Property | Value |');
            markdownParts.push('| -------- | ----- |');
            markdownParts.push(`| ID | \`${ project.id }\` |`);
            markdownParts.push(`| Order | ${ project.order } |`);
            markdownParts.push(`| Parent ID | ${ project.parent_id || 'None' } |`);
            markdownParts.push(`| View Style | ${ project.view_style } |`);

            if (project.is_inbox_project) markdownParts.push(`| Status | Inbox Project |`);
            if (project.is_shared) markdownParts.push(`| Sharing | Shared |`);

            // if (project.url) markdownParts.push(`| URL | [Open in Todoist](${project.url}) |`);

            if (project.description?.length > 0) {
                const truncatedDescription =
                    project.description.length > 100
                        ? `${ project.description.substring(0, 100).split(' ').slice(0, -1).join(' ') }...`
                        : project.description;

                markdownParts.push(`| Description | ${ truncatedDescription } |`);
            }

            markdownParts.push('');

            if (projectSections.length > 0) {
                markdownParts.push(`### Sections (${ projectSections.length })`);

                projectSections.forEach(section => {
                    markdownParts.push(`- **${ section.name }** (ID: \`${ section.id }\`)`);
                });
            } else {
                markdownParts.push('### Sections\n*No sections found*');
            }

            markdownParts.push('');
        });

        return {
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: markdownParts.join('\n'),
                    },
                },
            ],
        };
    }
);
