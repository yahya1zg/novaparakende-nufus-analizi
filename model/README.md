# NovaPerakende şehir performansı modeli

Model il ve yıl düzeyinde satış hacmini, nüfusa göre satış yoğunluğunu ve kârlılığı karşılaştırır.

- [Şehir boyutu](../dbt/models/marts/dim_sehir.sql) il, yıl ve nüfusu taşır.
- [Satış olgusu](../dbt/models/marts/fct_satis.sql) net satış, maliyet ve brüt kârı hesaplar.
- [Şehir performansı modeli](../dbt/models/marts/mart_sehir_performans.sql) satışları il ve yıla göre toplar, nüfus tablosuyla eşler ve satışsız illeri de tutar.

1.000 kişi başına net satış, net satışın nüfusa bölünüp 1.000 ile çarpılmasıyla bulunur. Temsil endeksi, ilin yıllık net satış payının nüfus payına oranıdır. Brüt kâr marjı, brüt kârın net satışa oranıdır.

[Model çıktısı](../data/processed/mart_sehir_performans.csv) · [Analiz notebook’u](../notebooks/01_satis_nufus_analizi.ipynb)