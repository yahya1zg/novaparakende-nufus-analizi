from pathlib import Path
import json,duckdb,hashlib
from datetime import date,datetime
from decimal import Decimal
ROOT=Path(__file__).resolve().parents[1]
con=duckdb.connect(str(ROOT/'warehouse/nova.duckdb'),read_only=True)
def query(sql):
    c=con.execute(sql); names=[x[0] for x in c.description]
    return [dict(zip(names,row)) for row in c.fetchall()]
def default(x):
    if isinstance(x,(date,datetime)): return x.isoformat()
    if isinstance(x,Decimal): return float(x)
    raise TypeError(type(x))
out=ROOT/'dashboard/dist'; out.mkdir(parents=True,exist_ok=True)
# Müşteri kimlikleri yayımlanmaz. İl/ay/kanal/kategori bazında farklı müşterilerin
# sayısı toplamsal olmadığından web sürümünde müşteri KPI'sı kullanılmaz.
data={'cities':query('select * from main.mart_sehir_performans order by sehir'),
      'monthly':query('select * from main.mart_aylik_satis order by ay,sehir,kanal,kategori')}
(out/'data.js').write_text('window.NOVA_DATA='+json.dumps(data,ensure_ascii=False,default=default)+';',encoding='utf-8')
for name in ['fct_satis','dim_sehir','mart_sehir_performans','mart_aylik_satis']:
    path=ROOT/'data/processed'/f'{name}.csv'; path.parent.mkdir(exist_ok=True)
    con.execute(f'copy main.{name} to ? (header, delimiter ",")',[str(path)])
con.close()
print('Dashboard verisi yalnızca dbt martlarından üretildi.')
