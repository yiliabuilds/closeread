import AppKit
let dir=CommandLine.arguments[1]
for size in [16,32,128,256,512] { for scale in [1,2] {
 let n=size*scale, image=NSImage(size:NSSize(width:n,height:n));image.lockFocus()
 NSColor(calibratedRed:0.96,green:0.97,blue:0.98,alpha:1).setFill();NSBezierPath(roundedRect:NSRect(x:0,y:0,width:n,height:n),xRadius:CGFloat(n)*0.22,yRadius:CGFloat(n)*0.22).fill()
 let font=NSFont.systemFont(ofSize:CGFloat(n)*0.42,weight:.medium), text="Cr" as NSString
 let attrs:[NSAttributedString.Key:Any]=[.font:font,.foregroundColor:NSColor(calibratedRed:0.17,green:0.32,blue:0.49,alpha:1)]
 let s=text.size(withAttributes:attrs);text.draw(at:NSPoint(x:(CGFloat(n)-s.width)/2,y:(CGFloat(n)-s.height)/2),withAttributes:attrs);image.unlockFocus()
 let bitmap=NSBitmapImageRep(data:image.tiffRepresentation!)!;try bitmap.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:dir+"/icon_\(size)x\(size)"+(scale == 2 ? "@2x" : "")+".png"))
} }
