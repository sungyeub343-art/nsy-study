from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import ssl
import os
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        parsed_path = urlparse(self.path).path.lower()

        if parsed_path.endswith(".html") or parsed_path in ("", "/"):
            self.send_header("Cache-Control", "no-cache")
        else:
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")

        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

server = ThreadingHTTPServer(("127.0.0.1", 8443), Handler)
server.socket = ssl.wrap_socket(
    server.socket,
    certfile="certs/server.crt",
    keyfile="certs/server.key",
    server_side=True,
)
print("HTTPS server running at https://127.0.0.1:8443")
server.serve_forever()
