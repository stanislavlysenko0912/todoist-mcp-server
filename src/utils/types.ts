import { CallToolRequestSchema, Result } from '@modelcontextprotocol/sdk/types.js';
import z from 'zod';

export type ToolHandlers = Record<
    string,
    (request: z.infer<typeof CallToolRequestSchema>) => Promise<Result>
>;

export type ToolResult = {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
};

export type SyncCommand = {
    type: string;
    uuid: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: Record<string, any>;
};
