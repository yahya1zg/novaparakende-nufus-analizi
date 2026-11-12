with ozet as (
select sehir, yil, sum(net_satis) as net_satis, sum(brut_kar) as brut_kar,
count(distinct siparis_id) as siparis_sayisi, count(distinct musteri_id) as musteri_sayisi
from {{ ref('fct_satis') }} group by 1,2
), birlesim as (
select d.*, coalesce(o.net_satis,0) as net_satis, coalesce(o.brut_kar,0) as brut_kar,
coalesce(o.siparis_sayisi,0) as siparis_sayisi, coalesce(o.musteri_sayisi,0) as musteri_sayisi
from {{ ref('dim_sehir') }} d left join ozet o using(sehir,yil)
)
select *, net_satis/nullif(nufus,0)*1000 as bin_kisiye_satis,
musteri_sayisi*100000.0/nullif(nufus,0) as yuzbin_kisiye_musteri,
brut_kar/nullif(net_satis,0) as brut_kar_marji,
(net_satis/nullif(sum(net_satis) over(partition by yil),0)) /
(nufus*1.0/nullif(sum(nufus) over(partition by yil),0)) as temsil_endeksi
from birlesim
