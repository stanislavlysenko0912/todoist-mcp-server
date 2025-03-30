/* eslint-disable @typescript-eslint/no-explicit-any */

import { v4 as uuidv4 } from 'uuid';
import { log } from './helpers.js';

const API_BASE_URL = 'https://api.todoist.com/rest/v2';
const API_SYNC_BASE_URL = 'https://api.todoist.com/sync/v9';

export class TodoistClient {
    private readonly apiToken: string;

    constructor(apiToken: string) {
        this.apiToken = apiToken;
    }

    private getHeaders(includeContentType = false): HeadersInit {
        const headers: HeadersInit = {
            'Authorization': `Bearer ${ this.apiToken }`,
            'Accept': 'application/json',
            'X-Request-Id': uuidv4()
        };

        if (includeContentType) {
            headers['Content-Type'] = 'application/json';
        }

        return headers;
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Todoist API error (${ response.status }): ${ errorText }`);
        }

        // For 204 No Content responses
        if (response.status === 204) {
            return null;
        }

        return response.json();
    }

    /**
     * Make a GET request to Todoist API
     * @param endpoint - API endpoint path (without base URL)
     * @param params - Query parameters object
     * @returns API response data
     */
    async get(endpoint: string, params: Record<string, string> = {}): Promise<any> {
        let url = `${ API_BASE_URL }${ endpoint }`;

        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value) {
                queryParams.append(key, value);
            }
        }

        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${ queryString }`;
        }

        log(`Making GET request to: ${ url }`);

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        });

        return this.handleResponse(response);
    }

    /**
     * Make a POST request to Todoist API
     * @param endpoint - API endpoint path (without base URL)
     * @param data - Request body data
     * @returns API response data
     */
    async post(endpoint: string, data: Record<string, any> = {}): Promise<any> {
        const url = `${ API_BASE_URL }${ endpoint }`;

        log(`Making POST request to: ${ url } with data:`, JSON.stringify(data, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(data)
        });

        return this.handleResponse(response);
    }

    /**
     * Make a DELETE request to Todoist API
     * @param endpoint - API endpoint path (without base URL)
     * @returns API response data
     */
    async delete(endpoint: string): Promise<any> {
        const url = `${ API_BASE_URL }${ endpoint }`;

        log(`Making DELETE request to: ${ url }`);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        return this.handleResponse(response);
    }

    /**
     * Make a Sync API request to Todoist
     * @param commands - Array of command objects to execute
     * @returns API response data
     */
    async sync(commands: Array<{
        type: string;
        uuid: string;
        args: Record<string, any>;
    }>): Promise<any> {
        const url = `${ API_SYNC_BASE_URL }/sync`;

        log(`Making SYNC request to: ${ url } with commands:`, JSON.stringify(commands, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify({commands})
        });

        return this.handleResponse(response);
    }
}