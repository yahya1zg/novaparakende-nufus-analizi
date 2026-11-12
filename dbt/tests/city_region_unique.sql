select sehir from {{ ref('stg_satis') }} group by 1 having count(distinct bolge)<>1
