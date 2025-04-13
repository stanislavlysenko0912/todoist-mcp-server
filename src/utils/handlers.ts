/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from 'zod';
import { log } from './helpers.js';
import { todoistApi } from "../clients.js";
import { ToolResult } from './types.js';
import { v4 as uuidv4 } from 'uuid';

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
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2).trim(),
                    },
                ],
            };
        } catch (error) {
            throw new Error(
                `${errorPrefix}: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    };
};

type HttpMethod = 'GET' | 'POST' | 'DELETE';
type ParamTransformer<T> = (args: T) => Record<string, any>;
type ResultProcessor<T, R> = (result: any, args: T) => Promise<R> | R;

export function createApiHandler<T extends z.ZodRawShape, R = any>(options: {
    schemaShape: T;
    method: HttpMethod;
    path: string;
    errorPrefix: string;
    transformParams?: ParamTransformer<z.infer<z.ZodObject<T>>>;
    processResult?: ResultProcessor<z.infer<z.ZodObject<T>>, R>;
}) {
    const schema = z.object(options.schemaShape);

    const handler = async (args: z.infer<typeof schema>): Promise<R> => {
        let finalPath = options.path;
        const pathParams: Record<string, string> = {};

        // Extract path parameters (e.g., {id}) and replace them with actual values
        const pathParamRegex = /{([^}]+)}/g;
        let match;

        while ((match = pathParamRegex.exec(options.path)) !== null) {
            const fullMatch = match[0]; // e.g., "{id}"
            const paramName = match[1]; // e.g., "id"

            if (args[paramName] === undefined) {
                throw new Error(`Path parameter ${paramName} is required but not provided`);
            }

            const paramValue = String(args[paramName]);
            finalPath = finalPath.replace(fullMatch, paramValue);
            pathParams[paramName] = paramValue;
        }

        // Collect non-path parameters for query string or request body
        const otherParams = Object.entries(args).reduce(
            (acc, [key, value]) => {
                if (value !== undefined && !pathParams[key]) {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, any>
        );

        // Apply custom parameter transformation if provided
        const finalParams = options.transformParams ? options.transformParams(args) : otherParams;

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

export function createBatchApiHandler<T extends z.ZodRawShape>(
    options: {
        itemSchema: T;
        method: HttpMethod;
        errorPrefix: string;
        mode?: 'read' | 'create' | 'update' | 'delete';
        idField?: string;
        nameField?: string;
        findByName?: (name: string, items: any[]) => any | undefined;
    } & ( // Or we specify full path
        | {
              path: string;
              basePath?: never;
              pathSuffix?: never;
          }
        // Or we specify base path and path suffix
        | {
              path?: never;
              basePath: string;
              pathSuffix: string;
          }
    )
) {
    const itemSchemaObj = z.object(options.itemSchema);
    const batchSchema = z.object({
        items: z.array(itemSchemaObj),
    });

    const handler = async (args: z.infer<typeof batchSchema>): Promise<any> => {
        const { items } = args;

        // For modes other than create, check if name lookup is needed
        let allItems: any[] = [];

        const needsNameLookup =
            options.mode !== 'create' &&
            options.nameField &&
            options.findByName &&
            items.some(item => item[options.nameField!] && !item[options.idField!]);

        if (needsNameLookup) {
            // Determine the base path for fetching all items
            // Example: /tasks from /tasks/{id}
            const lookupPath =
                options.basePath || (options.path ? options.path.split('/{')[0] : '');
            allItems = await todoistApi.get(lookupPath, {});
        }

        const results = await Promise.all(
            items.map(async item => {
                try {
                    let finalPath = '';
                    const apiParams = { ...item };

                    // For modes where need id
                    if (options.mode !== 'create' && options.idField) {
                        let itemId = item[options.idField];
                        let matchedName = null;
                        let matchedContent = null;

                        // If no ID but name is provided, search by name
                        if (!itemId && item[options.nameField!] && options.findByName) {
                            const searchName = item[options.nameField!];
                            const matchedItem = options.findByName(searchName, allItems);

                            if (!matchedItem) {
                                return {
                                    success: false,
                                    error: `Item not found with name: ${searchName}`,
                                    item,
                                };
                            }

                            itemId = matchedItem.id;
                            matchedName = searchName;
                            matchedContent = matchedItem.content;
                        }

                        if (!itemId) {
                            return {
                                success: false,
                                error: `Either ${options.idField} or ${options.nameField} must be provided`,
                                item,
                            };
                        }

                        if (options.basePath && options.pathSuffix) {
                            finalPath = `${options.basePath}${options.pathSuffix.replace('{id}', itemId)}`;
                        } else if (options.path) {
                            finalPath = options.path.replace('{id}', itemId);
                        }

                        delete apiParams[options.idField];
                        if (options.nameField) {
                            delete apiParams[options.nameField];
                        }

                        let result;
                        switch (options.method) {
                            case 'GET':
                                result = await todoistApi.get(finalPath, apiParams);
                                break;
                            case 'POST':
                                result = await todoistApi.post(finalPath, apiParams);
                                break;
                            case 'DELETE':
                                result = await todoistApi.delete(finalPath);
                                break;
                        }

                        const response: any = {
                            success: true,
                            id: itemId,
                            result,
                        };

                        if (matchedName) {
                            response.found_by_name = matchedName;
                            response.matched_content = matchedContent;
                        }

                        return response;
                    }
                    // Create mode
                    else {
                        finalPath = options.path || options.basePath || '';

                        let result;
                        switch (options.method) {
                            case 'GET':
                                result = await todoistApi.get(finalPath, apiParams);
                                break;
                            case 'POST':
                                result = await todoistApi.post(finalPath, apiParams);
                                break;
                            case 'DELETE':
                                result = await todoistApi.delete(finalPath);
                                break;
                        }

                        return {
                            success: true,
                            created_item: result,
                        };
                    }
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : String(error),
                        item,
                    };
                }
            })
        );

        const successCount = results.filter(r => r.success).length;
        return {
            success: successCount === items.length,
            summary: {
                total: items.length,
                succeeded: successCount,
                failed: items.length - successCount,
            },
            results,
        };
    };

    return createHandler(batchSchema, handler, options.errorPrefix);
}

export function createSyncApiHandler<T extends z.ZodRawShape>(options: {
    itemSchema: T;
    commandType: string; // The sync command type (e.g., 'item_move')
    errorPrefix: string;
    idField: string;
    nameField?: string;
    lookupPath?: string; // Configurable path for lookup
    findByName?: (name: string, items: any[]) => any | undefined;
    buildCommandArgs: (item: any, itemId: string) => Record<string, any>;
    validateItem?: (item: any) => { valid: boolean; error?: string }; // Optional validation
}) {
    const itemSchemaObj = z.object(options.itemSchema);
    const batchSchema = z.object({
        items: z.array(itemSchemaObj),
    });

    const handler = async (args: z.infer<typeof batchSchema>): Promise<any> => {
        const { items } = args;

        try {
            // For name lookup if needed
            let allItems: any[] = [];

            const needsNameLookup =
                options.nameField &&
                options.findByName &&
                items.some(item => item[options.nameField!] && !item[options.idField]);

            if (needsNameLookup) {
                if (!options.lookupPath) {
                    throw new Error(
                        `${options.errorPrefix}: lookupPath must be specified for name-based lookup`
                    );
                }
                // Generic lookup path for any resource type
                allItems = await todoistApi.get(options.lookupPath, {});
            }

            // Build commands array for Sync API
            const commands = [];
            const failedItems = [];

            for (const item of items) {
                // Optional pre-validation
                if (options.validateItem) {
                    const validation = options.validateItem(item);
                    if (!validation.valid) {
                        failedItems.push({
                            success: false,
                            error: validation.error || 'Validation failed',
                            item,
                        });
                        continue;
                    }
                }

                let itemId = item[options.idField];

                // Lookup by name if needed
                if (!itemId && item[options.nameField!] && options.findByName) {
                    const searchName = item[options.nameField!];
                    const matchedItem = options.findByName(searchName, allItems);

                    if (!matchedItem) {
                        failedItems.push({
                            success: false,
                            error: `Item not found with name: ${searchName}`,
                            item,
                        });
                        continue;
                    }

                    itemId = matchedItem.id;
                }

                if (!itemId) {
                    failedItems.push({
                        success: false,
                        error: `Either ${options.idField} or ${options.nameField} must be provided`,
                        item,
                    });
                    continue;
                }

                // Use the provided function to build command args
                const commandArgs = options.buildCommandArgs(item, itemId);

                commands.push({
                    type: options.commandType,
                    uuid: uuidv4(),
                    args: commandArgs,
                });
            }

            // If all items failed validation, return early
            if (failedItems.length === items.length) {
                return {
                    success: false,
                    summary: {
                        total: items.length,
                        succeeded: 0,
                        failed: items.length,
                    },
                    results: failedItems,
                };
            }

            // Execute the sync command if any valid commands exist
            let syncResult = null;
            if (commands.length > 0) {
                syncResult = await todoistApi.sync(commands);
            }

            // Combine successful and failed results
            const successfulResults = commands.map(command => ({
                success: true,
                id: command.args.id,
                command,
            }));

            const results = [...successfulResults, ...failedItems];

            return {
                success: failedItems.length === 0,
                summary: {
                    total: items.length,
                    succeeded: items.length - failedItems.length,
                    failed: failedItems.length,
                },
                results,
                sync_result: syncResult,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    };

    return createHandler(batchSchema, handler, options.errorPrefix);
}
