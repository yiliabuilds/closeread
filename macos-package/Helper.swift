import Foundation
import Security
func reply(_ object: [String:Any]) { if let data = try? JSONSerialization.data(withJSONObject: object) { FileHandle.standardOutput.write(data) } }
final class Doc: NSObject, XMLParserDelegate {
 var paragraphs=[String](), text="", inText=false, skip=0, inParagraph=false
 func parser(_ parser: XMLParser,didStartElement name:String,namespaceURI:String?,qualifiedName:String?,attributes:[String:String]) {
  if ["del","moveFrom","txbxContent"].contains(name) { skip += 1 }
  if skip > 0 { return }
  if name == "p" { text=""; inParagraph=true }
  if name == "t" { inText=true }
  if name == "br" || name == "cr" { text += "\n" }
  if name == "tab" { text += "\t" }
 }
 func parser(_ parser: XMLParser,foundCharacters string:String) { if inText && skip == 0 { text += string } }
 func parser(_ parser: XMLParser,didEndElement name:String,namespaceURI:String?,qualifiedName:String?) {
  if ["del","moveFrom","txbxContent"].contains(name) { skip -= 1; return }
  if skip > 0 { return }
  if name == "t" { inText=false }
  if name == "p" { let s=text.trimmingCharacters(in:.whitespacesAndNewlines); if !s.isEmpty { paragraphs.append(s) };inParagraph=false }
 }
}
do {
 let input=FileHandle.standardInput.readDataToEndOfFile()
 if CommandLine.arguments.contains("docx") {
  guard input.count <= 5*1024*1024 else { throw NSError(domain:"文件超过 5 MB",code:1) }
  let temp=FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString+".docx")
  try input.write(to:temp,options:.atomic); defer { try? FileManager.default.removeItem(at:temp) }
  let task=Process(), pipe=Pipe(); task.executableURL=URL(fileURLWithPath:"/usr/bin/unzip");task.arguments=["-p",temp.path,"word/document.xml"];task.standardOutput=pipe;task.standardError=FileHandle.nullDevice
  try task.run();var data=Data()
  while true { let chunk=pipe.fileHandleForReading.readData(ofLength:65536);if chunk.isEmpty { break }; data.append(chunk);if data.count > 2*1024*1024 { task.terminate();throw NSError(domain:"正文过大，请拆分文件",code:1) } }
  task.waitUntilExit()
  guard task.terminationStatus == 0, let xml=String(data:data,encoding:.utf8), !xml.contains("<!DOCTYPE"), !xml.contains("<!ENTITY") else { throw NSError(domain:"无法读取标准 DOCX 正文",code:1) }
  let parser=XMLParser(data:data), delegate=Doc();parser.shouldProcessNamespaces=true;parser.shouldResolveExternalEntities=false;parser.delegate=delegate
  guard parser.parse(), !delegate.paragraphs.isEmpty else { throw NSError(domain:"未找到可读取的正文",code:1) }
  reply(["paragraphs":delegate.paragraphs,"notice":"仅提取正文文字；图片、页眉页脚和复杂排版不保留。请核对原文。"])
 } else {
  let req=try JSONSerialization.jsonObject(with:input) as! [String:Any]
  let query:[String:Any]=[kSecClass as String:kSecClassGenericPassword,kSecAttrService as String:req["service"] as? String ?? "local.language-learning.deepseek",kSecAttrAccount as String:"personal-api-key"]
  var status:OSStatus=errSecSuccess
  switch req["action"] as? String {
   case "read": var q=query;q[kSecReturnData as String]=true;var result:CFTypeRef?;status=SecItemCopyMatching(q as CFDictionary,&result);if status == errSecItemNotFound { reply(["key":""]);exit(0) };if status == errSecSuccess,let data=result as? Data { reply(["key":String(data:data,encoding:.utf8) ?? ""]);exit(0) }
   case "save": let data=Data((req["key"] as? String ?? "").utf8);status=SecItemUpdate(query as CFDictionary,[kSecValueData as String:data] as CFDictionary);if status == errSecItemNotFound { var q=query;q[kSecValueData as String]=data;status=SecItemAdd(q as CFDictionary,nil) }
   case "remove":status=SecItemDelete(query as CFDictionary);if status == errSecItemNotFound { status=errSecSuccess }
   default:throw NSError(domain:"无效操作",code:1)
  }
  guard status == errSecSuccess else { throw NSError(domain:"无法访问钥匙串，请检查系统授权",code:Int(status)) };reply(["ok":true])
 }
} catch { reply(["error":(error as NSError).domain]);exit(1) }
