select f.* from {{ ref('fct_satis') }} f left join {{ ref('dim_sehir') }} d on f.sehir=d.sehir and f.yil=d.yil where d.sehir is null
