import { TodoistClient } from './TodoistClient.js'

const debug = true

export function log(...args: unknown[]) {
    if (debug) {
        const msg = `[DEBUG ${ new Date().toISOString() }] ${ args.join(' ') }\n`
        process.stderr.write(msg)
    }
}

export const config = {
    API_KEY: process.env.API_KEY ?? ""
}

export const todoistApi = new TodoistClient(config.API_KEY)

export { version } from './version.js'
