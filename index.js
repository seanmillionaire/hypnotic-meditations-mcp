#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp-core.js';
const server=createMcpServer({operator:true});
try {
 await server.connect(new StdioServerTransport());
 console.error('Hypnotic Meditations MCP 2.0 running on stdio');
} catch(error) {
 console.error('Failed to start MCP:',error.message);
 process.exit(1);
}
