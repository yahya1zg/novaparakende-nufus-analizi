"""Resmî nüfus tablosu: varsayılan olarak korunmuş HTML'den, --refresh ile web'den."""
from pathlib import Path
import re,csv,sys,urllib.request
from datetime import date
import openpyxl
ROOT=Path(__file__).resolve().parents[1]
URL='https://www.kastabil.gov.tr/veritablolari/kastamonu/nufus/illere-gore-il-ilce-merkezi-belde-koy-nufusu-ve-yillik-nufus-artis-hizi-2023-2024'
external=ROOT/'data/external'; source=external/'kastabil_2024_kaynak.html'
accessed='2026-11-06'
if '--refresh' in sys.argv:
    with urllib.request.urlopen(URL,timeout=30) as r: content=r.read().decode('utf-8')
    accessed=date.today().isoformat()
else: content=source.read_text(encoding='utf-8')
raw=list(openpyxl.load_workbook(ROOT/'data/raw/perakende_satis.xlsx',read_only=True,data_only=True).active.values)
cities={r[3] for r in raw[1:]}; out=[]
for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',content,re.S|re.I):
    cells=[re.sub('<[^>]+>','',x).replace('&nbsp;',' ').strip() for x in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>',tr,re.S|re.I)]
    if cells and cells[0] in cities:
        out.append([cells[0],2024,int(re.sub(r'\D','',cells[2])),URL,accessed])
if len(out)!=len(cities) or {x[0] for x in out}!=cities:
    raise ValueError('Kaynak tablo biçimi veya şehir kapsamı değişti; dosya yazılmadı.')
if '--refresh' in sys.argv: source.write_text(content,encoding='utf-8')
with (external/'nufus_2024.csv').open('w',encoding='utf-8',newline='') as f:
    csv.writer(f).writerows([['sehir','yil','nufus','kaynak_url','erisim_tarihi']]+out)
print(f'Nüfus kaynağı doğrulandı: {len(out)} il.')
