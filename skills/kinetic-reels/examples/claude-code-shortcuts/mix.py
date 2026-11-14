"""Sound of the gold reel, exactly as it shipped (bed RMS 0.022, ducked 50%, foley 0.6, -16 LUFS).
The foley list was written on an earlier cut's clock (OLD) and moved onto this cut (NEW) with R(t). New reels skip that step."""
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', '..', 'scripts'))
from sfx import mix_reel
OLD=[0, 1.7, 2.94, 3.82, 4.9, 6.25, 7.18, 8.12, 9.08, 10.18, 11.45, 12.25, 13.3, 14.48, 16.87, 17.99, 18.8, 20.5, 21.33, 23.26, 24.84, 25.77, 26.72, 27.56, 28.65, 31.16]
NEW=[0.0, 1.8037837837837838, 3.2700000000000005, 4.198249999999999, 5.499999999999998, 7.199999999999997, 8.192516556291386, 9.183576158940392, 10.369999999999994, 11.849999999999993, 13.216107784431129, 14.067005988023942, 15.33999999999999, 16.90999999999999, 19.599999999999987, 21.149958333333323, 22.169958333333334, 24.12995833333334, 25.309958333333345, 27.519958333333346, 29.359958333333356, 30.35025536303633, 31.509958333333362, 32.189958333333365, 33.87995833333337, 36.53995833333337]
def R(t):
    k = max(i for i in range(len(OLD)) if OLD[i] <= t + 1e-6); return NEW[k] + (t - OLD[k])
TB=[0,1.70,2.94,3.82,4.90,6.25,7.18,8.12,9.08,10.18,11.45,12.25,13.30,14.48,16.87,17.99,18.80,20.50,21.33,23.26,24.84,25.77,26.72,27.56,28.65,31.16]
E=[(t,'soft',1.0) for t in TB[1:]]
E+=[(max(0,-0.42+i*0.11+0.30),'thud',0.55) for i in range(7)]+[(0.0,'whoosh',0.7)]
E+=[(1.85,'whistle',0.6),(2.15,'whistle',0.5),(2.94,'pop',1.0)]+[(3.82+i*0.08,'tick',0.45) for i in range(13)]+[(4.1,'coin',0.6),(4.32,'coin',0.6),(4.54,'coin',0.6)]
def slam(t,tp): return [(t,'boom',0.45),(t+0.12,'thud',0.9),(t+tp,'click',1.3)]
E+=slam(4.90,0.45)+[(6.3+i*0.17,'tick',0.5) for i in range(5)]+[(7.33,'typing',0.8,7.8),(7.85,'pop',0.9),(8.12,'whoosh',0.7)]
E+=slam(9.08,0.6)+[(10.28,'typing',0.8,10.9),(10.65,'pop',0.6),(10.85,'tick',0.5),(11.05,'tick',0.5),(11.6,'whistle',0.8),(11.95,'thud',1.0)]
E+=slam(13.30,0.5)+[(14.58,'typing',0.85,15.2),(15.48,'click',1.3),(15.75,'pop',0.7)]
E+=[(16.87,'thud',0.8),(17.29,'click',1.3),(17.31,'click',1.0),(18.29,'click',1.2),(18.34,'pop',0.6)]+[(18.95+i*0.18,'pop',0.5) for i in range(3)]+[(19.52,'thud',0.8)]
E+=slam(20.50,0.34)+[(21.33,'riser',0.5,1.0),(22.25,'boom',0.7),(22.3,'thud',1.0)]
E+=slam(23.26,0.5)+[(25.14,'whoosh',0.9),(25.5,'pop',0.8)]+[(25.82+i*0.16,'pop',0.4) for i in range(4)]
E+=[(26.72,'riser',0.5,0.4),(27.02,'whistle',0.8),(27.05,'chime',0.5)]+[(27.66,'typing',0.85,28.1),(28.31,'click',1.3)]
E+=[(29.7,'whistle',0.6),(29.95,'thud',0.7),(29.95,'pop',0.7)]
E+=[(31.58,'click',1.3),(31.6,'coin',0.7)]+[(31.76+i*0.09,'pop',0.35) for i in range(7)]+[(32.4,'chime',1.0)]
E2=[]
for ev in E:
    ev=list(ev)
    if ev[1]=='typing': ev[3]=R(ev[0])+(ev[3]-ev[0])
    ev[0]=R(ev[0]); E2.append(tuple(ev))
mix_reel(os.path.join(HERE,'audio','vo.wav'), os.path.join(HERE,'..','..','assets','music','chill-beat-cc0.mp3'), E2, 39.21, os.path.join(HERE,'audio','mix.wav'))
