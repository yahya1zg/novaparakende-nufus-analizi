'use strict';
const D=window.NOVA_DATA;
const $=id=>document.getElementById(id);
const nf=(x,d=0)=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:d,minimumFractionDigits:d}).format(x);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sum=(a,k)=>a.reduce((s,x)=>s+Number(x[k]),0);
const months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
function options(id,values){$(id).innerHTML='<option value="">Tümü</option>'+values.map(([v,l])=>`<option value="${esc(v)}">${esc(l)}</option>`).join('');}
options('city',D.cities.map(x=>[x.sehir,x.sehir]));
options('month',months.map((x,i)=>['2024-'+String(i+1).padStart(2,'0'),x]));
for(const [id,key] of [['channel','kanal'],['category','kategori']])options(id,[...new Set(D.monthly.map(x=>x[key]))].sort().map(x=>[x,x]));
function calculate(filters){
 const selected=D.cities.filter(x=>!filters.city||x.sehir===filters.city);
 const data=D.monthly.filter(x=>(!filters.city||x.sehir===filters.city)&&(!filters.month||x.ay.slice(0,7)===filters.month)&&(!filters.channel||x.kanal===filters.channel)&&(!filters.category||x.kategori===filters.category));
 const total=sum(data,'net_satis'),profit=sum(data,'brut_kar'),population=sum(selected,'nufus');
 const cities=selected.map(x=>{const r=data.filter(y=>y.sehir===x.sehir),sales=sum(r,'net_satis'),p=sum(r,'brut_kar');return {sehir:x.sehir,nufus:x.nufus,sales,profit:p,orders:sum(r,'siparis_sayisi'),normalized:sales/x.nufus*1000,index:total?sales/total/(x.nufus/population):null,margin:sales?p/sales:null};});
 return {data,total,profit,population,cities,orders:sum(data,'siparis_sayisi'),margin:total?profit/total:null};
}
function bars(id,cities,key,decimal=0){
 const a=[...cities].sort((a,b)=>(b[key]??-Infinity)-(a[key]??-Infinity));const max=Math.max(...a.map(x=>x[key]||0),0);
 $(id).innerHTML=a.map(x=>`<div class="barrow"><span>${esc(x.sehir)}</span><div class="track"><div class="bar" style="width:${max?Math.max(0,x[key]||0)/max*100:0}%;background:${key==='index'&&x[key]<1?'#bd8950':'#087f80'}"></div></div><b>${x[key]==null?'—':nf(x[key],decimal)}</b></div>`).join('');
}
function trend(data){
 const vals=months.map((_,i)=>sum(data.filter(x=>Number(x.ay.slice(5,7))===i+1),'net_satis'));const max=Math.max(...vals,1),W=620,H=282,L=65,R=15,T=16,B=42;
 const px=i=>L+i*(W-L-R)/11,py=v=>H-B-v/max*(H-B-T);
 const ticks=[0,.25,.5,.75,1].map(t=>`<line x1="${L}" y1="${py(max*t)}" x2="${W-R}" y2="${py(max*t)}" stroke="#e2e9ed"/><text x="${L-8}" y="${py(max*t)+4}" text-anchor="end">${nf(max*t/1000)} bin</text>`).join('');
 $('trend').innerHTML=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Aylık net satış çizgi grafiği">${ticks}<polyline fill="none" stroke="#087f80" stroke-width="3" points="${vals.map((v,i)=>px(i)+','+py(v)).join(' ')}"/>${vals.map((v,i)=>`<circle cx="${px(i)}" cy="${py(v)}" r="4" fill="#087f80"><title>${months[i]}: ${nf(v,2)} TL</title></circle><text x="${px(i)}" y="${H-16}" text-anchor="middle">${months[i].slice(0,3)}</text>`).join('')}</svg>`;
}
let current;
function render(){
 const f=Object.fromEntries(['city','month','channel','category'].map(k=>[k,$(k).value]));current=calculate(f);const a=current;
 const kpis=[['Net satış',nf(a.total,2)+' TL','İndirim sonrası ciro'],['Brüt kâr',nf(a.profit,2)+' TL','Birim maliyet varsayımıyla'],['Brüt kâr marjı',a.margin==null?'—':nf(a.margin*100,1)+'%','Toplam kâr / toplam ciro'],['1.000 kişiye satış',nf(a.total/a.population*1000,2)+' TL',nf(a.population)+' kişi nüfus']];
 $('kpis').innerHTML=kpis.map(([l,v,n])=>`<div class="card"><div class="label">${l}</div><div class="value">${v}</div><small>${n}</small></div>`).join('');
 $('scope').textContent=`${a.cities.length} il · ${nf(a.orders)} sipariş · ${f.month?months[Number(f.month.slice(5))-1]+' 2024':'Ocak–Aralık 2024'} · Nüfus: 31.12.2024`;
 bars('sales',a.cities,'sales');bars('normalized',a.cities,'normalized',2);bars('index',a.cities,'index',2);trend(a.data);
 const sorted=[...a.cities].sort((x,y)=>y.sales-x.sales);
 $('table').innerHTML='<table><thead><tr><th>İl</th><th>Nüfus</th><th>Net satış (TL)</th><th>Brüt kâr (TL)</th><th>Marj</th><th>Sipariş</th><th>TL / 1.000 kişi</th><th>Endeks</th></tr></thead><tbody>'+sorted.map(x=>`<tr><td>${esc(x.sehir)}</td><td>${nf(x.nufus)}</td><td>${nf(x.sales,2)}</td><td>${nf(x.profit,2)}</td><td>${x.margin==null?'—':nf(x.margin*100,1)+'%'}</td><td>${nf(x.orders)}</td><td>${nf(x.normalized,2)}</td><td>${x.index==null?'—':nf(x.index,2)}</td></tr>`).join('')+'</tbody></table>';
 const low=[...a.cities].sort((x,y)=>(x.index??Infinity)-(y.index??Infinity))[0];
 $('insight').textContent=a.cities.length===1?'Tek il seçildi: temsil endeksi tanımı gereği 1,00 olur. İlleri karşılaştırmak için il filtresini sıfırlayın.':a.total?`${low.sehir}, seçili kapsamda ${nf(low.index,2)} temsil endeksiyle nüfus payına göre en düşük ciro temsiline sahip. Bu bulgu; dağıtım kapsamını incelemek ve ölçülebilir bir kampanya deneyi tasarlamak için başlangıçtır.`:'Seçili filtrelerde satış kaydı yok. Nüfus değişmez; temsil endeksi hesaplanamaz.';
}
for(const k of ['city','month','channel','category'])$(k).addEventListener('change',render);
$('reset').onclick=()=>{for(const k of ['city','month','channel','category'])$(k).value='';render();};
$('download').onclick=()=>{const rows=[['il','nufus','net_satis_tl','brut_kar_tl','siparis','bin_kisiye_satis','temsil_endeksi'],...current.cities.map(x=>[x.sehir,x.nufus,x.sales.toFixed(2),x.profit.toFixed(2),x.orders,x.normalized.toFixed(4),x.index==null?'':x.index.toFixed(6)])];const blob=new Blob(['\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='nova_secili_iller.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
window.NOVA_CALCULATE=calculate;render();
