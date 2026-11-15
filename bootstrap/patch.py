import json,os,sys
P=json.loads(open('bootstrap/patch.json',encoding='utf-8').read())
for f,c in P['full'].items():
    os.makedirs(os.path.dirname(f) or '.',exist_ok=True); open(f,'w',encoding='utf-8',newline='\n').write(c); print('WROTE',f)
bad=0
for f,o,n in P['edits']:
    s=open(f,encoding='utf-8').read()
    if n in s: print('ALREADY',f); continue
    if s.count(o)!=1: print('ANCHOR MISSING',f,repr(o[:60])); bad+=1; continue
    open(f,'w',encoding='utf-8',newline='\n').write(s.replace(o,n,1)); print('EDIT',f)
sys.exit(1 if bad else 0)
