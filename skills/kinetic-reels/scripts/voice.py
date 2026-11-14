"""Make the voiceover with Gemini TTS (Google AI Studio API key in .env as GEMINI_API_KEY).
Usage: python voice.py <reel folder>
Reads <reel>/tts.json:
  {"voice": "Puck", "models": ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"],
   "parts": [{"style": "how this part sounds", "text": "the exact words, read word for word"}, ...]}
Each part is one turn with its own style (hook, body, payoff, CTA). Inline tags like <short pause> or <chuckle> are allowed
(list in references/VOICE.md). Writes <reel>/audio/vo_raw.wav (24 kHz mono). Falls back through the models list."""
import base64, json, os, sys, struct, urllib.request, urllib.error
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from _env import load_env
def wav_from_pcm(pcm, sr=24000):
    return b'RIFF' + struct.pack('<I', 36 + len(pcm)) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 1, 1, sr, sr * 2, 2, 16) + b'data' + struct.pack('<I', len(pcm)) + pcm
def main():
    reel = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
    envf = load_env(); key = os.environ.get('GEMINI_API_KEY', '').strip()
    if not key: print('NO KEY: put GEMINI_API_KEY=your-key in a .env file (get one free at https://aistudio.google.com/apikey)'); sys.exit(2)
    job = json.load(open(os.path.join(reel, 'tts.json'), encoding='utf-8'))
    content = [{'type': 'text', 'text': p['text'], 'annotations': [{'type': 'speech_metadata', 'style': p['style']}]} for p in job['parts']]
    os.makedirs(os.path.join(reel, 'audio'), exist_ok=True); out = os.path.join(reel, 'audio', 'vo_raw.wav')
    for model in job.get('models', ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts']):
        body = {'model': model, 'input': [{'type': 'user_input', 'content': content}], 'response_format': {'type': 'audio'},
                'generation_config': {'speech_config': [{'voice': job.get('voice', 'Puck')}]}}
        req = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/interactions', data=json.dumps(body).encode(),
                                     headers={'x-goog-api-key': key, 'Content-Type': 'application/json'})
        try: r = json.load(urllib.request.urlopen(req, timeout=300))
        except urllib.error.HTTPError as e:
            msg = e.read()[:400].decode('utf-8', 'ignore')
            hint = {400: 'check tts.json', 401: 'the key is wrong', 403: 'the key has no access to this model', 404: 'model name not found, trying the next one', 429: 'free limit reached for now: wait, or turn on billing in AI Studio'}.get(e.code, '')
            print(f'FAIL {model} HTTP {e.code} ({hint}) {msg}'); continue
        except Exception as e: print('FAIL', model, e); continue
        auds = [c['data'] for s in r.get('steps', []) if s.get('type') == 'model_output' for c in s.get('content', []) if c.get('type') == 'audio']
        if not auds: print('NO AUDIO from', model, json.dumps(r)[:300]); continue
        data = base64.b64decode(auds[-1])
        if data[:4] != b'RIFF': data = wav_from_pcm(data)
        open(out, 'wb').write(data); print('VOICE OK', model, out, f'{(len(data) - 44) / 48000:.1f} s'); return
    print('VOICE FAILED on every model. Try again in a minute, or make it by hand in AI Studio > Generate speech and save it as', out); sys.exit(1)
if __name__ == '__main__': main()
