select
    trim(SiparisID) as siparis_id,
    cast(Tarih as date) as tarih,
    trim(Musteri_ID) as musteri_id,
    trim(Sehir) as sehir,
    trim(Bolge) as bolge,
    trim(Kanal) as kanal,
    trim(Kategori) as kategori,
    trim(Urun) as urun,
    cast(Miktar as integer) as miktar,
    cast(BirimFiyat as decimal(18,2)) as birim_fiyat,
    cast(Maliyet as decimal(18,2)) as birim_maliyet,
    cast(IndirimOrani as decimal(8,4)) as indirim_orani
from {{ source('raw','satis') }}
