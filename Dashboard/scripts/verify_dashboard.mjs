import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const elements={};
function element(id){return elements[id]??=( {value:'',innerHTML:'',textContent:'',addEventListener(){}} );}
const ctx={window:{},document:{getElementById:element},Intl,Blob,setTimeout,URL,console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'dashboard/dist/data.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'dashboard/dist/app.js'),'utf8'),ctx);
const expected=JSON.parse(fs.readFileSync(path.join(root,'docs/filter_expected.json'),'utf8'));
for(const e of expected){const actual=ctx.window.NOVA_CALCULATE(e.filters);assert.ok(Math.abs(actual.total-e.total)<.001,JSON.stringify(e));assert.equal(actual.orders,e.orders);assert.ok(actual.population>0);if(e.filters.city&&actual.total)assert.ok(Math.abs(actual.cities[0].index-1)<1e-9);}
assert.ok(elements.kpis.innerHTML.includes('7.206.829,00'));
assert.ok(elements.sales.innerHTML.includes('İstanbul'));
assert.ok(elements.normalized.innerHTML.includes('Trabzon'));
const result={status:'PASS',filter_combinations_checked:expected.length,method:'JavaScript application calculation compared with independent raw-Excel Decimal aggregation; DOM stub only, not browser visual QA.'};
fs.writeFileSync(path.join(root,'docs/dashboard_verification.json'),JSON.stringify(result,null,2));console.log(result);
