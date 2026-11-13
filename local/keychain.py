"""Private stdin/stdout bridge to macOS Keychain. Never log credentials."""
import ctypes as C
import json
import sys

def run(request):
    security = C.CDLL('/System/Library/Frameworks/Security.framework/Security')
    core = C.CDLL('/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation')
    core.CFRelease.argtypes = [C.c_void_p]
    find = security.SecKeychainFindGenericPassword
    find.argtypes = [C.c_void_p, C.c_uint32, C.c_char_p, C.c_uint32, C.c_char_p,
                     C.POINTER(C.c_uint32), C.POINTER(C.c_void_p), C.POINTER(C.c_void_p)]
    find.restype = C.c_int32
    add = security.SecKeychainAddGenericPassword
    add.argtypes = [C.c_void_p, C.c_uint32, C.c_char_p, C.c_uint32, C.c_char_p,
                    C.c_uint32, C.c_char_p, C.c_void_p]
    add.restype = C.c_int32
    modify = security.SecKeychainItemModifyAttributesAndData
    modify.argtypes = [C.c_void_p, C.c_void_p, C.c_uint32, C.c_char_p]
    modify.restype = C.c_int32
    delete = security.SecKeychainItemDelete
    delete.argtypes = [C.c_void_p]
    delete.restype = C.c_int32
    free = security.SecKeychainItemFreeContent
    free.argtypes = [C.c_void_p, C.c_void_p]
    service = request.get('service', 'local.language-learning.deepseek').encode()
    account = b'personal-api-key'
    length, data, item = C.c_uint32(), C.c_void_p(), C.c_void_p()
    status = find(None, len(service), service, len(account), account,
                  C.byref(length), C.byref(data), C.byref(item))
    if status not in (0, -25300):
        raise RuntimeError(str(status))
    try:
        action = request['action']
        if action == 'read':
            return {'key': C.string_at(data, length.value).decode() if status == 0 else ''}
        if action == 'save':
            value = request['key'].encode()
            status = modify(item, None, len(value), value) if item.value else add(
                None, len(service), service, len(account), account, len(value), value, None)
        elif action == 'remove':
            status = delete(item) if item.value else 0
        else:
            raise RuntimeError('invalid action')
        if status != 0:
            raise RuntimeError(str(status))
        return {'ok': True}
    finally:
        if data.value:
            free(None, data)
        if item.value:
            core.CFRelease(item)

try:
    print(json.dumps(run(json.load(sys.stdin))))
except Exception as exc:
    code = str(exc) if isinstance(exc, RuntimeError) and str(exc).lstrip('-').isdigit() else None
    print(json.dumps({'error': '无法访问 macOS 钥匙串，请检查系统授权或解锁钥匙串后重试。', 'code': code}))
    sys.exit(1)
