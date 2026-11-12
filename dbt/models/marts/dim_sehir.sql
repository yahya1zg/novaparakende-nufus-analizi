select n.sehir, n.yil, n.nufus, s.bolge
from {{ ref('stg_nufus') }} n
left join (select distinct sehir, bolge from {{ ref('stg_satis') }}) s using (sehir)
