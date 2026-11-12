# El kitabı: vize kapsamı ve teslim kontrolü

Kaynak: YBS305 Proje El Kitabı, Ece Dalpolat, 2026-2027 Güz, 7 sayfa.
Bu listede el kitabının vize için istediği çalışmaları ve projede bunları nerede karşıladığımızı topladık.

| Gereksinim | El kitabı | Projedeki karşılığı |
|---|---|---|
| Çalışan, karara bağlı ürün | s.2 | Nüfusa göre satış karşılaştırması, araştırma önerileri |
| NovaPerakende + en az 1 dış kaynak | s.2-4,6 | Excel + resmî KASTABİL/TÜİK 2024 nüfusu |
| DuckDB veya BigQuery | s.3 | warehouse/nova.duckdb |
| dbt Core, staging ve mart | s.3-4 | 2 staging + 4 mart/dimension/fact SQL modeli |
| En az 3 dönüşüm modeli | s.4 | Toplam 6 SQL modeli |
| En az 3 dbt testi | s.4 | Şema testleri + 7 özel SQL testi |
| dbt docs zorunlu | s.3-4 | dbt/target: index.html, manifest.json, catalog.json |
| Etkileşimli dashboard | s.4 | 4 KPI, 4 grafik, il/ay/kanal/kategori filtreleri |
| .pbix veya yayımlanmış link | s.4 | Web dashboard yayın bağlantısı; erişim kontrolü teslim öncesi doğrulanmalı |
| Araç tercihini README'de gerekçelendir | s.3 | Web dashboard tercihi ve eğitmen teyit notu |
| README + veri sözlüğü | s.4 | README.md + docs/VERI_SOZLUGU.md |
| Herkese açık GitHub repo | s.3-4 | Paket hazır; repo bilgileri son aşamada eklenecek |
| 2-4 kişi ve katkı geçmişi | s.6 | Gerçek üyeler ve gerçek katkılar öğrenci tarafından eklenmeli |
| Kaynak gösterme, kodu anlama | s.6 | KAYNAK.md, yöntem, lab soru-cevapları ve yardım beyanı |
| KVKK, anonimleştirme | s.6 | Web verisinde müşteri kimlikleri çıkarıldı; ham repo erişimi ayrıca değerlendirilmeli |
| 13 Kasım 2026 Cuma, 8. hafta lab | s.4-5 | Çalışan hattın labda gösterimi; vize ağırlığı %40 |

## Vize dışında tutulanlar
İki algoritma, hedef değişken, model değerlendirme, model kartı ve canlı tahmin uygulaması final kapsamıdır (25 Aralık 2026, %50; hazırlık 18 Aralık). Vize paketinde eğitilmiş model yoktur.

## Takvimdeki ilk 8 hafta
25 Eylül konu/grup; 2 Ekim kaynak planı; 9 Ekim ham veri; 16 Ekim staging;
23 Ekim dönüşüm/test; 30 Ekim mart/metrik; 6 Kasım dashboard; 13 Kasım lab teslimi.
El kitabında belirtilmeyen sayfa sınırı, dosya adlandırma veya ayrıca puan rubriği uydurulmamıştır.
