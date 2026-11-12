from pathlib import Path
import csv, duckdb, openpyxl
ROOT=Path(__file__).resolve().parents[1]
raw=ROOT/'data/raw'
w=openpyxl.load_workbook(raw/'perakende_satis.xlsx',read_only=True,data_only=True)
with (raw/'perakende_satis.csv').open('w',encoding='utf-8',newline='') as f:
    csv.writer(f).writerows(w.active.values)
(ROOT/'warehouse').mkdir(exist_ok=True)
con=duckdb.connect(str(ROOT/'warehouse/nova.duckdb'))
con.execute('create schema if not exists raw')
for table,path in [('satis',raw/'perakende_satis.csv'),('nufus',ROOT/'data/external/nufus_2024.csv')]:
    con.execute(f'create or replace table raw.{table} as select * from read_csv_auto(?, header=true)',[str(path)])
con.close()
print('Ham veri yüklendi. Dönüşümler dbt tarafından yapılacak.')
