"""Serve the Atoms 3D app (all films + games) to iPads / headsets on this network. ONE link for everything:

    http://<this-PC>:8000     start page: opens the offline app if the iPad trusts the classroom certificate,
                              otherwise shows the one-time certificate setup (or opens the app directly)

Behind it: https://<this-PC>:8443 is the installable offline app, http://<this-PC>:8000/app/ is a quick view.
Run:  python web/serve.py   (or double-click start_ipad_server.bat)"""
import http.server, os, socket, socketserver, ssl, sys, threading
from urllib.parse import urlsplit

WEB = os.path.dirname(os.path.abspath(__file__))
CERTS = os.path.join(os.path.dirname(WEB), "certs")
HTTP_PORT, HTTPS_PORT = 8000, 8443
TYPES = {".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
         ".webmanifest": "application/manifest+json", ".glb": "model/gltf-binary", ".hdr": "application/octet-stream",
         ".usdz": "model/vnd.usdz+zip", ".crt": "application/x-x509-ca-cert", ".css": "text/css", ".html": "text/html"}


class AppHandler(http.server.SimpleHTTPRequestHandler):
    """HTTPS: the app at the site root."""
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, **TYPES}

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=WEB, **kw)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "--verbose" in sys.argv:
            super().log_message(fmt, *args)


class StartHandler(AppHandler):
    """HTTP: start page at /, the app (quick view) under /app/, and the certificate download."""

    def translate_path(self, path):
        p = urlsplit(path).path
        if p in ("/", "/index.html"):
            return os.path.join(WEB, "start.html")
        if p == "/install-certificate.crt":
            return os.path.join(WEB, "install-certificate.crt")
        if p.startswith("/app/"):
            return super().translate_path(path[len("/app"):])
        return os.path.join(WEB, "start.html")

    def do_GET(self):
        if urlsplit(self.path).path == "/app":
            self.send_response(301); self.send_header("Location", "/app/"); self.end_headers(); return
        super().do_GET()


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = False   # on Windows reuse lets duplicate servers share a port silently


HOTSPOT_IP = "192.168.137.1"   # Windows Mobile Hotspot always uses this address


def main_ip():
    # iPads on this PC's Mobile Hotspot must use the hotspot address
    if HOTSPOT_IP in {i[4][0] for i in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET)}:
        return HOTSPOT_IP
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(("8.8.8.8", 80)); ip = s.getsockname()[0]; s.close()
        return ip
    except OSError:
        return socket.gethostbyname(socket.gethostname())


try:
    http_srv = Server(("0.0.0.0", HTTP_PORT), StartHandler)
except OSError:
    print("\n  Atoms 3D (all films + games) is already running. On the iPad (same Wi-Fi) open in Safari:\n")
    print("        http://%s:%d\n" % (main_ip(), HTTP_PORT))
    sys.exit(0)
threading.Thread(target=http_srv.serve_forever, daemon=True).start()
# local-only: the app at the site root, for the Cloudflare tunnel (start_offline_link.bat) to publish over trusted https
tunnel_srv = Server(("127.0.0.1", 8001), AppHandler)
threading.Thread(target=tunnel_srv.serve_forever, daemon=True).start()
if os.path.exists(os.path.join(CERTS, "server.crt")):
    https_srv = Server(("0.0.0.0", HTTPS_PORT), AppHandler)
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(os.path.join(CERTS, "server.crt"), os.path.join(CERTS, "server.key"))
    https_srv.socket = ctx.wrap_socket(https_srv.socket, server_side=True)
    threading.Thread(target=https_srv.serve_forever, daemon=True).start()

print("\n  Atoms 3D (all films + games) is running. On the iPad (same Wi-Fi) open in Safari:\n")
print("        http://%s:%d\n" % (main_ip(), HTTP_PORT))
print("  Keep this window open while iPads install the app. Close it to stop.")
try:
    threading.Event().wait()
except KeyboardInterrupt:
    pass
