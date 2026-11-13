"""Launch without prompting; credentials are managed through the local website."""
import os
from pathlib import Path
import shutil
import subprocess

root = Path(__file__).resolve().parent
node = shutil.which('node') or '/usr/local/bin/node'
print('密钥由 macOS 钥匙串保存。首次使用请在网页的“我的 · API 设置”中配置。')
env = dict(os.environ)
env.pop('DEEPSEEK_API_KEY', None)
try:
    subprocess.run([node, str(root / 'server.mjs')], cwd=root, env=env, check=False)
except KeyboardInterrupt:
    print('\n服务已停止。')
