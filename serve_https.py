from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import ssl
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

server = ThreadingHTTPServer(("127.0.0.1", 8443), Handler)
server.socket = ssl.wrap_socket(
    server.socket,
    certfile="certs/server.crt",
    keyfile="certs/server.key",
    server_side=True,
)
print("HTTPS server running at https://127.0.0.1:8443")
server.serve_forever()
