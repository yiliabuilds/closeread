"""Package a built app, preserving executable modes and verifying the mounted result."""
from pathlib import Path
import shutil, subprocess, tempfile, sys, os
root=Path(__file__).resolve().parent.parent
app=Path(sys.argv[1]) if len(sys.argv)>1 else Path((root/'macos-package/latest-build.txt').read_text().strip())
stage=Path(tempfile.mkdtemp(prefix='closeread-image-'))
# copy preserves mode; copyfile alone silently strips executable permissions.
shutil.copytree(app,stage/'CloseRead.app',copy_function=shutil.copy)
executables=['Contents/MacOS/CloseRead','Contents/Resources/node','Contents/Resources/helper']
for rel in executables:
 p=stage/'CloseRead.app'/rel
 if not os.access(p,os.X_OK):raise RuntimeError('Missing executable permission: '+rel)
subprocess.run(['codesign','--verify','--deep','--strict',str(stage/'CloseRead.app')],check=True)
(stage/'Applications').symlink_to('/Applications')
shutil.copy(root/'macos-package/安装说明.txt',stage/'安装说明.txt')
output=root/'CloseRead-v0.2-macOS-AppleSilicon.dmg'
subprocess.run(['hdiutil','create','-volname','CloseRead','-srcfolder',str(stage),'-format','UDZO','-ov',str(output)],check=True)
subprocess.run(['hdiutil','verify',str(output)],check=True)
mount=Path(tempfile.mkdtemp(prefix='closeread-mounted-'))
subprocess.run(['hdiutil','attach',str(output),'-readonly','-nobrowse','-mountpoint',str(mount)],check=True)
try:
 for rel in executables:
  if not os.access(mount/'CloseRead.app'/rel,os.X_OK):raise RuntimeError('DMG lost executable permission: '+rel)
 subprocess.run(['codesign','--verify','--deep','--strict',str(mount/'CloseRead.app')],check=True)
 subprocess.run([str(mount/'CloseRead.app/Contents/Resources/node'),'--version'],check=True)
 print('Verified mounted DMG: executable permissions, signature, bundled Node.')
finally:subprocess.run(['hdiutil','detach',str(mount)],check=True)
print(output)
