import { PROJECT_LIST_PROMPT, PROJECT_LIST_RPOMPT_HANDLER } from './prompts/projects.js';

export const ALL_PROMPTS = [PROJECT_LIST_PROMPT];

export const ALL_PROMPT_HANDLERS = {
    ...PROJECT_LIST_RPOMPT_HANDLER,
};
