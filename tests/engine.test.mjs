import test from 'node:test';import assert from 'node:assert/strict';import {seed,assess,createStore} from '../engine.js';
test('contradiction blocks action',()=>assert.equal(assess(seed,'preferred-window','Order A17').status,'uncertain'));
test('stale claim blocks action',()=>assert.equal(assess(seed,'loading-access','Site North').status,'stale'));
test('revocation prevents retrieval',()=>assert.equal(assess([{...seed[3],status:'revoked'}],'contact-number','Order A17').status,'unknown'));
test('scope prevents cross-order leak',()=>assert.equal(assess(seed,'contact-number','Order B19').status,'unknown'));
test('current confirmed claim is usable',()=>assert.equal(assess([{...seed[1],observedAt:'2026-09-27'}],'preferred-window','Order A17').status,'usable'));
test('store persists revocation',()=>{let val;const storage={getItem:()=>val,setItem:(_,v)=>{val=v}};const store=createStore(storage);store.revoke('m4');assert.equal(store.read().find(x=>x.id==='m4').status,'revoked')});
