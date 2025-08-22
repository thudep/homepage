import http.server
import socketserver
import webbrowser
import os

PORT = 8080

# 当前目录作为网站根目录
web_dir = os.path.abspath(os.path.dirname(__file__))
os.chdir(web_dir)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    url = f"http://localhost:{PORT}/index.html"
    print(f"Serving at {url}")

    # 自动打开默认浏览器
    webbrowser.open(url)

    # 启动服务器
    httpd.serve_forever()
