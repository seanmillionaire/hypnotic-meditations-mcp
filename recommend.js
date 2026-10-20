import { PRODUCTS } from './catalog.js';
export function recommend(goal, limit = 1) {
  if (typeof goal !== 'string' || !goal.trim()) return [];
  const q = goal.toLowerCase();
  const scored = PRODUCTS.map((p) => {
    let score = q.includes(p.name.toLowerCase()) ? 20 : 0;
    for (const k of p.keywords) if (q.includes(k)) score += k.includes(' ') ? 5 : 2;
    if (p.id === 'money-flow' && /money|wealth|abundance/.test(q)) score += 3;
    if (p.id === 'sleep-reset' && /sleep|bedtime|insomnia/.test(q)) score += 4;
    return {p,score};
  }).filter(x => x.score > 0);
  scored.sort((a,b) => b.score-a.score || a.p.name.localeCompare(b.p.name));
  return scored.slice(0,Math.min(3,Math.max(1,Number.isInteger(limit) ? limit : 1))).map(x=>x.p);
}
