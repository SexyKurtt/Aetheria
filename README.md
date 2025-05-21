# NekoNoTemp - Anlık İletişim Kalkanınız

NekoNoTemp, modern ve kullanıcı dostu bir geçici e-posta hizmetidir. Kişisel e-posta adresinizi paylaşmak istemediğiniz durumlarda, hızlıca bir geçici e-posta adresi oluşturarak güvenle iletişim kurmanızı sağlar.

## 🌟 Özellikler

- Hızlı ve kolay geçici e-posta oluşturma
- Çoklu alan adı seçeneği
- Gerçek zamanlı e-posta kontrolü
- Modern ve minimalist kullanıcı arayüzü
- Tamamen tarayıcı tabanlı, kurulum gerektirmez
- Mobil uyumlu tasarım

## 🚀 Kullanım

1. Alan adı seçin veya rastgele bir alan adı kullanın
2. "Geçici Adres Oluştur" butonuna tıklayın
3. Hemen bir geçici e-posta adresi oluşturulacak
4. Gelen e-postaları gerçek zamanlı olarak görüntüleyin
5. Bir e-postaya tıklayarak detaylarını inceleyin

## 💻 Teknik Detaylar

NekoNoTemp, tamamen modern web teknolojileri kullanılarak geliştirilmiştir:

- **HTML5** - Semantik ve erişilebilir yapı
- **CSS3** - Modern layout, CSS değişkenleri ve mikro-animasyonlar
- **JavaScript (ES6+)** - API entegrasyonu, durum yönetimi ve arayüz etkileşimleri
- **RESTful API** - Kullandığımız API: https://nekoniiis-mail-v1-api.vercel.app/

## 🛠️ Kurulum

Proje tamamen istemci tabanlı çalıştığı için, herhangi bir kurulum gerektirmez. Dosyaları bir web sunucusunda barındırmanız veya doğrudan tarayıcınızda açmanız yeterlidir.

```bash
# Projeyi yerel bir web sunucusunda çalıştırmak için
# (Eğer Python yüklüyse)
python -m http.server

# veya Node.js ile
npx serve
```

## 📡 API Endpoints

Uygulama aşağıdaki API endpoint'lerini kullanmaktadır:

- `GET /api/emails/domains` - Kullanılabilir alan adlarını listeler
- `POST /api/emails/create` - Yeni bir geçici e-posta adresi oluşturur
- `GET /api/emails/messages` - Mevcut e-posta adresine gelen mesajları listeler
- `GET /api/emails/messages/:id` - Belirli bir mesajın detaylarını getirir

## 🔒 Güvenlik

- E-posta içerikleri iframe sandbox içinde görüntülenir
- Tüm veriler tarayıcıda tutulur ve oturum kapatıldığında silinir
- Hiçbir hassas veri sunucu tarafında saklanmaz

## 📱 Duyarlı Tasarım

Uygulama, tüm cihazlarda (masaüstü, tablet, mobil) sorunsuz çalışacak şekilde tasarlanmıştır.

## 🙏 Teşekkürler

Projede kullanılan API'yi sağlayan geliştiricilere teşekkür ederiz.

## 📄 Lisans

Bu proje açık kaynaklıdır ve MIT lisansı altında dağıtılmaktadır. 