"""
NekoNoTemp için Mock API Sunucusu

Bu script tamamen simüle edilmiş bir API sunucusu çalıştırır.
API'ye erişim olmadığında veya geliştirme amaçlı kullanılabilir.
"""

import http.server
import socketserver
import json
import random
import time
import datetime
import string
import sys
from urllib.parse import urlparse, parse_qs

PORT = 8000

# Test verileri
MOCK_DOMAINS = [
    "@tempmail.com",
    "@nekotemp.com",
    "@mailbox.org",
    "@securemail.net",
    "@privateinbox.com",
    "@quickmail.org",
    "@instamail.io",
    "@temphub.xyz"
]

# Kullanıcı veritabanı (öğretici amaçlı basit bir sözlük)
users = {}

# Mesaj bankası
message_templates = [
    {
        "subject": "Hoş Geldiniz!",
        "body": """
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #7c4dff;">NekoNoTemp'e Hoş Geldiniz!</h2>
            <p>Geçici e-posta adresiniz başarıyla oluşturuldu.</p>
            <p>Bu adres 24 saat boyunca aktif kalacaktır.</p>
            <p>İyi günler dileriz,<br>NekoNoTemp Ekibi</p>
        </div>
        """
    },
    {
        "subject": "Hesap Doğrulama",
        "body": """
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0066cc;">Hesabınızı Doğrulayın</h2>
            <p>Merhaba,</p>
            <p>Web sitemize kaydolduğunuz için teşekkür ederiz!</p>
            <p>Hesabınızı doğrulamak için lütfen aşağıdaki kodu kullanın:</p>
            <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; letter-spacing: 5px;">
                %s
            </div>
            <p>Güvenli iletişim için NekoNoTemp kullandığınız için teşekkürler.</p>
        </div>
        """
    },
    {
        "subject": "İndirim Kuponu!",
        "body": """
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #e91e63;">Özel Fırsat!</h2>
            <p>Sayın Müşterimiz,</p>
            <p>Yeni müşterimiz olduğunuz için <strong>özel bir indirim kuponu</strong> kazandınız!</p>
            <div style="background-color: #fff9c4; border: 2px dashed #ffc107; padding: 15px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px;">İndirim Kodunuz:</p>
                <p style="font-size: 26px; font-weight: bold; margin: 10px 0; color: #e91e63;">%s</p>
                <p style="margin: 0; font-size: 14px;">Geçerlilik: 7 gün</p>
            </div>
            <p>Bizi tercih ettiğiniz için teşekkürler!</p>
        </div>
        """
    },
    {
        "subject": "Sipariş Onayı #%s",
        "body": """
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #43a047;">Siparişiniz Onaylandı</h2>
            <p>Sayın Müşterimiz,</p>
            <p>Siparişiniz başarıyla alındı ve işleme konuldu.</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
                <p><strong>Sipariş No:</strong> #%s</p>
                <p><strong>Tarih:</strong> %s</p>
                <p><strong>Toplam Tutar:</strong> %s TL</p>
            </div>
            <p>Siparişiniz en kısa sürede kargoya verilecektir.</p>
            <p>Teşekkürler</p>
        </div>
        """
    }
]

class MockAPIHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_GET(self):
        # API endpoint'leri
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # CORS header'ları
        cors_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json'
        }
        
        # API endpoint kontrolü
        if path == '/api/emails/domains':
            self._handle_domains(cors_headers)
        elif path.startswith('/api/emails/messages/') and len(path.split('/')) == 5:
            # /api/emails/messages/{id} durumu
            message_id = path.split('/')[-1]
            self._handle_message_details(message_id, cors_headers)
        elif path == '/api/emails/messages':
            self._handle_messages(cors_headers)
        else:
            # API endpoint değilse, statik dosya olarak işle
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def do_POST(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # CORS header'ları
        cors_headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json'
        }
        
        # API endpoint kontrolü
        if path == '/api/emails/create':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                request_body = json.loads(post_data.decode('utf-8'))
                domain = request_body.get('domain', random.choice(MOCK_DOMAINS))
                self._handle_create_email(domain, cors_headers)
            except json.JSONDecodeError:
                self._send_error(400, "Invalid JSON", cors_headers)
        else:
            self._send_error(404, "Endpoint not found", cors_headers)
    
    def _handle_domains(self, headers):
        """Alan adlarını döndür"""
        response = {
            "success": True,
            "domains": MOCK_DOMAINS
        }
        self._send_json_response(200, response, headers)
    
    def _handle_create_email(self, domain, headers):
        """Yeni e-posta adresi oluştur"""
        if not domain.startswith('@'):
            domain = '@' + domain
            
        if domain not in MOCK_DOMAINS:
            domain = random.choice(MOCK_DOMAINS)
        
        # Rastgele kullanıcı adı oluştur
        username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        email = username + domain
        
        # Token oluştur
        token = 'token_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=16))
        
        # Kullanıcıyı kaydet
        users[token] = {
            'email': email,
            'created_at': datetime.datetime.now().isoformat(),
            'messages': []
        }
        
        # Hoş geldin mesajı ekle
        welcome_template = message_templates[0]
        welcome_message = {
            'id': 'msg_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=8)),
            'subject': welcome_template['subject'],
            'sender': 'welcome@nekotemp.com',
            'recipient': email,
            'date': datetime.datetime.now().isoformat(),
            'body': welcome_template['body'],
            'isRead': False
        }
        users[token]['messages'].append(welcome_message)
        
        # Demo olduğunu göstermek için küçük bir gecikme ekle
        time.sleep(0.5)
        
        response = {
            "success": True,
            "email": email,
            "token": token
        }
        self._send_json_response(200, response, headers)
    
    def _handle_messages(self, headers):
        """Kullanıcının mesajlarını döndür"""
        # Token kontrolü
        auth_header = self.headers.get('Authorization', '')
        token = None
        
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
        
        if not token or token not in users:
            self._send_error(401, "Invalid or missing token", headers)
            return
        
        # Rastgele yeni mesaj ekleme olasılığı (%30)
        if random.random() < 0.3:
            self._generate_random_message(token)
        
        response = {
            "success": True,
            "messages": users[token]['messages']
        }
        self._send_json_response(200, response, headers)
    
    def _handle_message_details(self, message_id, headers):
        """Belirli bir mesajın detaylarını döndür"""
        # Token kontrolü
        auth_header = self.headers.get('Authorization', '')
        token = None
        
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
        
        if not token or token not in users:
            self._send_error(401, "Invalid or missing token", headers)
            return
        
        # Mesajı bul
        message = None
        for msg in users[token]['messages']:
            if msg['id'] == message_id:
                message = msg
                # Mesajı okundu olarak işaretle
                msg['isRead'] = True
                break
        
        if not message:
            self._send_error(404, "Message not found", headers)
            return
        
        response = {
            "success": True,
            "message": message
        }
        self._send_json_response(200, response, headers)
    
    def _generate_random_message(self, token):
        """Rastgele bir mesaj oluştur ve kullanıcıya ekle"""
        if token not in users:
            return
        
        # Rastgele template seç (hoş geldin mesajı hariç)
        template_index = random.randint(1, len(message_templates) - 1)
        template = message_templates[template_index]
        
        # Template içeriğini özelleştir
        subject = template['subject']
        body = template['body']
        
        if template_index == 1:  # Doğrulama kodu
            verification_code = ''.join(random.choices(string.digits, k=6))
            body = body % verification_code
        elif template_index == 2:  # İndirim kuponu
            coupon_code = ''.join(random.choices(string.ascii_uppercase, k=8))
            body = body % coupon_code
        elif template_index == 3:  # Sipariş onayı
            order_id = ''.join(random.choices(string.digits, k=6))
            subject = subject % order_id
            today = datetime.datetime.now().strftime("%d.%m.%Y")
            total = random.randint(50, 500)
            body = body % (order_id, today, total)
        
        # Gönderici adı oluştur
        senders = ['info@example.com', 'shop@store.com', 'support@service.net', 'noreply@system.org']
        
        message = {
            'id': 'msg_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=8)),
            'subject': subject,
            'sender': random.choice(senders),
            'recipient': users[token]['email'],
            'date': datetime.datetime.now().isoformat(),
            'body': body,
            'isRead': False
        }
        
        users[token]['messages'].append(message)
    
    def _send_json_response(self, status_code, data, headers):
        """JSON yanıtı gönder"""
        self.send_response(status_code)
        
        # Header'ları ayarla
        for name, value in headers.items():
            self.send_header(name, value)
        
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def _send_error(self, status_code, message, headers):
        """Hata yanıtı gönder"""
        self.send_response(status_code)
        
        # Header'ları ayarla
        for name, value in headers.items():
            self.send_header(name, value)
        
        self.end_headers()
        
        error_response = {
            "success": False,
            "error": message
        }
        
        self.wfile.write(json.dumps(error_response).encode('utf-8'))

def run_server():
    """Sunucuyu başlat"""
    try:
        with socketserver.TCPServer(("", PORT), MockAPIHandler) as httpd:
            print(f"\n✅ NekoNoTemp Mock API Sunucusu http://localhost:{PORT} adresinde çalışıyor")
            print("📧 Kullanılabilir alan adları:")
            for domain in MOCK_DOMAINS:
                print(f"   • {domain}")
            print("\n🔍 Not: Bu simüle edilmiş bir API'dir, gerçek e-posta oluşturmaz")
            print("🌐 Aynı zamanda statik dosyalarınızı da sunar (HTML, CSS, JS)")
            print("⚠️ Çıkmak için CTRL+C tuşlarına basın")
            print("\n🚀 Şimdi tarayıcınızda http://localhost:8000 adresine gidebilirsiniz\n")
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n⛔ Sunucu durduruluyor... İyi günler!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Hata: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_server() 