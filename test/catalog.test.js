import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../catalog.js';
import { recommend } from '../recommend.js';
test('Unique product IDs and safe HTTPS links',()=>{
 assert.equal(new Set(PRODUCTS.map(p=>p.id)).size,PRODUCTS.length);
 for(const p of PRODUCTS) {assert.match(p.landing_url,/^https:\/\//);if(p.checkout_url)assert.match(p.checkout_url,/^https:\/\//);}
});
test('Reconciled prices',()=>{
 const by=id=>PRODUCTS.find(p=>p.id===id).price_usd;
 assert.equal(by('money-flow'),27);assert.equal(by('money-mind-stack'),67);
 assert.equal(by('ariella-starter'),8);assert.equal(by('complete-library'),197);
 assert.equal(by('money-wave'),0);
});
test('Matching and no invented fallback',()=>{
 assert.equal(recommend('money blocks')[0].id,'money-flow');
 assert.equal(recommend('ariella starter kit')[0].id,'ariella-starter');
 assert.equal(recommend('I cannot sleep')[0].id,'sleep-reset');
 assert.deepEqual(recommend('zxqxqx-unmatched'),[]);
});
