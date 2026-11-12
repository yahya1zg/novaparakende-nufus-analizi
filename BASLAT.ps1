$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Test-Path '.venv/Scripts/python.exe')) { py -3 -m venv .venv }
& ./.venv/Scripts/python.exe -m pip install -r requirements-lock.txt
if ($LASTEXITCODE -ne 0) { throw 'Paket kurulumu başarısız.' }
& ./.venv/Scripts/python.exe scripts/run_pipeline.py
if ($LASTEXITCODE -ne 0) { throw 'Veri hattı başarısız.' }
Start-Process (Join-Path $PSScriptRoot 'dashboard/dist/index.html')
