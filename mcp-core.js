import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { PRODUCTS, REVIEWED_AT } from './catalog.js';
import { recommend } from './recommend.js';
const categories=['all','money','free','bundle','sleep','ritual','personalized'];
const SOP={
  router:'https://docs.google.com/document/d/1-V1YwoP_Dyxor8g1kvElVlNLrYLwJ7zG2wnj6Rc2n4k/edit',
  active_index:'https://docs.google.com/document/d/1tVYf6SXyYyitouhHVh55_KJXPcijMVITPxnkLvZVKDU/edit',
  sales_meta:'https://docs.google.com/document/d/1gv-HxkQCXTNUs1DDA4acQmxdgc0CCCgNrXqwimJXTeI/edit',
  offer_bundle:'https://docs.google.com/document/d/1iwJEBP4s7HHpjZc0HaWYhUn8p0RtVduDgKsqEbX2yf4/edit',
  ariella:'https://docs.google.com/document/d/1G8rd-V5qPagkVeI21P0gsaBAhyyvJLkMI7LubdnSDI8/edit',
  design:'https://docs.google.com/document/d/1b8spvfawckoTRZukEsXY2K8mV8swWJR2FQfT7-Qi2CM/edit',
  email:'https://docs.google.com/document/d/1HphKmpiT5wYWj5w5Y_Pg5XPPvMXdT2P3REbPo2Pf-nE/edit',
  ugc_video:'https://docs.google.com/document/d/1OvFP-HTqzz6Ea9lrt5MGVHzV3tTii3OsfO7iepmUnvs/edit',
  custom_audio:'https://docs.google.com/document/d/1EncD69lYMfKlLRh1dMPkSl6XAB9jdsIGXhbCXn-D3yE/edit'
};
const publicTools=[
 {name:'get_recommendation',description:'Match a goal to current source-dated Hypnotic Meditations offers; no guaranteed outcomes or live price quotes.',inputSchema:{type:'object',properties:{goal:{type:'string',minLength:1,maxLength:1000},max_results:{type:'integer',minimum:1,maximum:3}},required:['goal']}},
 {name:'list_products',description:'Browse dated current product catalog and check link/source status.',inputSchema:{type:'object',properties:{category:{type:'string',enum:categories}}}},
 {name:'get_offer_details',description:'See exact offer, documented price and landing/checkout link verification status.',inputSchema:{type:'object',properties:{offer_id:{type:'string'}},required:['offer_id']}}
];
const operatorTool={name:'get_business_context',description:'Local-operator-only current SOP and operational reference, NOT live Google Drive, payment or CRM data.',inputSchema:{type:'object',properties:{topic:{type:'string',enum:['all','sops','growth','funnels','crm','claims']}}}};
const send=(value,error=false)=>({content:[{type:'text',text:JSON.stringify(value,null,2)}],...(error?{isError:true}:{})});
const project=(p)=>({id:p.id,name:p.name,category:p.category,price_usd:p.price_usd,landing_url:p.landing_url,checkout_url:p.checkout_url,summary:p.summary,source:p.source,price_notice:'Snapshot, not a quote. Verify current product, payment terms, contents and delivery before purchase.'});
const context={
 sops:{links:SOP,note:'These are canonical pointers. This server does not fetch Google Docs at runtime. Open the relevant living SOP via authorized connector. User instruction and actual checkout override stale summaries.'},
 growth:{main_offer:'Money Flow for broad cold acquisition; Ariella $8 remains a distinct campaign/test',priority:'Drive qualified people to validated offers rather than default building more tools',levers:['paid ads','organic content and clear CTA','consented email or DM follow-up'],metrics:['qualified visitors','verified orders','conversion','AOV','refunds','contribution profit per qualified visitor']},
 funnels:{money_flow:'https://hypnoticmeditations.ai/products/money-flow/',moneywave:'https://hypnoticmeditations.ai/free',ariella:'https://hypnoticmeditations.ai/ariella/',store:'https://hypnoticmeditations.ai/store',thank_you:'https://hypnoticmeditations.ai/thanks',note:'Inspect actual checkout, return routes, analytics events and fulfillment before changes.'},
 crm:{record:'Respond.io for conversations; provider orders for actual payment truth; AWeber for opted-in messaging',rules:['Purchase tags are not transaction verification','Deduplicate contacts and preserve attribution','Never include buyer PII, private audio briefs, keys or order histories in this MCP','No automatic messages, refunds, delivery or CRM changes']},
 claims:{rules:['Guided audio is a personal-development aid, not guaranteed financial or medical outcomes','No unverified theta/brainwave science or income claims','No fake reviews, crossed-out prices, urgency or scarcity','For commercial messaging: one minor recognizable obstacle; benefit with actual mechanism; authentic assets; readable mobile CTA']}
};
export function createMcpServer({operator=false}={}) {
 const server=new Server({name:'hypnotic-meditations',version:'2.0.0'},{capabilities:{tools:{}}});
 server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:operator?[...publicTools,operatorTool]:publicTools}));
 server.setRequestHandler(CallToolRequestSchema,async(req)=>{
  const name=req.params.name, a=req.params.arguments||{};
  if(name==='get_recommendation'){
   if(typeof a.goal!=='string'||!a.goal.trim()||a.goal.length>1000)return send({error:'Invalid goal'},true);
   const matches=recommend(a.goal,a.max_results??1);
   return send({as_of:REVIEWED_AT,goal:a.goal,matches:matches.map(project),note:matches.length?'Recommendation is a content match, not guaranteed results.':'No matching offer; browse the store or clarify the goal.',store:'https://hypnoticmeditations.ai/store'});
  }
  if(name==='list_products'){
   const c=a.category||'all';
   if(!categories.includes(c))return send({error:'Unknown category',categories},true);
   return send({as_of:REVIEWED_AT,products:PRODUCTS.filter(p=>c==='all'||p.category===c).map(project)});
  }
  if(name==='get_offer_details'){
   const p=PRODUCTS.find(p=>p.id===a.offer_id);
   return p?send({as_of:REVIEWED_AT,offer:project(p),checkout_status:p.checkout_url?'Documented URL, must be reconfirmed':'See landing page for current purchase route'}):send({error:'Offer not found',known_ids:PRODUCTS.map(p=>p.id)},true);
  }
  if(name==='get_business_context'&&operator){
   const topic=a.topic||'all';
   if(topic!=='all'&&!Object.hasOwn(context,topic))return send({error:'Unknown topic'},true);
   return send({as_of:REVIEWED_AT,live_sync:false,context:topic==='all'?context:{[topic]:context[topic]}});
  }
  return send({error:'Unknown or unauthorized tool'},true);
 });
 return server;
}
