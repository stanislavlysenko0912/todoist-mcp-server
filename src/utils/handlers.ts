/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from 'zod'
import { log, todoistApi } from "./helpers.js";
import { ToolResult } from "./types.js";

const createHandler = <TSchema extends z.ZodType<any>, TResult>(
    schema: TSchema,
    handler: (args: z.infer<TSchema>) => Promise<TResult>,
    errorPrefix: string
) => {
    return async (request: any): Promise<ToolResult> => {
        try {
            // Validate the request parameters against the schema
            const args = schema.parse(request.params.arguments);

            // Call the handler function with the validated arguments
            const result = await handler(args);

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2).trim()
                }],
            };
        } catch (error) {
            throw new Error(`${ errorPrefix }: ${ error instanceof Error ? error.message : String(error) }`);
        }
    };
};

type HttpMethod = 'GET' | 'POST' | 'DELETE';
type ParamTransformer<T> = (args: T) => Record<string, any>;
type ResultProcessor<T, R> = (result: any, args: T) => Promise<R> | R;

export function createApiHandler<T extends z.ZodRawShape, R = any>(
    options: {
        schemaShape: T,
        method: HttpMethod,
        path: string,
        errorPrefix: string,
        transformParams?: ParamTransformer<z.infer<z.ZodObject<T>>>,
        processResult?: ResultProcessor<z.infer<z.ZodObject<T>>, R>
    }
) {
    const schema = z.object(options.schemaShape);

    const handler = async (args: z.infer<typeof schema>): Promise<R> => {
        let finalPath = options.path;
        const pathParams: Record<string, string> = {};

        // Extract path parameters (e.g., {id}) and replace them with actual values
        const pathParamRegex = /{([^}]+)}/g;
        let match;

        while ((match = pathParamRegex.exec(options.path)) !== null) {
            const fullMatch = match[0];       // e.g., "{id}"
            const paramName = match[1];       // e.g., "id"

            if (args[paramName] === undefined) {
                throw new Error(`Path parameter ${ paramName } is required but not provided`);
            }

            const paramValue = String(args[paramName]);
            finalPath = finalPath.replace(fullMatch, paramValue);
            pathParams[paramName] = paramValue;
        }

        // Collect non-path parameters for query string or request body
        const otherParams = Object.entries(args).reduce((acc, [key, value]) => {
            if (value !== undefined && !pathParams[key]) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, any>);

        // Apply custom parameter transformation if provided
        const finalParams = options.transformParams ?
            options.transformParams(args) : otherParams;

        // Execute the API request based on HTTP method
        let result;
        switch (options.method) {
            case 'GET':
                result = await todoistApi.get(finalPath, finalParams);
                break;
            case 'POST':
                log('POST', finalPath, finalParams);
                result = await todoistApi.post(finalPath, finalParams);
                break;
            case 'DELETE':
                result = await todoistApi.delete(finalPath);
                break;
        }

        // Apply result post-processing if provided
        return options.processResult ? options.processResult(result, args) : result;
    };

    return createHandler(schema, handler, options.errorPrefix);
}