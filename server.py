#!/usr/bin/env python3
"""
Simple local server for portfolio development.
Run: python3 server.py
Then open: http://localhost:8080
"""

import http.server
import socketserver
import webbrowser
import os
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        print(f"  📡 {self.address_string()} → {format % args}")


def open_browser():
    import time
    time.sleep(0.8)
    webbrowser.open(f"http://localhost:{PORT}")


if __name__ == "__main__":
    os.chdir(DIRECTORY)

    print("=" * 50)
    print("  🚀 Lakshmen Roy – Portfolio Dev Server")
    print("=" * 50)
    print(f"  🌐 Running at: http://localhost:{PORT}")
    print(f"  📁 Serving:    {DIRECTORY}")
    print(f"  🛑 Stop:       Ctrl+C")
    print("=" * 50)

    threading.Thread(target=open_browser, daemon=True).start()

    with socketserver.TCPServer(("", PORT), PortfolioHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n  ✅ Server stopped. Goodbye!\n")
