<div align="center">
    <img src="https://img.icons8.com/color/200/todoist.png" width="120"/>
    <h1>Todoist MCP Server</h1>
    <p>A Model Context Protocol (MCP) server implementation that integrates Claude and other AI assistants with Todoist, enabling natural language task management.</p>
    <div>
        <img src="https://img.shields.io/badge/claude-mcp-blue" alt="MCP Server">
        <img src="https://img.shields.io/badge/todoist-mcp-orange" alt="Todoist Integration">
        <a href="https://www.npmjs.com/package/todoist-mcp" target="_blank">
            <img src="https://img.shields.io/npm/v/todoist-mcp.svg" alt="npm version">
        </a>
    </div>
</div>

## Features

- **Complete Todoist API Integration**: Access to the full Todoist REST API v2, and support for the Todoist Sync API through natural language
- **Batch Processing**: Client can process multiple tasks in a single request
- **Search by name**: AI can search for tasks, projects, and labels by name instead of ID
- **Tasks**: Create, update, close, reopen, move, and delete tasks using conversational language
- **Projects**: Create and manage projects and sections
- **Comments**: Add and manage comments on tasks and projects
- **Labels**: Create and manage personal and shared labels
- **Prompt Support**: You can easily provide information about your projects to client

## Configuration

You'll need a Todoist API token to use this MCP server.

### Getting a Todoist API Token

1. Log in to your Todoist account
2. Navigate to Settings → Integrations
3. Find your API token under "Developer"

### Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
    "mcpServers": {
        "todoist": {
            "command": "npx",
            "args": ["-y", "todoist-mcp"],
            "env": {
                "API_KEY": "your_todoist_api_token_here"
            }
        }
    }
}
```

## Available Tools

### Tasks

- `get_tasks_list`: Get tasks with optional filtering by project, section, label, etc.
- `create_tasks`: Create new tasks with various attributes
- `get_tasks`: Get specific tasks by ID or name
- `update_tasks`: Update existing tasks
- `close_tasks`: Mark tasks as complete
- `reopen_tasks`: Reopen completed tasks
- `delete_tasks`: Delete tasks
- `move_tasks`: Move tasks to a different project or section

### Projects

- `get_projects_list`: Get all projects
- `create_projects`: Create new projects
- `get_projects`: Get specific projects by ID or name
- `update_projects`: Update existing projects
- `delete_projects`: Delete projects
- `get_collaborators`: Get all collaborators for a project
- `move_projects`: Move projects to a different location or subproject

### Sections

- `get_sections_list`: Get all sections or filter by project
- `create_sections`: Create new sections
- `get_sections`: Get specific sections by ID or name
- `update_sections`: Update sections
- `delete_sections`: Delete sections

### Comments

- `get_comments_list`: Get comments for a project or task
- `create_comments`: Create new comments
- `get_comments`: Get specific comments by ID
- `update_comments`: Update comments
- `delete_comments`: Delete comments

### Labels

- `get_labels_list`: Get all personal labels
- `create_labels`: Create new personal labels
- `get_labels`: Get personal labels by ID or name
- `update_labels`: Update personal labels
- `delete_labels`: Delete personal labels
- `get_shared_labels`: Get all shared labels
- `rename_shared_labels`: Rename shared labels
- `remove_shared_labels`: Remove shared labels

### Utils

- `utils_get_colors`: Get available colors for projects, labels, filters

## Prompts

- `projects_list`: Get list of projects with their sections and params in markdown format

## Example Usage

Ask your AI assistant (like Claude) questions such as:

```
"What tasks do I have due today?"
"Create a task to review the quarterly report by next Friday"
"Make a new project called 'Home Renovation'"
"Add a comment to my meeting prep task"
"Show me all my high priority tasks"
"Create a label for 'Urgent' tasks with a red color"
"What projects do I have in my Todoist?"
"Mark my dentist appointment task as complete"
```

## Development

```bash
# Install dependencies
npm install

# Build the project and run inspector
npm run build && npx @modelcontextprotocol/inspector -e API_KEY=YOUR_API_KEY_HERE node dist/index.js
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Issues and Support

If you encounter any issues or need support, please file an issue on the GitHub repository.

<a href="https://glama.ai/mcp/servers/@stanislavlysenko0912/todoist-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@stanislavlysenko0912/todoist-mcp-server/badge" />
</a>
