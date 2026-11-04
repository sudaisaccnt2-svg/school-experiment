"""Send one or more Python files (concatenated) to Blender via the BlenderMCP socket (localhost:9876).
Usage: python bsend.py common.py 01_setup.py ..."""
import socket, json, sys

code = "\n\n".join(open(p, encoding="utf-8").read() for p in sys.argv[1:])
s = socket.create_connection(("localhost", 9876), timeout=900)
s.sendall(json.dumps({"type": "execute_code", "params": {"code": code}}).encode())
data = b""
while True:
    c = s.recv(65536)
    if not c:
        break
    data += c
    try:
        json.loads(data)
        break
    except ValueError:
        pass
print(data.decode()[:8000])
