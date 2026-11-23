from pathlib import Path
import shutil, subprocess, plistlib, tempfile
root=Path(__file__).resolve().parent.parent
out=Path(tempfile.mkdtemp(prefix='closeread-build-'));app=out/'CloseRead.app';contents=app/'Contents';resources=contents/'Resources'
resources.mkdir(parents=True,exist_ok=True);(contents/'MacOS').mkdir(exist_ok=True)
local=resources/'local'
if local.exists():shutil.rmtree(local)
shutil.copytree(root/'local',local)
subprocess.run(['lipo','/usr/local/bin/node','-thin','arm64','-output',str(resources/'node')],check=True)
for src,target in [('Launcher.swift',contents/'MacOS/CloseRead'),('Helper.swift',resources/'helper')]:
 subprocess.run(['swiftc','-target','arm64-apple-macosx15.0','-O','-module-cache-path','/tmp/closeread-swift-cache',str(root/'macos-package'/src),'-o',str(target)],check=True)
(local/'key-store.mjs').write_text((local/'key-store.mjs').read_text().replace("spawn('/usr/bin/python3',[fileURLToPath(new URL('./keychain.py',import.meta.url))]", "spawn(fileURLToPath(new URL('../helper',import.meta.url)),['keychain']"))
(local/'import-docx.mjs').write_text((local/'import-docx.mjs').read_text().replace("spawn('python3',[fileURLToPath(new URL('./extract-docx.py',import.meta.url))]", "spawn(fileURLToPath(new URL('../helper',import.meta.url)),['docx']").replace('请确认 Python 3 可用。','请重新安装 CloseRead。'))
(local/'desktop.mjs').write_text('''import {createApp} from './server.mjs';
import {createKeyStore} from './key-store.mjs';
const keyStore=createKeyStore();let key='',keyStoreError='';
try{key=await keyStore.read()}catch{keyStoreError='未能读取钥匙串，请在设置中检查系统授权。'}
const server=createApp({key,keyStore,keyStoreError,dataDir:process.env.CLOSEREAD_DATA_DIR});
server.on('error',()=>{console.error('无法启动本机服务');process.exit(1)});
server.listen(4180,'127.0.0.1');
''')
with (contents/'Info.plist').open('wb') as f:plistlib.dump({'CFBundleName':'CloseRead','CFBundleDisplayName':'精读钥匙 · CloseRead','CFBundleIdentifier':'io.github.yiliabuilds.closeread','CFBundleExecutable':'CloseRead','CFBundlePackageType':'APPL','CFBundleShortVersionString':'0.2.0','CFBundleVersion':'2','LSMinimumSystemVersion':'15.0','CFBundleIconFile':'CloseRead.icns','NSHighResolutionCapable':True},f)
shutil.copy2(root/'macos-package/CloseRead.icns',resources/'CloseRead.icns')
shutil.copy2(root/'macos-package/NODE-LICENSE.txt',resources/'NODE-LICENSE.txt')
shutil.copy2(root/'LICENSE',resources/'LICENSE')
for p in [resources/'node',resources/'helper',contents/'MacOS/CloseRead']:p.chmod(0o755);subprocess.run(['codesign','--force','--sign','-',str(p)],check=True)
subprocess.run(['codesign','--force','--sign','-',str(app)],check=True)
(root/'macos-package/latest-build.txt').write_text(str(app))
print(app)
