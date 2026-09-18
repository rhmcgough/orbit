from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


HOST = "127.0.0.1"
PORT = 8000


if __name__ == "__main__":
    print(f"Orbit is running at http://{HOST}:{PORT}")
    try:
        ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler).serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
