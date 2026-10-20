# Hypnotic Meditations MCP v2

This MCP has one shared, source-dated product catalog for local stdio and optional HTTP clients. It recommends guided audio by goal, lists offers, and provides offer details. Local stdio also provides operator-only business context and links to the newest SOPs.

Last catalog reconciliation: October 20, 2026. This is NOT a live checkout, fulfillment, Google Drive, or CRM sync. Recheck payment terms and content before sending a buyer to checkout. Any checkout URL in the catalog is documented, not continuously monitored.

## Run

Requirements: Node.js 18 or later.

1. npm ci
2. npm test
3. npm start

Set your desktop MCP client to run node with the absolute path to index.js, then restart the client. The local transport exposes get_recommendation, list_products, get_offer_details, and get_business_context.

## Optional HTTP transport

Run npm run start:http. With no secret, it listens on loopback 127.0.0.1 only. For any remote deployment set MCP_BEARER_TOKEN in the hosting environment (not in this repo), configure TLS/HTTPS, then start the HTTP service. POST to /mcp (legacy root POST is also supported), with an Authorization bearer header. Unauthenticated nonlocal or production startup is refused. The HTTP server exposes only the three public catalog tools, not business-context tooling. GET /health is a simple readiness endpoint.

There is no independently verified Vercel MCP project or Cloudflare MCP Worker for this repository as of this review. A GitHub commit does not mean the server is live.

## Source priority and safeguards

Current owner instruction > active SOP router and task-specific living docs > real checkout/order/fulfillment evidence > dated repository snapshot. The operator tool provides pointers, not automatic Drive document retrieval.

Do not put customer PII, API keys, private meditation briefs, order histories or tokens in the public repository or output. AWeber tags are not payment confirmation. Do not send messages, issue refunds, change checkout, update ads or change websites from this informational MCP.

Meditation is a personal-development practice, not medical advice or a promise of income. Do not invent testimonial results, scientific outcomes, discounts, permanent wealth claims or scarcity.

Public catalog: https://hypnoticmeditations.ai/store
Main front end: https://hypnoticmeditations.ai/products/money-flow/
Ariella: https://hypnoticmeditations.ai/ariella/
