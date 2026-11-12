select * from {{ ref('stg_satis') }} where miktar<=0 or birim_fiyat<0 or birim_maliyet<0 or indirim_orani<0 or indirim_orani>1 or year(tarih)<>2024
