import http.server
import socketserver
import webbrowser
import socket
import os
import sys

def find_free_port():
    # Bind to port 0 to let the OS choose a free port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('localhost', 0))
        return s.getsockname()[1]

def main():
    # Change working directory to the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    port = find_free_port()
    handler = http.server.SimpleHTTPRequestHandler
    
    url = f"http://localhost:{port}"
    print("=" * 60)
    print("🚀 STARTING PREMIUM BMI TRACKER WEB APP SERVER...")
    print(f"🔗 App is running at: {url}")
    print("=" * 60)
    
    # Automatically open the browser
    webbrowser.open(url)
    
    # Run the server
    try:
        with socketserver.TCPServer(('localhost', port), handler) as httpd:
            print("Server started successfully. Press Ctrl+C to stop.")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server. Goodbye!")
        sys.exit(0)

if __name__ == "__main__":
    main()
