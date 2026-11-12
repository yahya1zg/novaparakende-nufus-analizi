# Veri sözlüğü ve metrik tanımları

## Ham Excel - 2.000 kayıt, 12 sütun
| Alan | Tip | Anlam |
|---|---|---|
| SiparisID | metin | Kaynakta benzersiz sipariş kaydı |
| Tarih | tarih | İşlem tarihi, 2024 |
| Musteri_ID | metin | Takma müşteri kimliği; gerçek anonimlik doğrulanmamıştır |
| Sehir / Bolge | metin | İşlemin ili ve bölgesi; müşterinin ikametgâhı olduğu varsayılmaz |
| Kanal | metin | Online veya Mağaza |
| Kategori / Urun | metin | Ürün sınıflandırması ve ürün adı |
| Miktar | tamsayı | Satılan adet |
| BirimFiyat | TL/adet | İndirim öncesi birim satış fiyatı |
| Maliyet | TL/adet | Birim maliyet kabul ettik; hocamızla netleştirmemiz gerekiyor |
| IndirimOrani | oran | 0 ile 1 arasında indirim |

## Dış kaynak
sehir (metin), yil (tamsayı), nufus (kişi), kaynak_url (metin), erisim_tarihi (tarih).
İl ve 2024 yılı eşleştirilir. Nüfus, belirli bir tarihteki kişi sayısıdır. Her sipariş için tekrar sayılıp toplanmamalıdır.

## Türetilen alanlar
| Alan | Hesap / birim |
|---|---|
| brut_satis | miktar × birim_fiyat, TL |
| net_satis | ROUND(miktar × birim_fiyat × (1-indirim_orani), 2), TL |
| toplam_maliyet | miktar × birim_maliyet, TL |
| brut_kar | net_satis - toplam_maliyet, TL; faaliyet/net kâr değildir |
| brut_kar_marji | SUM(brut_kar) / SUM(net_satis), oran; marjların ortalaması alınmaz |
| siparis_sayisi | DISTINCT SiparisID; mevcut dosyada satır sayısına eşit |
| musteri_sayisi | İl içinde DISTINCT Musteri_ID; şehirler arasında toplanamaz |
| bin_kisiye_satis | net_satis / il nüfusu × 1.000, TL/1.000 kişi |
| yuzbin_kisiye_musteri | ilde farklı müşteri / nüfus × 100.000; ikamet doğrulanmadığı için penetrasyon değildir |
| temsil_endeksi | (ilin ciro payı) / (ilin nüfus payı); evren yalnızca kapsanan 10 il |

Endeks 1: ciro payı nüfus payına eşit. 1 altı: nüfusa kıyasla düşük temsil. Bu bir pazar payı veya satış tahmini değildir.
Dashboard filtreleri ciroyu seçili dönem/kanal/kategoriye göre değiştirir. Nüfus yıl sonu 2024 olarak sabit kalır. Endeks seçili illerin evreninde yeniden hesaplanır. Kısmi dönem değerleri yıllıklandırılmaz.
KDV, iade ve kargo bilgisi yoktur. Tutarlar kaynakta belirtilen kapsamda ele alınır; net satış burada yalnızca indirim sonrası tutardır.
