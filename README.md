<div align="center">
    <img src="https://static-00.iconduck.com/assets.00/todoist-icon-512x512-v3a6dxo9.png" width="120"/>
    <h1>Todoist MCP Server</h1>
    <p>A Model Context Protocol (MCP) server implementation that integrates Claude and other AI assistants with Todoist, enabling natural language task management.</p>
    <div>
        <img src="https://img.shields.io/badge/claude-mcp-blue" alt="MCP Server">
        <img src="https://img.shields.io/badge/todoist-mcp-orange" alt="Todoist Integration">
        <a href="https://www.npmjs.com/package/todoist-mcp" target="_blank">
            <img src="https://img.shields.io/npm/dt/todoist-mcp.svg" alt="npm downloads">
        </a>
    </div>
</div>

## Features

* **Complete Todoist API Integration**: Access to the full Todoist REST API v2 through natural language
* **Tasks Management**: Create, update, close, reopen, and delete tasks using conversational language
* **Project Management**: Create and manage projects and sections
* **Comments Support**: Add and manage comments on tasks and projects
* **Label Management**: Create and manage personal and shared labels

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
      "args": [
        "-y",
        "todoist-mcp"
      ],
      "env": {
        "API_KEY": "your_todoist_api_token_here"
      }
    }
  }
}
```

## Available Tools

### Tasks

- `get_tasks`: Retrieve tasks with optional filtering
- `create_task`: Create a new task with various attributes
- `get_task`: Get a specific task by ID
- `update_task`: Update an existing task
- `close_task`: Mark a task as complete
- `reopen_task`: Reopen a completed task
- `delete_task`: Delete a task

### Projects

- `get_projects`: Get all projects
- `create_project`: Create a new project
- `get_project`: Get a specific project by ID
- `update_project`: Update an existing project
- `delete_project`: Delete a project
- `get_collaborators`: Get all collaborators for a project

### Sections

- `get_sections`: Get all sections or filter by project
- `create_section`: Create a new section
- `get_section`: Get a specific section by ID
- `update_section`: Update a section
- `delete_section`: Delete a section

### Comments

- `get_comments`: Get comments for a project or task
- `create_comment`: Create a new comment
- `get_comment`: Get a specific comment by ID
- `update_comment`: Update a comment
- `delete_comment`: Delete a comment

### Labels

- `get_labels`: Get all personal labels
- `create_label`: Create a new personal label
- `get_label`: Get a personal label by ID
- `update_label`: Update a personal label
- `delete_label`: Delete a personal label
- `get_shared_labels`: Get all shared labels
- `rename_shared_label`: Rename a shared label
- `remove_shared_label`: Remove a shared label

### Utilities

- `utils_get_colors`: Get available colors for projects, labels, and filters

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