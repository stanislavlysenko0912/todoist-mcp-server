import {
    CallToolRequestSchema,
    GetPromptRequestSchema,
    Result,
} from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

export type ToolHandlers = Record<
    string,
    (request: z.infer<typeof CallToolRequestSchema>) => Promise<Result>
>;

export type ToolResult = {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
};

export type PromptResult = {
    messages: Array<{ role: string; content: { type: string; text: string } }>;
};

export type PromptHandlers = Record<
    string,
    (request: z.infer<typeof GetPromptRequestSchema>) => Promise<PromptResult>
>;
