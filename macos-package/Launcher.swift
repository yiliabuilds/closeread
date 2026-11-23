import Cocoa
let app=NSApplication.shared
final class Launcher:NSObject,NSApplicationDelegate {
 var child:Process?;var timer:Timer?;var attempts=0;var log:FileHandle?
 let url=URL(string:"http://127.0.0.1:4180/index.html")!
 func alert(_ text:String) { let a=NSAlert();a.messageText="CloseRead";a.informativeText=text;a.runModal() }
 func applicationDidFinishLaunching(_ notification:Notification) {
  let menu=NSMenu(),item=NSMenuItem(),sub=NSMenu();sub.addItem(withTitle:"打开 CloseRead",action:#selector(openPage),keyEquivalent:"o").target=self;sub.addItem(withTitle:"退出 CloseRead",action:#selector(NSApplication.terminate(_:)),keyEquivalent:"q");item.submenu=sub;menu.addItem(item);app.mainMenu=menu
  URLSession.shared.dataTask(with:URL(string:"http://127.0.0.1:4180/api/status")!) { data,response,error in
   DispatchQueue.main.async {
    if let data=data,let x=(try? JSONSerialization.jsonObject(with:data)) as? [String:Any],x["model"] != nil,x["configured"] != nil { self.alert("检测到已有精读服务，将打开现有版本。要使用安装版，请先关闭原启动程序，再重新打开 CloseRead。");self.openPage();app.terminate(nil);return }
    if response != nil { self.alert("4180 端口被其他程序占用，请关闭占用程序后重新打开。");app.terminate(nil);return }
    self.start()
   }
  }.resume()
 }
 func start() {
  do {
   let fm=FileManager.default, support=fm.urls(for:.applicationSupportDirectory,in:.userDomainMask)[0].appendingPathComponent("CloseRead",isDirectory:true)
   try fm.createDirectory(at:support,withIntermediateDirectories:true,attributes:[.posixPermissions:0o700])
   let data=support.appendingPathComponent("data",isDirectory:true)
   if !fm.fileExists(atPath:data.path) {
    let ask=NSAlert();ask.messageText="欢迎使用 CloseRead";ask.informativeText="已有文章？选择原来的 german-learning-os 或 local 文件夹，复制文章到应用的数据目录。原文件会保留。笔记和生词请继续使用原来的浏览器访问 127.0.0.1:4180。";ask.addButton(withTitle:"导入原有文章");ask.addButton(withTitle:"全新开始")
    if ask.runModal() == .alertFirstButtonReturn {
     let panel=NSOpenPanel();panel.canChooseDirectories=true;panel.canChooseFiles=false;panel.message="选择原项目文件夹（里面包含 .local-data）"
     guard panel.runModal() == .OK,let selected=panel.url else { app.terminate(nil);return }
     let source=selected.appendingPathComponent(".local-data",isDirectory:true)
     guard fm.fileExists(atPath:source.path) else { alert("该文件夹没有 .local-data，请重新启动后选择原项目文件夹。");app.terminate(nil);return }
     let staging=support.appendingPathComponent("import-"+UUID().uuidString)
     do { try fm.copyItem(at:source,to:staging);try fm.moveItem(at:staging,to:data) } catch { try? fm.removeItem(at:staging);throw error }
    } else { try fm.createDirectory(at:data,withIntermediateDirectories:true,attributes:[.posixPermissions:0o700]) }
   }
   let resources=Bundle.main.resourceURL!,runtime=resources.appendingPathComponent("local")
   let task=Process();task.executableURL=resources.appendingPathComponent("node");task.arguments=[runtime.appendingPathComponent("desktop.mjs").path];task.currentDirectoryURL=runtime
   var env=ProcessInfo.processInfo.environment;env.removeValue(forKey:"DEEPSEEK_API_KEY");env["CLOSEREAD_DATA_DIR"]=data.path;task.environment=env
   let logURL=support.appendingPathComponent("launcher.log");fm.createFile(atPath:logURL.path,contents:nil,attributes:[.posixPermissions:0o600]);log=try FileHandle(forWritingTo:logURL);task.standardOutput=log;task.standardError=log
   child=task;try task.run()
   timer=Timer.scheduledTimer(withTimeInterval:0.4,repeats:true) { _ in self.poll() }
  } catch { alert("启动失败："+error.localizedDescription);app.terminate(nil) }
 }
 func poll() {
  attempts += 1
  if child?.isRunning != true || attempts > 180 { timer?.invalidate();alert("服务未能启动。请检查是否已有启动程序运行，或重新打开应用。");app.terminate(nil);return }
  URLSession.shared.dataTask(with:URL(string:"http://127.0.0.1:4180/api/status")!) { data,response,error in
   if let r=response as? HTTPURLResponse,r.statusCode == 200 { DispatchQueue.main.async { if self.timer != nil { self.timer?.invalidate();self.timer=nil;self.openPage() } } }
  }.resume()
 }
 @objc func openPage() { NSWorkspace.shared.open(url) }
 func applicationShouldHandleReopen(_ sender:NSApplication,hasVisibleWindows flag:Bool)->Bool { openPage();return true }
 func applicationWillTerminate(_ notification:Notification) { timer?.invalidate();if child?.isRunning == true { child?.terminate() };try? log?.close() }
}
let delegate=Launcher();app.delegate=delegate;app.setActivationPolicy(.regular);app.run()
