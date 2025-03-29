import { Tool } from '@modelcontextprotocol/sdk/types.js'
import { ToolHandlers, ToolResult } from '../utils/types.js'

export const UTILS_TOOLS: Tool[] = [
    {
        name: 'utils_get_colors',
        description: 'Get available colors for projects, labels, filters in Todoist',
        inputSchema: {
            type: "object"
        }
    }
]

export const UTILS_HANDLERS: ToolHandlers = {
    utils_get_colors: async (): Promise<ToolResult> => {
        const colors = [
            { id: 30, name: 'berry_red', hex: '#B8255F' },
            { id: 31, name: 'red', hex: '#DC4C3E' },
            { id: 32, name: 'orange', hex: '#C77100' },
            { id: 33, name: 'yellow', hex: '#B29104' },
            { id: 34, name: 'olive_green', hex: '#949C31' },
            { id: 35, name: 'lime_green', hex: '#65A33A' },
            { id: 36, name: 'green', hex: '#369307' },
            { id: 37, name: 'mint_green', hex: '#42A393' },
            { id: 38, name: 'teal', hex: '#148FAD' },
            { id: 39, name: 'sky_blue', hex: '#319DC0' },
        ];

        return {
            content: [{
                type: 'text',
                text: `${colors.map(color => `ID: ${color.id}, ${color.name}, (${color.hex})`).join('. ')}`
            }]
        }
    }
}