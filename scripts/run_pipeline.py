from pathlib import Path
import subprocess,sys,os,shutil
ROOT=Path(__file__).resolve().parents[1]
env=os.environ.copy(); env['DBT_SEND_ANONYMOUS_USAGE_STATS']='false'; env['PYTHONIOENCODING']='utf-8'
def run(args,cwd=ROOT): subprocess.run(args,cwd=cwd,env=env,check=True)
run([sys.executable,'scripts/collect_population.py'])
run([sys.executable,'scripts/prepare_data.py'])
run([sys.executable,'-m','dbt.cli.main','build','--profiles-dir','.'],ROOT/'dbt')
(ROOT/'docs').mkdir(exist_ok=True)
shutil.copy2(ROOT/'dbt/target/run_results.json',ROOT/'docs/dbt_build_results.json')
run([sys.executable,'-m','dbt.cli.main','docs','generate','--profiles-dir','.'],ROOT/'dbt')
run([sys.executable,'scripts/export_dashboard.py'])
print('Tüm aşamalar tamamlandı. dashboard/dist/index.html açılabilir.')
