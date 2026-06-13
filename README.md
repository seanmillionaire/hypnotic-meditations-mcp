# Hypnotic Meditations MCP Server

Connect Hypnotic Meditations to AI assistants that support the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).

The server matches a person's goal or problem with relevant Hypnotic Meditations products, then returns the product name, description, price, and direct purchase link.

## What It Does

A user can ask an AI assistant:

> I can't fall asleep because my mind keeps racing.

The assistant can call this server and return the closest matching Hypnotic Meditations program.

The catalog covers:

- Sleep and recovery
- Money mindset and abundance
- Manifestation rituals
- Focus and self-sabotage
- Nervous system support
- Product bundles

## Available Tools

### `get_recommendation`

Finds the best product matches for a natural-language goal, symptom, or challenge.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `goal` | string | Yes | The user's goal or problem in natural language |
| `max_results` | number | No | Number of results to return, from 1 to 3. Defaults to 1 |

Example requests:

- `I can't fall asleep`
- `I keep procrastinating and stopping myself`
- `I want to change my money mindset`
- `I need help focusing`
- `Show me the best-value bundle`

### `list_products`

Returns the product catalog, optionally filtered by category.

Supported categories:

- `sleep`
- `money`
- `ritual`
- `mindset`
- `health`
- `bundle`
- `all`

## Requirements

- Node.js 18 or newer
- An MCP-compatible client

## Installation

```bash
git clone https://github.com/seanmillionaire/hypnotic-meditations-mcp.git
cd hypnotic-meditations-mcp
npm install
```

## Run Locally

```bash
npm start
```

The server communicates over stdio. It is designed to be launched by an MCP client rather than used as a standalone website or HTTP API.

## Connect to Claude Desktop

Add the server to your Claude Desktop configuration.

macOS configuration file:

```text
~/Library/Application Support/Claude/claude_desktop_config.json
```

Windows configuration file:

```text
%APPDATA%\Claude\claude_desktop_config.json
```

Configuration:

```json
{
  "mcpServers": {
    "hypnotic-meditations": {
      "command": "node",
      "args": ["/absolute/path/to/hypnotic-meditations-mcp/index.js"]
    }
  }
}
```

Replace the example path with the absolute path to `index.js`, save the file, and restart Claude Desktop.

## Connect to Another MCP Client

Use the same stdio command in any client that supports local MCP servers:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/hypnotic-meditations-mcp/index.js"]
}
```

No environment variables or API keys are required.

## Development

Run with Node.js watch mode:

```bash
npm run dev
```

Main files:

- `index.js` contains the product catalog, matching logic, and MCP tool handlers.
- `package.json` contains the package metadata and commands.

## How Matching Works

The server scores products using phrases and category signals found in the user's request. It returns up to three ranked matches. When no product receives a match score, it returns the Complete Library as a general fallback.

## Current Transport

This repository currently supports local stdio transport only. A remote HTTP deployment would require an HTTP-compatible MCP transport and hosting configuration that are not included here.

## Links

- [Hypnotic Meditations](https://hypnoticmeditations.ai)
- [Full Product Catalog](https://hypnoticmeditations.ai/store.html)
- [Customer Support](https://hypnoticmeditations.ai/support.html)

## License

MIT
