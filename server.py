#!/usr/bin/env python3
"""
Simple local development and LAN server for BlitzCount.
Automatically discovers your local IP address so you can immediately
test and install the PWA on an Android tablet or phone over your home Wi-Fi!
"""

import http.server
import socket
import socketserver
import os
import sys

DEFAULT_PORT = 8000

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def find_open_server(start_port=DEFAULT_PORT, max_attempts=20):
    for port in range(start_port, start_port + max_attempts):
        try:
            httpd = ReusableTCPServer(("", port), NoCacheHandler)
            return httpd, port
        except OSError as e:
            if e.errno in (98, 48): # Address in use
                continue
            raise
    raise RuntimeError(f"Could not bind to any port in range {start_port}-{start_port + max_attempts}")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    local_ip = get_local_ip()

    httpd, port = find_open_server(DEFAULT_PORT)

    print("=" * 60, flush=True)
    print(" 🦫  BlitzCount (Counti the Capybara) is running!", flush=True)
    print("=" * 60, flush=True)
    print(f" ▶  On this computer:              http://localhost:{port}", flush=True)
    print(f" 📱 On your Tablet/Phone (Wi-Fi):  http://{local_ip}:{port}", flush=True)
    print("=" * 60, flush=True)
    print(" 👉 Open the link on your Android device and tap 'Add to Home screen'!", flush=True)
    print("    Press Ctrl+C to stop the server.", flush=True)
    print("=" * 60, flush=True)

    with httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Auf Wiedersehen!", flush=True)
            sys.exit(0)

if __name__ == '__main__':
    main()
