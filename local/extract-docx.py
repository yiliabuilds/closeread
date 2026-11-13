"""Read bounded DOCX bytes from stdin; output plain paragraphs, never execute content."""
import io
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

def extract(data):
    if len(data) > 5 * 1024 * 1024:
        raise ValueError('文件超过 5 MB，请先拆分。')
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        info = archive.getinfo('word/document.xml')
        if info.file_size > 2 * 1024 * 1024:
            raise ValueError('文档正文过大，请先拆分。')
        xml = archive.read(info)
    if b'<!DOCTYPE' in xml or b'<!ENTITY' in xml:
        raise ValueError('不支持含自定义 XML 实体的文档。')
    root = ET.fromstring(xml)
    ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    if root.tag != ns + 'document':
        raise ValueError('不支持这种 Word 格式，请另存为标准 DOCX。')
    paragraphs = []
    for p in root.iter(ns + 'p'):
        parts = []
        def walk(el):
            if el.tag in (ns + 'del', ns + 'moveFrom', ns + 'txbxContent'):
                return
            if el.tag == ns + 't':
                parts.append(el.text or '')
            elif el.tag in (ns + 'br', ns + 'cr'):
                parts.append('\n')
            elif el.tag == ns + 'tab':
                parts.append('\t')
            for child in el:
                walk(child)
        walk(p)
        text = ''.join(parts).strip()
        if text:
            paragraphs.append(text)
    if not paragraphs:
        raise ValueError('没有找到正文文字；图片中的文字暂不支持识别。')
    return {'paragraphs': paragraphs, 'notice': '仅提取正文文字；图片、页眉页脚、脚注和复杂排版不保留。请核对原文。'}

if __name__ == '__main__':
    try:
        print(json.dumps(extract(sys.stdin.buffer.read(5 * 1024 * 1024 + 1)), ensure_ascii=False))
    except Exception as error:
        print(json.dumps({'error': str(error) if isinstance(error, ValueError) else '无法读取文档，请确认是未加密、未损坏的 .docx 文件。'}, ensure_ascii=False))
        sys.exit(1)
