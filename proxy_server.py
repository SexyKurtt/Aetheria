import http.server
import socketserver
import json
import urllib.request
import urllib.error
from urllib.parse import urlparse, parse_qs

PORT = 8000
API_BASE_URL = 'https://nekoniiis-mail-v1-api.vercel.app/api'

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Statik dosyalar için normal işleme
        if not self.path.startswith('/api/'):
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        
        # API proxy işlemi
        try:
            parsed_path = urlparse(self.path)
            
            # Gelen yolu proxy'den API'ye yönlendir
            target_url = API_BASE_URL + parsed_path.path[4:] # /api kısmını çıkar
            
            # Query parametreleri varsa ekle
            if parsed_path.query:
                target_url += f"?{parsed_path.query}"
            
            # Client'in gönderdiği headerları alıp API'ye ilet (Authorization gibi)
            headers = {}
            for header in self.headers:
                if header.lower() in ['authorization']:
                    headers[header] = self.headers[header]
            
            # API isteği yap
            req = urllib.request.Request(target_url, headers=headers)
            with urllib.request.urlopen(req) as response:
                data = response.read()
                
                # Response headerları ayarla
                self.send_response(response.status)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                self.end_headers()
                
                # Response body'i gönder
                self.wfile.write(data)
                
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_POST(self):
        if not self.path.startswith('/api/'):
            self.send_response(404)
            self.end_headers()
            return
            
        try:
            parsed_path = urlparse(self.path)
            
            # Post body'i oku
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Gelen yolu proxy'den API'ye yönlendir
            target_url = API_BASE_URL + parsed_path.path[4:] # /api kısmını çıkar
            
            # Client'in gönderdiği headerları alıp API'ye ilet
            headers = {
                'Content-Type': 'application/json'
            }
            for header in self.headers:
                if header.lower() in ['authorization']:
                    headers[header] = self.headers[header]
            
            # API isteği yap
            req = urllib.request.Request(
                target_url, 
                data=post_data,
                headers=headers,
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                data = response.read()
                
                # Response headerları ayarla
                self.send_response(response.status)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                self.end_headers()
                
                # Response body'i gönder
                self.wfile.write(data)
                
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

# Test verileri (API bağlantısı başarısız olduğunda kullanılır)
MOCK_DOMAINS = [
    "@tempmail.com",
    "@nekotemp.com",
    "@mailbox.org",
    "@securemail.net",
    "@privateinbox.com"
]

# API test endpoint
class MockAPIHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/emails/domains':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            mock_response = {
                "success": True,
                "domains": MOCK_DOMAINS
            }
            self.wfile.write(json.dumps(mock_response).encode())
            return
            
        # Statik dosyaları normal şekilde servis et
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

def run_server():
    try:
        # Önce gerçek API ile dene
        with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
            print(f"Proxy sunucu http://localhost:{PORT} adresinde çalışıyor")
            print("API istekleri https://nekoniiis-mail-v1-api.vercel.app/api adresine yönlendiriliyor")
            print("Çıkmak için Ctrl+C tuşlarına basın")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("Sunucu durduruluyor...")
    except Exception as e:
        print(f"Hata: {e}")

if __name__ == "__main__":
    run_server() 