/**
 * API service for interacting with the NekoNoTemp email API
 */
const API = {
  baseUrl: 'https://nekoniiis-mail-v1-api.vercel.app/api',
  debug: true, // Debug modunu açık tut
  
  /**
   * API yanıtını konsola loglar ve döndürür
   * @param {string} operation - İşlem adı
   * @param {*} data - API'dan dönen yanıt
   * @returns {*} - Aynı data objesi
   */
  _logResponse(operation, data) {
    if (this.debug) {
      console.group(`API Response (${operation})`);
      
      if (typeof data === 'object' && data !== null) {
        // Detaylı veri yapısını göster
        console.log('Data type:', Array.isArray(data) ? 'Array' : 'Object');
        console.log('Structure:', this._getDataStructure(data));
        
        // Bazı örnek içerik göster
        if (Array.isArray(data) && data.length > 0) {
          console.log('First item sample:', this._truncateObject(data[0]));
        } else if (!Array.isArray(data)) {
          console.log('Content sample:', this._truncateObject(data));
        }
      } else {
        console.log('Data:', data);
      }
      
      console.groupEnd();
    }
    return data;
  },
  
  /**
   * Nesneyi kısaltır ve uzun alanları keser
   * @param {Object} obj - Kısaltılacak nesne
   * @returns {Object} - Kısaltılmış kopya
   */
  _truncateObject(obj, depth = 0, maxDepth = 2) {
    if (depth > maxDepth) return "[Nested Object]";
    
    if (Array.isArray(obj)) {
      if (obj.length <= 3) {
        return obj.map(item => 
          typeof item === 'object' && item !== null 
            ? this._truncateObject(item, depth + 1, maxDepth) 
            : this._truncateValue(item));
      }
      return [
        this._truncateObject(obj[0], depth + 1, maxDepth),
        "...",
        this._truncateObject(obj[obj.length - 1], depth + 1, maxDepth)
      ];
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const result = {};
      const keys = Object.keys(obj);
      
      for (const key of keys) {
        const value = obj[key];
        result[key] = typeof value === 'object' && value !== null
          ? this._truncateObject(value, depth + 1, maxDepth)
          : this._truncateValue(value);
      }
      
      return result;
    }
    
    return this._truncateValue(obj);
  },
  
  /**
   * Uzun değerleri keser
   * @param {*} value - Kırpılacak değer
   * @returns {*} - Kırpılmış değer
   */
  _truncateValue(value) {
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return value;
  },
  
  /**
   * Veri yapısını çıkarır
   * @param {*} data - Yapısı çıkarılacak veri
   * @returns {Object} - Veri yapısı tanımı
   */
  _getDataStructure(data) {
    if (Array.isArray(data)) {
      return {
        type: 'array',
        length: data.length,
        sample: data.length > 0 ? this._getDataStructure(data[0]) : null
      };
    } 
    
    if (typeof data === 'object' && data !== null) {
      const structure = {};
      const keys = Object.keys(data);
      
      for (const key of keys) {
        const value = data[key];
        if (value === null) {
          structure[key] = 'null';
        } else if (Array.isArray(value)) {
          structure[key] = `array[${value.length}]`;
        } else if (typeof value === 'object') {
          structure[key] = 'object';
        } else {
          structure[key] = typeof value;
        }
      }
      
      return structure;
    }
    
    return typeof data;
  },
  
  /**
   * Fetch available domains for creating temporary emails
   * @returns {Promise<Array>} - Array of available domains
   */
  async fetchDomains() {
    try {
      const response = await fetch(`${this.baseUrl}/emails/domains`);
      
      if (!response.ok) {
        throw new Error(`Domain fetch failed: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        return data.data.map(item => item.domain);
      }
      return [];
    } catch (error) {
      console.error('Error fetching domains:', error);
      throw error;
    }
  },
  
  /**
   * Create a new temporary email address
   * @returns {Promise<Object>} - The created email info including address and token
   */
  async createTemporaryEmail() {
    try {
      const response = await fetch(`${this.baseUrl}/emails/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // API domain seçimi olmadan rastgele e-posta oluşturacak
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error(`Email creation failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // API yanıt formatına göre düzenleme
      if (data.data) {
        return this._logResponse('createEmail', {
          email: data.data.email,
          token: data.data.token,
          password: data.data.password
        });
      }
      
      return this._logResponse('createEmail', data);
    } catch (error) {
      console.error('Error creating email:', error);
      throw error;
    }
  },
  
  /**
   * Fetch messages for the current email address
   * @param {string} token - Authentication token from createEmail response
   * @returns {Promise<Array>} - Array of message objects
   */
  async fetchMessages(token) {
    if (!token) {
      console.warn('No token provided for fetchMessages');
      return [];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout

      console.log('Fetching messages with token:', token.substring(0, 10) + '...');
      
      const response = await fetch(`${this.baseUrl}/emails/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Messages response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('Token is invalid or expired');
          return [];
        }
        throw new Error(`Messages fetch failed: ${response.status}`);
      }
      
      // Response içeriğini kontrol amacıyla önce raw text olarak alalım
      const rawText = await response.text();
      console.log('Raw API response:', rawText.substring(0, 150) + '...');
      
      // Sonra JSON'a çevirelim
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (jsonError) {
        console.error('Failed to parse messages response as JSON:', jsonError);
        return [];
      }
      
      console.log('Parsed API response:', data);
      
      // API yanıt formatını kontrol et
      if (data.data && Array.isArray(data.data)) {
        console.log(`Found ${data.data.length} messages in data.data`);
        return this._logResponse('fetchMessages', data.data);
      } else if (data.messages && Array.isArray(data.messages)) {
        console.log(`Found ${data.messages.length} messages in data.messages`);
        return this._logResponse('fetchMessages', data.messages);
      } else if (Array.isArray(data)) {
        console.log(`Found ${data.length} messages in direct array`);
        return this._logResponse('fetchMessages', data);
      }
      
      console.warn('No messages found in response, returning empty array');
      return [];
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Messages fetch timed out');
        return [];
      }
      console.error('Error fetching messages:', error);
      return []; // Hata durumunda boş dizi döndür
    }
  },
  
  /**
   * Fetch details of a specific message
   * @param {string} messageId - ID of the message to fetch
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} - Detailed message object
   */
  async fetchMessageDetails(messageId, token) {
    if (!token || !messageId) {
      console.warn('No token or messageId provided for fetchMessageDetails');
      return {};
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout

      console.log(`Fetching message details for ID ${messageId}`);
      
      const response = await fetch(`${this.baseUrl}/emails/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Message details response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('Token is invalid or expired');
          return {};
        }
        throw new Error(`Message details fetch failed: ${response.status}`);
      }
      
      // Response içeriğini kontrol amacıyla önce raw text olarak alalım
      const rawText = await response.text();
      console.log('Raw message details:', rawText.substring(0, 150) + '...');
      
      // Sonra JSON'a çevirelim
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (jsonError) {
        console.error('Failed to parse message details as JSON:', jsonError);
        return {};
      }
      
      console.log('Parsed message details response:', data);
      
      // API yanıt formatını kontrol et
      if (data.data) {
        console.log('Found message details in data.data');
        return this._logResponse('fetchMessageDetails', data.data);
      } else if (data.message) {
        console.log('Found message details in data.message');
        return this._logResponse('fetchMessageDetails', data.message);
      } else if (data.id || data.body || data.html || data.content) {
        console.log('Found message details in direct object');
        return this._logResponse('fetchMessageDetails', data);
      }
      
      console.warn('No message details found in response, returning empty object');
      return {};
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Message details fetch timed out');
        return {};
      }
      console.error(`Error fetching message details for ID ${messageId}:`, error);
      return {}; // Hata durumunda boş nesne döndür
    }
  }
}; 