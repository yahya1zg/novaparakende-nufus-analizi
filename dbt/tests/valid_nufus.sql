select * from {{ ref('stg_nufus') }} where nufus<=0 or yil<>2024
