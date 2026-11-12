select * from {{ ref('fct_satis') }} where abs(net_satis-toplam_maliyet-brut_kar)>0.01
