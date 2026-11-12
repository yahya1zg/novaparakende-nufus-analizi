select 1 where (select count(*) from {{ source('raw','satis') }}) <> (select count(*) from {{ ref('fct_satis') }})
