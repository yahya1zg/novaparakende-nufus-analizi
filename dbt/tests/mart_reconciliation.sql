select 1 where abs((select sum(net_satis) from {{ ref('fct_satis') }})-(select sum(net_satis) from {{ ref('mart_sehir_performans') }}))>0.01
