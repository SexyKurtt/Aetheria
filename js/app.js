/**
 * Main application controller for NekoNoTemp
 */
const APP = {
  // Application state
  state: {
    currentEmail: null,
    sessionToken: null,
    password: null,
    inboxMessages: [],
    selectedMessage: null,
    refreshInterval: null,
    isLoading: false,
    pollingInterval: 10000, // 10 seconds
  },
  
  /**
   * Initialize the application
   */
  async init() {
    try {
      // Initialize UI components
      UI.init();
      
      // Setup event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error('Initialization error:', error);
      UI.showCelestialToast('Uygulama başlatılırken bir hata oluştu', 'error');
    }
  },
  
  /**
   * Set up application event listeners
   */
  setupEventListeners() {
    // Create email button
    UI.elements.createEmailBtn.addEventListener('click', this.handleCreateEmail.bind(this));
    
    // Refresh button
    UI.elements.refreshBtn.addEventListener('click', this.refreshMessages.bind(this));
  },
  
  /**
   * Handle email creation button click
   */
  async handleCreateEmail() {
    // Stop any existing polling
    this.stopPolling();
    
    try {
      UI.showCelestialToast('Geçici e-posta oluşturuluyor...');
      UI.showLoader();
      
      // Create the email
      const result = await API.createTemporaryEmail();
      
      // Update state
      this.state.currentEmail = result.email;
      this.state.sessionToken = result.token;
      this.state.password = result.password;
      this.state.inboxMessages = [];
      
      // Update UI
      UI.hideLoader();
      UI.showEmailAddress(result.email, result.password);
      UI.showCelestialToast(`${result.email} adresi oluşturuldu`, 'success');
      
      // Start polling for messages
      this.startPolling();
    } catch (error) {
      UI.hideLoader();
      console.error('Error creating email:', error);
      UI.showCelestialToast('E-posta oluşturulurken bir hata oluştu', 'error');
    }
  },
  
  /**
   * Start polling for new messages
   */
  startPolling() {
    // Initial fetch
    this.refreshMessages();
    
    // Set up polling interval
    this.state.refreshInterval = setInterval(() => {
      this.refreshMessages(false); // silent refresh (no UI indicator)
    }, this.state.pollingInterval);
  },
  
  /**
   * Stop polling for new messages
   */
  stopPolling() {
    if (this.state.refreshInterval) {
      clearInterval(this.state.refreshInterval);
      this.state.refreshInterval = null;
    }
  },
  
  /**
   * Refresh messages from API
   * @param {boolean} showLoader - Whether to show loading UI
   */
  async refreshMessages(showLoader = true) {
    // Only proceed if we have a token
    if (!this.state.sessionToken) {
      return;
    }
    
    // Prevent multiple concurrent refreshes
    if (this.state.isLoading) {
      return;
    }
    
    this.state.isLoading = true;
    
    try {
      if (showLoader) {
        UI.showLoader();
      }
      
      // API, artık iç tarafında hataları yönetiyor
      const messages = await API.fetchMessages(this.state.sessionToken);
      
      // Eğer mesaj listesi boşsa ve token süresi doldu mesajları kontrol et
      if (messages.length === 0 && this.state.inboxMessages.length > 0) {
        // Token geçerliliğini kontrol et - eğer sıfırlanması gerekiyorsa
        try {
          // Basit bir token kontrolü
          const testResponse = await fetch(`${API.baseUrl}/emails/messages`, {
            headers: { 'Authorization': `Bearer ${this.state.sessionToken}` }
          });
          
          if (testResponse.status === 401 || testResponse.status === 403) {
            throw new Error('Token süresi doldu');
          }
        } catch (tokenError) {
          // Token geçersizse kullanıcıya bildir ve uygulamayı sıfırla
          UI.showCelestialToast('Oturum süresi doldu. Lütfen yeni bir adres oluşturun.', 'error');
          this.stopPolling();
          UI.resetUI();
          this.state.currentEmail = null;
          this.state.sessionToken = null;
          this.state.isLoading = false;
          
          if (showLoader) {
            UI.hideLoader();
          }
          return;
        }
      }
      
      // Sort messages by date (newest first)
      messages.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
      
      this.state.inboxMessages = messages;
      UI.displayMessages(messages);
    } catch (error) {
      console.error('Error refreshing messages:', error);
      // Hatayı göster ama uygulamayı bozmadan devam et
      if (showLoader) {
        UI.showCelestialToast('Mesajlar yüklenirken bir hata oluştu, yeniden denenecek.', 'error');
      }
    } finally {
      this.state.isLoading = false;
      if (showLoader) {
        UI.hideLoader();
      }
    }
  },
  
  /**
   * Load message details by ID
   * @param {string} messageId - ID of the message to load
   */
  async loadMessageDetails(messageId) {
    if (!this.state.sessionToken || !messageId) {
      console.warn('Unable to load message - missing token or messageId');
      return;
    }
    
    try {
      UI.showLoader();
      console.log(`Loading details for message ID: ${messageId}`);
      
      // Önce mevcut mesajlar içinde bu ID'ye sahip mesajı kontrol edelim
      const existingMessage = this.state.inboxMessages.find(m => m.id === messageId);
      if (!existingMessage) {
        console.warn(`Message with ID ${messageId} not found in inbox`);
        UI.showCelestialToast('Mesaj bulunamadı', 'error');
        UI.hideLoader();
        return;
      }
      
      // API, artık iç tarafında hataları yönetiyor
      const messageDetails = await API.fetchMessageDetails(messageId, this.state.sessionToken);
      
      // Mesaj detaylarında veri varsa göster
      if (messageDetails && (messageDetails.id || messageDetails.body !== undefined)) {
        console.log('Message details loaded successfully');
        
        // Eğer mesaj içeriği yoksa ama listedeki mesajımız var, onu kullanabiliriz
        if ((!messageDetails.body && !messageDetails.html && !messageDetails.text && !messageDetails.content) && existingMessage) {
          console.log('Merging message details with existing message data');
          // Mevcut mesaj verilerini detaylarla birleştir
          Object.assign(messageDetails, existingMessage);
        }
        
        this.state.selectedMessage = messageDetails;
        UI.displayMessageDetails(messageDetails);
        
        // Mark message as read in our local state (if API doesn't handle this)
        const messageIndex = this.state.inboxMessages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          this.state.inboxMessages[messageIndex].isRead = true;
        }
      } else {
        console.warn('Message details are empty or invalid', messageDetails);
        
        // Eğer API detay döndürmediyse, liste ekranından elimizde olan mesajı gösterelim
        if (existingMessage) {
          console.log('Using existing message from inbox as fallback');
          this.state.selectedMessage = existingMessage;
          UI.displayMessageDetails(existingMessage);
          
          // Mark message as read in our local state
          const messageIndex = this.state.inboxMessages.findIndex(m => m.id === messageId);
          if (messageIndex !== -1) {
            this.state.inboxMessages[messageIndex].isRead = true;
          }
        } else {
          UI.showCelestialToast('Mesaj detayları bulunamadı', 'error');
        }
      }
    } catch (error) {
      console.error(`Error loading message details for ID ${messageId}:`, error);
      UI.showCelestialToast('Mesaj detayları yüklenirken bir hata oluştu', 'error');
    } finally {
      UI.hideLoader();
    }
  }
};

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  APP.init();
}); 