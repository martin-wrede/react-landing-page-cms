import json
import os
import re
import urllib.request
from pathlib import Path

base_dir = Path(__file__).resolve().parent.parent
env_file = base_dir / '.env'
api_key = None
if env_file.exists():
    text = env_file.read_text(encoding='utf-8')
    match = re.search(r'^FAL_API_KEY=(.*)$', text, re.MULTILINE)
    if match:
        api_key = match.group(1).strip()

if not api_key:
    raise RuntimeError('FAL_API_KEY missing in .env')

payload = {
    'prompt': (
        'A realistic office scene of a HR manager and HR team sitting together in a bright daylight workspace, '
        'discussing employee questions, laptops on table in front, modern open office, natural daylight, warm but bright '
        'professional environment, authentic corporate photography style, wide cinematic composition, people in business '
        'casual attire, not cartoon, clean, realistic, high detail'
    ),
    'image_size': 'landscape_16_9',
    'num_inference_steps': 28,
}

req = urllib.request.Request(
    'https://fal.run/fal-ai/flux/dev',
    data=json.dumps(payload).encode('utf-8'),
    headers={
        'Authorization': f'Key {api_key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    method='POST',
)

with urllib.request.urlopen(req, timeout=180) as resp:
    data = json.loads(resp.read().decode('utf-8'))

images = data.get('images') or []
if not images:
    raise RuntimeError(f'No images returned: {data}')
image_url = images[0].get('url')
if not image_url:
    raise RuntimeError(f'No image URL in response: {data}')

out_dir = base_dir / 'public' / 'images'
out_dir.mkdir(parents=True, exist_ok=True)
out_path = out_dir / 'hero-hr-team.png'

with urllib.request.urlopen(image_url, timeout=180) as resp:
    out_path.write_bytes(resp.read())

print(f'Saved {out_path}')
