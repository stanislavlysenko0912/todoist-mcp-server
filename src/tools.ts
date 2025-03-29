import { TASKS_TOOLS, TASK_HANDLERS } from "./tools/tasks.js";
import { PROJECT_TOOLS, PROJECT_HANDLERS } from "./tools/projects.js";
import { SECTION_TOOLS, SECTION_HANDLERS } from "./tools/sections.js";
import { UTILS_TOOLS, UTILS_HANDLERS } from "./tools/utils.js";
import { COMMENTS_TOOLS, COMMENT_HANDLERS } from "./tools/comments.js";
import { LABELS_TOOLS, LABEL_HANDLERS } from "./tools/labels.js";

export const ALL_TOOLS = [
    ...TASKS_TOOLS,
    ...PROJECT_TOOLS,
    ...SECTION_TOOLS,
    ...COMMENTS_TOOLS,
    ...LABELS_TOOLS,
    ...UTILS_TOOLS
]

export const ALL_HANDLERS = {
    ...TASK_HANDLERS,
    ...PROJECT_HANDLERS,
    ...SECTION_HANDLERS,
    ...COMMENT_HANDLERS,
    ...LABEL_HANDLERS,
    ...UTILS_HANDLERS
}
