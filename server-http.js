import express from 'express';
const PORT = process.env.PORT || 3000;
const app = express();
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ name: 'Hypnotic Meditations MCP', tools: ['get_recommendation', 'list_products'] }));
app.listen(PORT, () => console.log('Running on port ' + PORT));
