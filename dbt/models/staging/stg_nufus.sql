select trim(sehir) as sehir, cast(yil as integer) as yil,
cast(nufus as bigint) as nufus, kaynak_url, cast(erisim_tarihi as date) as erisim_tarihi
from {{ source('raw','nufus') }}
