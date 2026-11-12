select ay, sehir, kanal, kategori,
sum(net_satis) as net_satis, sum(brut_kar) as brut_kar, count(*) as siparis_sayisi
from {{ ref('fct_satis') }} group by 1,2,3,4
