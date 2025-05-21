/**
 * UI handling for the Aetheria application
 * Ethereal interface with celestial animations
 */
const UI = {
  // DOM element references
  elements: {
    createEmailBtn: document.getElementById('createEmailBtn'),
    emailDisplay: document.getElementById('emailDisplay'),
    emailAddress: document.getElementById('emailAddress'),
    emailPassword: document.getElementById('emailPassword'),
    copyEmailBtn: document.getElementById('copyEmailBtn'),
    copyPasswordBtn: document.getElementById('copyPasswordBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    inboxStatus: document.getElementById('inboxStatus'),
    emptyInbox: document.getElementById('emptyInbox'),
    loader: document.getElementById('loader'),
    messageList: document.getElementById('messageList'),
    messageDetail: document.getElementById('messageDetail'),
    detailSubject: document.getElementById('detailSubject'),
    detailFrom: document.getElementById('detailFrom'),
    detailTo: document.getElementById('detailTo'),
    detailDate: document.getElementById('detailDate'),
    messageIframe: document.getElementById('messageIframe'),
    closeDetailBtn: document.getElementById('closeDetailBtn'),
    toast: document.getElementById('toast'),
    toastContent: document.getElementById('toastContent')
  },
  
  /**
   * Initialize UI event listeners and setup animations
   */
  init() {
    // Close message detail on overlay or close button click
    this.elements.closeDetailBtn.addEventListener('click', this.hideMessageDetail.bind(this));
    this.elements.messageDetail.querySelector('.message-detail__overlay')
      .addEventListener('click', this.hideMessageDetail.bind(this));
      
    // Copy email address to clipboard
    this.elements.copyEmailBtn.addEventListener('click', this.copyEmailToClipboard.bind(this));
    
    // Copy password to clipboard
    if (this.elements.copyPasswordBtn) {
      this.elements.copyPasswordBtn.addEventListener('click', this.copyPasswordToClipboard.bind(this));
    }
    
    // Setup celestial UI animations
    this.setupCelestialAnimations();
    
    // Setup dark mode support (though the app is dark by default)
    this.setupDarkModeSupport();
    
    // Add interactive parallax effects
    this.setupParallaxEffects();
    
    // Initialize particles for the stars background (optional)
    this.initStarParticles();
    
    // Set up ripple effect for buttons
    this.setupRippleEffect();
  },
  
  /**
   * Setup all celestial animations and effects
   */
  setupCelestialAnimations() {
    // Button hover effects with ethereal glow
    const addCelestialButtonEffects = (btn) => {
      if (!btn) return;
      
      // Add mouse movement reactive glow
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update the position of the glow
        if (btn.querySelector('.btn-glow')) {
          const glow = btn.querySelector('.btn-glow');
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(126, 108, 245, 0.4), rgba(0, 0, 0, 0) 70%)`;
          glow.style.opacity = '1';
        }
      });
      
      // Reset the glow on mouse leave
      btn.addEventListener('mouseleave', () => {
        if (btn.querySelector('.btn-glow')) {
          const glow = btn.querySelector('.btn-glow');
          glow.style.opacity = '0';
        }
      });
    };
    
    // Apply effects to stellar and crystalline buttons
    document.querySelectorAll('.btn--stellar, .btn--crystalline').forEach(addCelestialButtonEffects);
    
    // Add animation to message items on scroll
    this.animateMessageItemsOnScroll();
    
    // Add random star twinkling
    this.addRandomStarTwinkling();
    
    // Add logo hover animation
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
      logoContainer.addEventListener('mouseover', () => {
        document.querySelector('.logo-planet').style.animationDuration = '4s';
        document.querySelector('.logo-ring').style.animationDuration = '8s';
      });
      
      logoContainer.addEventListener('mouseleave', () => {
        document.querySelector('.logo-planet').style.animationDuration = '8s';
        document.querySelector('.logo-ring').style.animationDuration = '15s';
      });
    }
  },
  
  /**
   * Setup ripple effect for buttons
   */
  setupRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .crystal-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.top = `${y}px`;
        ripple.style.left = `${x}px`;
        
        // Add custom styles for the ripple
        ripple.style.position = 'absolute';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        button.appendChild(ripple);
        
        // Trigger the animation
        setTimeout(() => {
          ripple.style.width = '200px';
          ripple.style.height = '200px';
          ripple.style.opacity = '0';
        }, 10);
        
        // Clean up the ripple element
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  },
  
  /**
   * Add random twinkling to the star elements
   */
  addRandomStarTwinkling() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      // Set random animation duration between 2-5s
      const duration = 2 + Math.random() * 3;
      star.style.animationDuration = `${duration}s`;
      
      // Set random animation delay
      const delay = Math.random() * 5;
      star.style.animationDelay = `${delay}s`;
    });
  },
  
  /**
   * Setup parallax effects for celestial elements
   */
  setupParallaxEffects() {
    const nebula = document.querySelector('.nebula-bg');
    const constellation = document.querySelector('.constellation');
    
    if (nebula && constellation) {
      document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Subtle parallax effect for background elements
        nebula.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
        constellation.style.transform = `translate(${x * -5}px, ${y * -5}px)`;
      });
    }
  },
  
  /**
   * Initialize star particles for background
   */
  initStarParticles() {
    // Check if stars container exists
    const starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) return;
    
    // Create additional dynamic stars (beyond the static ones in HTML)
    for (let i = 0; i < 20; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random position
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      
      // Random size (1-3px)
      const size = 1 + Math.random() * 2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random animation duration and delay
      star.style.animationDuration = `${2 + Math.random() * 3}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      starsContainer.appendChild(star);
    }
  },
  
  /**
   * Animate message items when they come into view
   */
  animateMessageItemsOnScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('message-item--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    // Function to observe new message items
    const observeNewMessages = () => {
      document.querySelectorAll('.message-item:not(.message-item--visible)').forEach(item => {
        observer.observe(item);
      });
    };
    
    // Watch for new messages being added to the list
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          observeNewMessages();
        }
      });
    });
    
    mutationObserver.observe(this.elements.messageList, { childList: true });
    
    // Initial observation
    observeNewMessages();
  },
  
  /**
   * Setup dark mode support (app is already dark by default)
   */
  setupDarkModeSupport() {
    // The app uses a dark theme by default, so this is more about respecting user preferences
    // for any light mode elements or iframe content
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
      document.documentElement.classList.add('prefer-dark');
    } else {
      document.documentElement.classList.add('prefer-light');
    }
    
    // Listen for changes to color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches) {
        document.documentElement.classList.remove('prefer-light');
        document.documentElement.classList.add('prefer-dark');
      } else {
        document.documentElement.classList.remove('prefer-dark');
        document.documentElement.classList.add('prefer-light');
      }
    });
  },
  
  /**
   * Show the created email address and password with animation
   * @param {string} email - Email address
   * @param {string} password - Email password
   */
  showEmailAddress(email, password) {
    // Hide placeholder, show content
    this.elements.emailDisplay.querySelector('.email-display__placeholder').style.display = 'none';
    this.elements.emailDisplay.querySelector('.email-display__content').style.display = 'flex';
    
    // Celestial typing effect for email address
    this.elements.emailAddress.textContent = '';
    this.celestialTypingEffect(this.elements.emailAddress, email, 30);
    
    // Show password with a slight delay after email
    if (this.elements.emailPassword) {
      this.elements.emailPassword.textContent = '';
      setTimeout(() => {
        this.celestialTypingEffect(this.elements.emailPassword, password || '-', 40);
      }, 800);
    }
    
    // Update inbox status with cosmic wording
    this.elements.inboxStatus.textContent = 'Astral mesajlar bekleniyor...';
    
    // Show empty inbox with animation
    this.showEmptyInbox();
    
    // Update button text with refresh icon
    this.elements.createEmailBtn.innerHTML = `
      <span class="btn-content">
        <svg class="btn-icon" viewBox="0 0 24 24" width="18" height="18">
          <path class="icon-path" d="M17.65,6.35C16.2,4.9,14.21,4,12,4c-4.42,0-7.99,3.58-7.99,8s3.57,8,7.99,8c3.73,0,6.84-2.55,7.73-6h-2.08 c-0.82,2.33-3.04,4-5.65,4c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.66,0,3.14,0.69,4.22,1.78L13,10h7V3L17.65,6.35z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span class="btn-text">Yeni Adres Yarat</span>
      </span>
      <span class="btn-glow"></span>
    `;
    
    // Add celestial pulse animation to the email display
    this.elements.emailDisplay.classList.add('card-pulse');
    setTimeout(() => {
      this.elements.emailDisplay.classList.remove('card-pulse');
    }, 1000);
    
    // Add subtle particle effect (optional)
    this.addSuccessParticles();
  },
  
  /**
   * Enhanced typing effect with a celestial glow
   * @param {HTMLElement} element - Element to type text into
   * @param {string} text - Text to type
   * @param {number} speed - Typing speed in ms
   */
  celestialTypingEffect(element, text, speed = 50) {
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        
        // Add subtle glow flash effect on each character type
        element.parentElement.classList.add('typing-flash');
        setTimeout(() => {
          element.parentElement.classList.remove('typing-flash');
        }, 50);
        
        i++;
      } else {
        clearInterval(typing);
        // Completion flash
        element.parentElement.classList.add('typing-complete');
        setTimeout(() => {
          element.parentElement.classList.remove('typing-complete');
        }, 300);
      }
    }, speed);
  },
  
  /**
   * Add celebration particles when email is created
   */
  addSuccessParticles() {
    const card = this.elements.emailDisplay;
    const rect = card.getBoundingClientRect();
    
    // Create a container for the particles
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'absolute';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.overflow = 'hidden';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '10';
    
    card.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      
      // Styling
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 8 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      
      // Random colors from the celestial palette
      const colors = ['#7e6cf5', '#c280d2', '#db9dc6', '#5b73e8'];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = Math.random() * 0.6 + 0.4;
      
      // Random starting position (centered around the middle of the card)
      particle.style.top = '50%';
      particle.style.left = '50%';
      
      // Add to container
      particleContainer.appendChild(particle);
      
      // Animate with JS for more control
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 50;
      const duration = Math.random() * 1000 + 1000;
      
      // Starting time
      const start = performance.now();
      
      // Animation function
      function animateParticle(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth movement
        const easing = 1 - Math.pow(1 - progress, 3); // Cubic out easing
        
        // Calculate position
        const x = distance * Math.cos(angle) * easing;
        const y = distance * Math.sin(angle) * easing;
        
        // Update position
        particle.style.transform = `translate(${x}px, ${y}px) scale(${1 - easing})`;
        
        // Continue animation or remove particle
        if (progress < 1) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
          
          // Remove container when all particles are done
          if (particleContainer.children.length === 0) {
            particleContainer.remove();
          }
        }
      }
      
      // Start animation with a slight delay for each particle
      setTimeout(() => {
        requestAnimationFrame(animateParticle);
      }, Math.random() * 200);
    }
  },
  
  /**
   * Display the empty inbox state with animation
   */
  showEmptyInbox() {
    this.elements.messageList.innerHTML = '';
    this.elements.emptyInbox.style.display = 'flex';
    this.elements.messageList.style.display = 'none';
    
    // Animate the empty state with a fade-in effect
    this.elements.emptyInbox.classList.add('animate-in');
    
    // Animate the orbit and planet elements
    const emptyOrbit = document.querySelector('.empty-orbit');
    const emptyPlanet = document.querySelector('.empty-planet');
    const emptyEnvelope = document.querySelector('.empty-envelope');
    
    if (emptyOrbit && emptyPlanet && emptyEnvelope) {
      // Speed up animations briefly when shown
      emptyOrbit.style.animationDuration = '10s';
      emptyPlanet.style.animationDuration = '4s';
      
      // Reset to normal speed after a few seconds
      setTimeout(() => {
        emptyOrbit.style.animationDuration = '20s';
        emptyPlanet.style.animationDuration = '8s';
      }, 3000);
    }
    
    // Remove the animation class after it completes
    setTimeout(() => {
      this.elements.emptyInbox.classList.remove('animate-in');
    }, 1000);
  },
  
  /**
   * Start loading animation with celestial theme
   */
  showLoader() {
    this.elements.loader.classList.add('active');
    this.elements.emptyInbox.style.display = 'none';
    this.elements.messageList.style.display = 'none';
    
    // Add spinning animation to refresh icon
    const refreshIcon = this.elements.refreshBtn.querySelector('.refresh-icon');
    if (refreshIcon) {
      refreshIcon.style.animation = 'orbit-spin 1s linear infinite';
    }
    
    // Enhance loader with acceleration
    const loaderOrbit = document.querySelector('.loader-orbit');
    const loaderPlanet = document.querySelector('.loader-planet');
    
    if (loaderOrbit && loaderPlanet) {
      loaderOrbit.style.animationDuration = '1.2s';
      setTimeout(() => {
        // Accelerate loading animation
        loaderOrbit.style.animationDuration = '0.8s';
      }, 1000);
    }
  },
  
  /**
   * Stop loading animation
   */
  hideLoader() {
    this.elements.loader.classList.remove('active');
    
    // Reset refresh icon animation
    const refreshIcon = this.elements.refreshBtn.querySelector('.refresh-icon');
    if (refreshIcon) {
      refreshIcon.style.animation = '';
    }
    
    // Reset loader animation speeds
    const loaderOrbit = document.querySelector('.loader-orbit');
    if (loaderOrbit) {
      loaderOrbit.style.animationDuration = '2s';
    }
  },
  
  /**
   * Display messages in the inbox with staggered animations
   * @param {Array} messages - List of message objects
   */
  displayMessages(messages) {
    this.hideLoader();
    
    if (messages.length === 0) {
      this.showEmptyInbox();
      return;
    }
    
    this.elements.emptyInbox.style.display = 'none';
    this.elements.messageList.style.display = 'block';
    this.elements.messageList.innerHTML = '';
    
    // Create message items with a staggered delay
    messages.forEach((message, index) => {
      setTimeout(() => {
        const messageItem = document.createElement('li');
        messageItem.className = 'message-item';
        if (message.isRead === false) {
          messageItem.classList.add('unread');
        }
        messageItem.dataset.id = message.id;
        
        // Handle different API response formats
        const messageDate = message.date || message.created_at || new Date().toISOString();
        const formattedDate = this.formatDate(new Date(messageDate));
        
        const sender = message.sender || message.from || message.sender_email || 'Gizemli Gönderici';
        
        messageItem.innerHTML = `
          <div class="message-item__content">
            <div class="message-item__sender">${this.safeText(sender)}</div>
            <div class="message-item__subject">${this.safeText(message.subject || '(Konu yok)')}</div>
            <div class="message-item__date">${formattedDate}</div>
          </div>
        `;
        
        messageItem.addEventListener('click', () => {
          APP.loadMessageDetails(message.id);
        });
        
        this.elements.messageList.appendChild(messageItem);
        
        // Slight delay before adding the visibility class for animation
        setTimeout(() => {
          messageItem.classList.add('message-item--visible');
        }, 50);
      }, index * 100); // Staggered 100ms delay per item
    });
    
    // Update status with cosmic wording
    this.elements.inboxStatus.textContent = `${messages.length} kozmik mesaj alındı`;
    
    // Add count badge with animation
    if (messages.length > 0) {
      this.showMessageCountBadge(messages.length);
    }
  },
  
  /**
   * Display a cosmic badge with message count
   * @param {number} count - Number of messages
   */
  showMessageCountBadge(count) {
    const existingBadge = document.querySelector('.message-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    const badge = document.createElement('span');
    badge.className = 'message-badge';
    badge.textContent = count;
    
    // Add glow intensity based on count
    if (count > 5) {
      badge.classList.add('message-badge--important');
    }
    
    this.elements.inboxStatus.appendChild(badge);
    
    // Animate the badge
    setTimeout(() => {
      badge.classList.add('message-badge--visible');
    }, 100);
    
    // Optional: Remove after 10 seconds
    setTimeout(() => {
      badge.classList.remove('message-badge--visible');
      setTimeout(() => badge.remove(), 300);
    }, 10000);
  },
  
  /**
   * Display message details in the modal with enhanced styling
   * @param {Object} message - Message object with details
   */
  displayMessageDetails(message) {
    console.log('Displaying celestial message details:', message);
    
    // Handle various API response formats
    const subject = message.subject || message.title || '(Konu yok)';
    const sender = message.sender || message.from || message.sender_email || 'Gizemli Gönderici';
    const recipient = message.recipient || message.to || message.recipient_email || APP.state.currentEmail;
    const messageDate = message.date || message.created_at || new Date().toISOString();
    
    // Find message content from various possible formats
    let body = '';
    
    // Debug for content fields
    console.log('Message content fields:',
      message.body ? 'body: exists' : 'body: missing',
      message.html ? 'html: exists' : 'html: missing',
      message.text ? 'text: exists' : 'text: missing',
      message.content ? 'content: exists' : 'content: missing'
    );
    
    // Extract content
    if (typeof message.body === 'string') {
      body = message.body;
    } else if (message.html) {
      body = message.html;
    } else if (message.text) {
      body = message.text;
    } else if (message.content) {
      if (typeof message.content === 'string') {
        body = message.content;
      } else if (message.content.html) {
        body = message.content.html;
      } else if (message.content.text) {
        body = message.content.text;
      }
    } else if (message.body === null || message.body === undefined) {
      // Empty content message
      body = `
        <div style="text-align: center; padding: 60px 30px; color: #b8b2d8; font-family: 'Inter', sans-serif;">
          <svg width="60" height="60" viewBox="0 0 24 24" style="margin-bottom: 20px; opacity: 0.6;">
            <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5l-8-5V6l8,5l8-5V8z" 
                  fill="#b8b2d8"/>
          </svg>
          <p style="font-size: 18px; margin-bottom: 10px;">Boş Mesaj</p>
          <p>Bu e-postanın içeriği görüntülenemiyor veya boş.</p>
        </div>
      `;
    }
    
    // Fallback: show message as JSON
    if (!body) {
      body = `<pre style="white-space: pre-wrap; word-break: break-word; font-family: monospace; padding: 20px; color: #b8b2d8;">${this.safeText(JSON.stringify(message, null, 2))}</pre>`;
    }
    
    // Set modal content
    this.elements.detailSubject.textContent = subject;
    this.elements.detailFrom.textContent = sender;
    this.elements.detailTo.textContent = recipient;
    this.elements.detailDate.textContent = this.formatDate(new Date(messageDate));
    
    console.log('Rendering message body with length:', body.length);
    
    // Set iframe content with celestial styling
    const iframe = this.elements.messageIframe;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Celestial message styling */
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;500&display=swap');
            
            :root {
              --primary-dark: #171528;
              --primary-color: #7e6cf5;
              --primary-light: #9f91f8;
              --secondary-color: #c280d2;
              --accent-color: #db9dc6;
              --background-darkest: #0c0b1c;
              --background-dark: #171528;
              --background-medium: #201c35;
              --text-lightest: #ffffff;
              --text-light: #e8e4f6;
              --text-medium: #b8b2d8;
            }
            
            body {
              font-family: 'Inter', Arial, sans-serif;
              line-height: 1.6;
              color: var(--text-light);
              background-color: var(--background-medium);
              padding: 20px;
              margin: 0;
              max-width: 100%;
              word-break: break-word;
              transition: all 0.3s ease;
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Cinzel', serif;
              color: var(--text-lightest);
              margin-top: 1.5em;
              margin-bottom: 0.75em;
            }
            
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              transition: transform 0.3s ease;
              border: 1px solid rgba(126, 108, 245, 0.2);
            }
            
            img:hover {
              transform: scale(1.02);
              box-shadow: 0 0 15px rgba(126, 108, 245, 0.3);
            }
            
            a {
              color: var(--primary-light);
              text-decoration: none;
              border-bottom: 1px solid transparent;
              transition: all 0.3s ease;
              position: relative;
            }
            
            a:hover {
              color: var(--accent-color);
              border-color: var(--accent-color);
            }
            
            a:hover::before {
              content: '';
              position: absolute;
              bottom: -3px;
              left: 0;
              width: 100%;
              height: 2px;
              background: linear-gradient(to right, var(--primary-color), var(--accent-color));
              border-radius: 2px;
            }
            
            pre {
              background: rgba(12, 11, 28, 0.5);
              padding: 15px;
              border-radius: 8px;
              overflow: auto;
              border: 1px solid rgba(126, 108, 245, 0.2);
              font-family: monospace;
            }
            
            code {
              background: rgba(12, 11, 28, 0.3);
              padding: 2px 6px;
              border-radius: 4px;
              font-family: monospace;
              color: var(--primary-light);
            }
            
            blockquote {
              border-left: 3px solid var(--secondary-color);
              margin-left: 0;
              padding: 10px 0 10px 20px;
              color: var(--text-medium);
              font-style: italic;
              position: relative;
            }
            
            blockquote::before {
              content: '❝';
              position: absolute;
              top: -10px;
              left: -15px;
              font-size: 30px;
              color: var(--secondary-color);
              opacity: 0.5;
            }
            
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 25px 0;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            
            th, td {
              padding: 12px 15px;
              text-align: left;
              border-bottom: 1px solid rgba(126, 108, 245, 0.2);
            }
            
            th {
              background-color: rgba(126, 108, 245, 0.1);
              color: var(--text-lightest);
              font-weight: 600;
            }
            
            tr {
              transition: background-color 0.3s ease;
            }
            
            tr:nth-child(even) {
              background-color: rgba(12, 11, 28, 0.2);
            }
            
            tr:hover {
              background-color: rgba(126, 108, 245, 0.1);
            }
            
            /* Celestial animation */
            .star {
              position: fixed;
              width: 2px;
              height: 2px;
              border-radius: 50%;
              background-color: var(--text-lightest);
              opacity: 0.6;
              pointer-events: none;
              z-index: -1;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            body {
              animation: fadeIn 0.5s ease;
            }
            
            /* Light theme support */
            @media (prefers-color-scheme: light) {
              body.prefer-light {
                background-color: #f8f5ff;
                color: #333;
              }
              
              body.prefer-light h1, body.prefer-light h2, 
              body.prefer-light h3, body.prefer-light h4,
              body.prefer-light h5, body.prefer-light h6 {
                color: #171528;
              }
              
              body.prefer-light a {
                color: #7e6cf5;
              }
              
              body.prefer-light a:hover {
                color: #c280d2;
              }
              
              body.prefer-light pre {
                background: #f0ecff;
              }
              
              body.prefer-light code {
                background: #e8e4ff;
                color: #3f1dcb;
              }
              
              body.prefer-light blockquote {
                color: #666;
              }
              
              body.prefer-light th {
                background-color: #e8e4ff;
                color: #171528;
              }
              
              body.prefer-light tr:nth-child(even) {
                background-color: #f0ecff;
              }
            }
          </style>
        </head>
        <body class="${document.documentElement.classList.contains('prefer-light') ? 'prefer-light' : ''}">
          ${body}
          <script>
            // Add some stars in the background
            function createStars() {
              for (let i = 0; i < 15; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.style.top = Math.random() * 100 + '%';
                star.style.left = Math.random() * 100 + '%';
                star.style.opacity = (Math.random() * 0.5) + 0.1;
                document.body.appendChild(star);
              }
            }
            createStars();
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
    
    // Show modal with animation
    this.elements.messageDetail.classList.add('active');
    
    // Subtle background pulse effect
    const messageContent = this.elements.messageDetail.querySelector('.message-detail__content');
    messageContent.classList.add('pulse-in');
    setTimeout(() => {
      messageContent.classList.remove('pulse-in');
    }, 1000);
  },
  
  /**
   * Hide the message detail modal with animation
   */
  hideMessageDetail() {
    const content = this.elements.messageDetail.querySelector('.message-detail__content');
    
    // Add exit animation
    content.classList.add('fade-out');
    
    setTimeout(() => {
      this.elements.messageDetail.classList.remove('active');
      content.classList.remove('fade-out');
      
      // Clear iframe content for memory management
      const iframe = this.elements.messageIframe;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write('');
      iframeDoc.close();
    }, 300);
  },
  
  /**
   * Copy the email address to clipboard with celestial feedback
   */
  async copyEmailToClipboard() {
    const email = this.elements.emailAddress.textContent;
    
    try {
      await navigator.clipboard.writeText(email);
      this.showCelestialToast('Kozmik adresiniz panoya kopyalandı ✨', 'success');
      
      // Enhanced copy animation
      this.animateCopyButton(this.elements.copyEmailBtn);
    } catch (error) {
      console.error('Clipboard write failed:', error);
      this.showCelestialToast('Kopyalama başarısız oldu', 'error');
    }
  },
  
  /**
   * Copy the password to clipboard with celestial feedback
   */
  async copyPasswordToClipboard() {
    if (!this.elements.emailPassword) return;
    
    const password = this.elements.emailPassword.textContent;
    
    try {
      await navigator.clipboard.writeText(password);
      this.showCelestialToast('Astral anahtarınız panoya kopyalandı ✨', 'success');
      
      // Enhanced copy animation
      this.animateCopyButton(this.elements.copyPasswordBtn);
    } catch (error) {
      console.error('Clipboard write failed:', error);
      this.showCelestialToast('Kopyalama başarısız oldu', 'error');
    }
  },
  
  /**
   * Animate copy button with celestial effect
   * @param {HTMLElement} button - Button to animate
   */
  animateCopyButton(button) {
    button.classList.add('copied');
    
    // Add celestial particle burst
    const rect = button.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    
    // Create mini particles
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('span');
      particle.classList.add('copy-particle');
      
      // Random angles for particles
      const angle = (Math.PI * 2 / 6) * i;
      const distance = 20;
      
      // Position and styling
      particle.style.position = 'absolute';
      particle.style.width = '3px';
      particle.style.height = '3px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = 'var(--success-color)';
      particle.style.top = `${y}px`;
      particle.style.left = `${x}px`;
      particle.style.transform = `translate(-50%, -50%)`;
      particle.style.zIndex = '10';
      
      button.appendChild(particle);
      
      // Animate the particle outward
      setTimeout(() => {
        particle.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
        particle.style.top = `${y + Math.sin(angle) * distance}px`;
        particle.style.left = `${x + Math.cos(angle) * distance}px`;
        particle.style.opacity = '0';
      }, 10);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, 500);
    }
    
    // Change icon to checkmark
    const originalIcon = button.innerHTML;
    button.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
        <path d="M9,16.17L4.83,12l-1.42,1.41L9,19L21,7l-1.41-1.41L9,16.17z" fill="currentColor"/>
      </svg>
    `;
    
    // Revert after animation
    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = originalIcon;
    }, 2000);
  },
  
  /**
   * Show enhanced celestial toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success or error)
   */
  showCelestialToast(message, type = '') {
    // Clear any existing toast timeout
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    // Reset classes and add new type
    this.elements.toast.className = 'celestial-toast';
    if (type) {
      this.elements.toast.classList.add(`celestial-toast--${type}`);
    }
    
    // Set icon based on type
    const iconContainer = this.elements.toast.querySelector('.toast-icon-container');
    if (iconContainer) {
      const icon = iconContainer.querySelector('svg');
      if (icon) {
        if (type === 'success') {
          icon.innerHTML = '<path d="M9,16.17L4.83,12l-1.42,1.41L9,19L21,7l-1.41-1.41L9,16.17z" fill="currentColor"/>';
          icon.style.color = 'var(--success-color)';
        } else if (type === 'error') {
          icon.innerHTML = '<path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41z" fill="currentColor"/>';
          icon.style.color = 'var(--error-color)';
        } else {
          icon.innerHTML = '<path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-2h2V17z M13,13h-2V7h2V13z" fill="currentColor"/>';
          icon.style.color = 'var(--primary-light)';
        }
      }
    }
    
    // Set content
    this.elements.toastContent.textContent = message;
    
    // Show toast
    this.elements.toast.classList.add('active');
    
    // Add progress indicator
    let progressBar = this.elements.toast.querySelector('.toast-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'toast-progress';
      progressBar.style.position = 'absolute';
      progressBar.style.bottom = '0';
      progressBar.style.left = '0';
      progressBar.style.height = '3px';
      progressBar.style.width = '100%';
      progressBar.style.backgroundColor = type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--primary-light)';
      progressBar.style.transition = 'width 3s linear';
      this.elements.toast.appendChild(progressBar);
    }
    
    // Animate progress bar
    setTimeout(() => {
      progressBar.style.width = '0%';
    }, 100);
    
    // Auto hide after 3 seconds
    this.toastTimeout = setTimeout(() => {
      this.elements.toast.classList.remove('active');
      
      // Remove progress bar after animation
      setTimeout(() => {
        if (progressBar && progressBar.parentNode) {
          progressBar.remove();
        }
      }, 300);
    }, 3000);
  },
  
  /**
   * Format a date object to a celestial time format
   * @param {Date} date - Date object
   * @returns {string} - Formatted celestial date string
   */
  formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return `${diffSecs} saniye önce`;
    } else if (diffMins < 60) {
      return `${diffMins} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
  },
  
  /**
   * Safely convert potentially unsafe text to safe string
   * @param {string} text - Text to sanitize
   * @returns {string} - Sanitized text
   */
  safeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  /**
   * Reset UI to initial celestial state
   */
  resetUI() {
    this.elements.emailDisplay.querySelector('.email-display__placeholder').style.display = 'block';
    this.elements.emailDisplay.querySelector('.email-display__content').style.display = 'none';
    this.elements.emailAddress.textContent = '-';
    if (this.elements.emailPassword) {
      this.elements.emailPassword.textContent = '-';
    }
    this.elements.inboxStatus.textContent = 'Henüz bir kozmik adres oluşturulmadı';
    this.elements.messageList.innerHTML = '';
    this.elements.emptyInbox.style.display = 'none';
    
    // Update button text with original icon
    this.elements.createEmailBtn.innerHTML = `
      <span class="btn-content">
        <svg class="btn-icon" viewBox="0 0 24 24" width="18" height="18">
          <path class="icon-path" d="M12,2 L12,22 M2,12 L22,12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span class="btn-text">Geçici Adres Oluştur</span>
      </span>
      <span class="btn-glow"></span>
    `;
    
    // Add celestial reset animation
    this.elements.emailDisplay.classList.add('card-reset');
    
    // Subtle particle burst for reset
    this.addResetParticles();
    
    setTimeout(() => {
      this.elements.emailDisplay.classList.remove('card-reset');
    }, 1000);
  },
  
  /**
   * Add particle effect for UI reset
   */
  addResetParticles() {
    const card = this.elements.emailDisplay;
    const rect = card.getBoundingClientRect();
    
    // Create a container for particle burst
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'absolute';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '10';
    
    card.appendChild(particleContainer);
    
    // Create burst particles
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      
      // Styling
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 4 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      
      // Use the secondary color for reset particles
      particle.style.backgroundColor = 'var(--secondary-color)';
      particle.style.opacity = Math.random() * 0.7 + 0.3;
      
      // Random positioning
      particle.style.top = '50%';
      particle.style.left = '50%';
      
      // Add to container
      particleContainer.appendChild(particle);
      
      // Animate outward burst
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 + 20;
      const duration = Math.random() * 800 + 700;
      
      // Start time
      const start = performance.now();
      
      // Animation function
      function animateParticle(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easing = 1 - Math.pow(1 - progress, 2); // Quadratic out
        
        // Position calculation
        const x = distance * Math.cos(angle) * easing;
        const y = distance * Math.sin(angle) * easing;
        
        // Update position and fade out
        particle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${1 - progress * 0.7})`;
        particle.style.opacity = 0.7 * (1 - progress);
        
        // Continue animation or cleanup
        if (progress < 1) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
          
          // Remove container when all particles are done
          if (particleContainer.children.length === 0) {
            particleContainer.remove();
          }
        }
      }
      
      // Start with slight delay for each particle
      setTimeout(() => {
        requestAnimationFrame(animateParticle);
      }, 500);
    }
    
    this.elements.emailDisplay.classList.remove('email-display--reset');
  }
}; 