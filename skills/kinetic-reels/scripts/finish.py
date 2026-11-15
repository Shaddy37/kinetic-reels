"""Put picture and sound together and check the result.
Usage: python finish.py <reel folder>
Needs <reel>/out/silent.mp4 (render.cjs) and <reel>/audio/mix.wav (the reel's mix.py). Writes <reel>/out/final.mp4,
then checks: 1080x1920, 30 fps, 15 to 90 s, an audio track, loudness near -16 LUFS. Prints PASS or FIX lines."""
import sys, os, re, json, subprocess
try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')  # Windows consoles default to cp1252
except Exception: pass
reel = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
silent = os.path.join(reel, 'out', 'silent.mp4'); mix = os.path.join(reel, 'audio', 'mix.wav'); final = os.path.join(reel, 'out', 'final.mp4')
for f in (silent, mix):
    if not os.path.isfile(f): print('MISSING', f); sys.exit(1)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', silent, '-i', mix, '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000',
                '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], check=True)
j = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', final], capture_output=True, text=True).stdout)
v = [s for s in j['streams'] if s['codec_type'] == 'video'][0]; a = [s for s in j['streams'] if s['codec_type'] == 'audio']; dur = float(j['format']['duration'])
e = subprocess.run(['ffmpeg', '-i', final, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = re.findall(r'I:\s+(-?[\d.]+) LUFS', e); lufs = float(m[-1]) if m else None
fails = []
if (int(v['width']), int(v['height'])) != (1080, 1920): fails.append(f"FIX size {v['width']}x{v['height']}, must be 1080x1920")
num, den = v['r_frame_rate'].split('/')
if abs(int(num) / int(den) - 30) > 0.1: fails.append('FIX fps must be 30')
if not 15 <= dur <= 90: fails.append(f'FIX length {dur:.1f} s: keep a voiceover reel between 38 and 60 s')
if not a: fails.append('FIX no audio track')
if lufs is None or abs(lufs + 16) > 1.5: fails.append(f'FIX loudness {lufs} LUFS, target -16')
for f in fails: print(f)
if not fails: print(f'PASS {final}: 1080x1920, 30 fps, {dur:.1f} s, {lufs:.1f} LUFS')
sys.exit(1 if fails else 0)
