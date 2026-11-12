with hesap as (
select *, cast(miktar*birim_fiyat as decimal(18,2)) as brut_satis,
cast(round(miktar*birim_fiyat*(1-indirim_orani),2) as decimal(18,2)) as net_satis,
cast(round(miktar*birim_maliyet,2) as decimal(18,2)) as toplam_maliyet
from {{ ref('stg_satis') }}
)
select *, cast(net_satis-toplam_maliyet as decimal(18,2)) as brut_kar,
cast(date_trunc('month',tarih) as date) as ay, year(tarih) as yil
from hesap
