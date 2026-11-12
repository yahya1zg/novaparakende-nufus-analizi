from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP
from collections import defaultdict
import csv,json,hashlib,duckdb,openpyxl
ROOT=Path(__file__).resolve().parents[1]
con=duckdb.connect(str(ROOT/'warehouse/nova.duckdb'),read_only=True)
rows=list(openpyxl.load_workbook(ROOT/'data/raw/perakende_satis.xlsx',read_only=True,data_only=True).active.values)
tot=Decimal(0); profit=Decimal(0); city=defaultdict(lambda:Decimal(0)); negative=0
for r in rows[1:]:
    amount=(Decimal(str(r[8]))*Decimal(str(r[9]))*(1-Decimal(str(r[11])))).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)
    cost=Decimal(str(r[8]))*Decimal(str(r[10])); tot+=amount; profit+=amount-cost; city[r[3]]+=amount
    negative+=amount-cost<0
sql=con.execute('select count(*), sum(net_satis),sum(brut_kar),count(distinct musteri_id) from fct_satis').fetchone()
assert sql[0]==len(rows)-1 and sql[1]==tot and sql[2]==profit
for name,value in con.execute('select sehir,net_satis from mart_sehir_performans').fetchall(): assert city[name]==value
assert con.execute('select count(*) from dim_sehir').fetchone()[0]==10
assert con.execute('select sum(nufus) from dim_sehir').fetchone()[0]==41775761
run=json.loads((ROOT/'docs/dbt_build_results.json').read_text())
tests=[x for x in run['results'] if x['unique_id'].startswith('test.')]
assert len(tests)>=20 and all(x['status']=='pass' for x in tests)
summary={'status':'PASS','source_rows':sql[0],'independent_excel_net_sales':str(tot),'independent_excel_gross_profit':str(profit),'distinct_customer_ids':sql[3],'negative_gross_profit_rows_retained':negative,'dbt_models':6,'dbt_tests_passed':len(tests),'source_sha256':hashlib.sha256((ROOT/'data/raw/perakende_satis.xlsx').read_bytes()).hexdigest(),'population_rows':10,'population_total':41775761,'browser_visual_QA':'Not completed: Windows Computer Use could not verify current browser URL.'}
(ROOT/'docs/verification.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False),encoding='utf-8')
# Export expected per-filter results independently from raw Excel.
expected=[]
channels=['', 'Online','Mağaza']; categories=['']+sorted({r[6] for r in rows[1:]})
for ci in ['']+sorted(city):
 for mo in ['']+[f'2024-{i:02}' for i in range(1,13)]:
  for ch in channels:
   for ca in categories:
    rs=[r for r in rows[1:] if (not ci or r[3]==ci) and (not mo or r[1][:7]==mo) and (not ch or r[5]==ch) and (not ca or r[6]==ca)]
    total=sum((Decimal(str(r[8]))*Decimal(str(r[9]))*(1-Decimal(str(r[11])))).quantize(Decimal('.01')) for r in rs)
    expected.append({'filters':dict(city=ci,month=mo,channel=ch,category=ca),'total':float(total),'orders':len(rs)})
(ROOT/'docs/filter_expected.json').write_text(json.dumps(expected,ensure_ascii=False),encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False))
