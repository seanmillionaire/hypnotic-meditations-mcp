import http from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp-core.js';
const token=process.env.MCP_BEARER_TOKEN||'';
const host=process.env.HOST||(token?'0.0.0.0':'127.0.0.1');
const port=Number(process.env.PORT||3000);
if ((!token&&process.env.NODE_ENV==='production')||(!token&&!['127.0.0.1','::1','localhost'].includes(host)))
 throw Error('Remote HTTP requires MCP_BEARER_TOKEN. Refusing unauthenticated nonlocal listen.');
const auth=(req)=>{
 if(!token)return true;
 const x=Buffer.from(req.headers.authorization||'');
 const y=Buffer.from('Bearer '+token);
 return x.length===y.length&&timingSafeEqual(x,y);
};
const json=(res,status,obj)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(obj));};
const app=http.createServer(async (req,res)=>{
 const pathname=(req.url||'').split('?')[0];
 if(pathname==='/health'&&req.method==='GET')return json(res,200,{status:'ok'});
 if(!['/','/mcp'].includes(pathname))return json(res,404,{error:'Not found'});
 if(!auth(req))return json(res,401,{error:'Unauthorized'});
 if(req.method!=='POST')return json(res,405,{error:'MCP requires POST'});
 const server=createMcpServer({operator:false});
 const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});
 res.on('close',()=>{void transport.close().catch(()=>{});});
 try {await server.connect(transport);await transport.handleRequest(req,res);}
 catch(e){console.error('MCP request failed',e.message);if(!res.headersSent)json(res,500,{error:'Internal error'});else if(!res.writableEnded)res.end();}
});
app.listen(port,host,()=>console.error('Hypnotic Meditations MCP HTTP on '+host+':'+port));
