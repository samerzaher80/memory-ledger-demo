const STORE = 'memory-ledger-demo-v1';
export const seed = [
  {id:'m1',key:'preferred-window',value:'Morning delivery window',source:'Customer note · 03 Sep',confidence:.91,observedAt:'2026-09-03',scope:'Order A17',status:'active'},
  {id:'m2',key:'preferred-window',value:'Afternoon delivery window',source:'Customer correction · 19 Sep',confidence:.99,observedAt:'2026-09-19',scope:'Order A17',status:'active'},
  {id:'m3',key:'loading-access',value:'Rear loading bay is open',source:'Driver note · 04 Aug',confidence:.8,observedAt:'2026-08-04',scope:'Site North',status:'active'},
  {id:'m4',key:'contact-number',value:'Private phone stored for this order',source:'Customer · 22 Sep',confidence:1,observedAt:'2026-09-22',scope:'Order A17',status:'active',private:true}
];
export function createStore(storage = globalThis.localStorage) {
  const read = () => { try { const v=JSON.parse(storage.getItem(STORE)); return Array.isArray(v)?v:structuredClone(seed); } catch { return structuredClone(seed); } };
  const write = rows => { storage.setItem(STORE,JSON.stringify(rows)); return rows; };
  return {read,write,reset:()=>write(structuredClone(seed)),revoke:id=>write(read().map(x=>x.id===id?{...x,status:'revoked'}:x)),add:fact=>write([...read(),fact])};
}
export function assess(rows, key, scope, now='2026-09-27') {
  const all=rows.filter(x=>x.key===key&&x.scope===scope);
  const active=all.filter(x=>x.status==='active');
  const revoked=all.filter(x=>x.status==='revoked');
  if (!active.length) return {status:'unknown',decision:'Ask a human before acting.',reason:revoked.length?'The only matching memory was revoked.':'No scoped memory is available.',evidence:all};
  const ordered=[...active].sort((a,b)=>b.observedAt.localeCompare(a.observedAt));
  const newest=ordered[0];
  const age=Math.max(0,Math.floor((Date.parse(now)-Date.parse(newest.observedAt))/86400000));
  const contradictory=active.some(x=>x.value!==newest.value);
  if (contradictory) return {status:'uncertain',decision:'I might be wrong. Confirm the current preference.',reason:'Two active sources disagree. Recency alone cannot authorize an action.',evidence:ordered};
  if (age>30) return {status:'stale',decision:'I might be wrong. Recheck before acting.',reason:`Newest source is ${age} days old; the 30-day freshness limit expired.`,evidence:ordered};
  if (newest.confidence<.85) return {status:'uncertain',decision:'I might be wrong. Ask for confirmation.',reason:'Source confidence is below the 0.85 action threshold.',evidence:ordered};
  return {status:'usable',decision:newest.value,reason:`One current scoped claim, ${Math.round(newest.confidence*100)}% source confidence.`,evidence:ordered};
}
