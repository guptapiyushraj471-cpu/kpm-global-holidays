/* KPM Global Holidays – Landing V2 Enhancements (Cleaned & aligned)
   - Merged DOMContentLoaded handlers into one
   - Fixed lazy-loading to use data-src
   - Removed duplicated listeners and defensive checks added
   - Fixed ripple creation (no .replace hack)
   - Debounced scroll handlers where appropriate
   - Ensured AI chat UI is created before querying elements
   - Exported utilities at end

   Copy-paste this file over your existing JS. */

(function () {
  'use strict';

  // Debounce helper
  function debounce(fn, ms = 10) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initReveal();
    initSkeletonImages();
    initDestinationFilters();
    initSearchHighlight();
    initStatsAnimation();
    initNewsletter();
    initParallax();
    initStickyHeader();
    initBackToTop();
    initPlanTripCta();

    // AI
    initAiChat();

    // Animations
    initAdvancedAnimations();
    initButtonRipple();
    initHoverEffects();
    initScrollTriggers();

    // Init extras
    initLazyLoading();
    initPageTransitions();
    initFloatingHints();
    initKeyboardNav();

    // Optional: mouse trail - commented out by default (performance)
    // initMouseTrail();

    // Perf monitoring for dev
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      initPerformanceMonitoring();
    }
  });

  /* ---------------------- NAV ---------------------- */
  function initNav() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('primaryNav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------- REVEAL ---------------------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  /* ---------------------- SKELETON IMAGES ---------------------- */
  function initSkeletonImages() {
    const wraps = document.querySelectorAll('.image-wrap');
    wraps.forEach((wrap) => {
      const img = wrap.querySelector('img');
      if (!img) return;

      const markLoaded = () => {
        wrap.classList.add('image-loaded');
        wrap.classList.remove('skeleton');
      };

      if (img.complete && img.naturalWidth !== 0) {
        markLoaded();
      } else {
        img.addEventListener('load', markLoaded);
        img.addEventListener('error', () => wrap.classList.remove('skeleton'));
      }
    });
  }

  /* ---------------------- DESTINATION FILTERS ---------------------- */
  function initDestinationFilters() {
    const group = document.getElementById('destinationFilters');
    const cards = Array.from(document.querySelectorAll('.destination-card'));
    if (!group || cards.length === 0) return;

    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;

      group.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach((card) => {
        const type = card.getAttribute('data-type');
        const show = filter === 'all' || type === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---------------------- SEARCH HIGHLIGHT ---------------------- */
  function initSearchHighlight() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('where');
    const resultText = document.getElementById('searchResultText');
    const packageCards = Array.from(document.querySelectorAll('.package-card'));

    if (!form || !input || packageCards.length === 0) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim().toLowerCase();
      let matches = 0;

      packageCards.forEach((card) => card.classList.remove('highlight'));

      if (query.length === 0) {
        if (resultText) resultText.textContent = 'Type a place or experience to find relevant packages.';
        return;
      }

      packageCards.forEach((card) => {
        const dest = (card.getAttribute('data-destination') || '').toLowerCase();
        const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('p')?.textContent || '').toLowerCase();

        if (dest.includes(query) || title.includes(query) || desc.includes(query)) {
          card.classList.add('highlight');
          matches++;
        }
      });

      if (resultText) {
        resultText.textContent = matches > 0 ? `Found ${matches} matching package${matches > 1 ? 's' : ''}.` : 'No matching packages found. Try a different destination or keyword.';
      }

      const packages = document.getElementById('packages');
      packages?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------------------- STATS ANIMATION ---------------------- */
  function initStatsAnimation() {
    const stats = Array.from(document.querySelectorAll('.stat-value'));
    if (stats.length === 0 || !('IntersectionObserver' in window)) return;

    const easeOutQuad = (t) => t * (2 - t);

    const animateValue = (el, end, duration = 1800) => {
      const start = 0;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuad(progress);
        const current = Math.floor(start + (end - start) * eased);
        el.textContent = current.toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (!isNaN(target)) {
            animateValue(el, target);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );

    stats.forEach((el) => observer.observe(el));
  }

  /* ---------------------- NEWSLETTER ---------------------- */
  function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const email = document.getElementById('newsletterEmail');
    const success = document.getElementById('newsletterSuccess');
    if (!form || !email || !success) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = email.value.trim();

      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValid) {
        success.textContent = 'Please enter a valid email address.';
        success.style.color = getComputedStyle(document.documentElement).getPropertyValue('--danger') || '#dc2626';
        return;
      }

      success.textContent = "Thanks! You'll receive curated holiday ideas soon.";
      success.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#0ea5e9';
      email.value = '';
      success.setAttribute('aria-live', 'polite');
    });
  }

  /* ---------------------- PARALLAX ---------------------- */
  function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return;

    const onScroll = debounce(() => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      layers.forEach((layer) => {
        const factor = parseFloat(layer.getAttribute('data-parallax') || '0.15');
        layer.style.transform = `translate3d(0, ${scrollY * factor}px, 0)`;
      });
    }, 12);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------- STICKY HEADER ---------------------- */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = debounce(() => {
      const isStuck = (window.scrollY || document.documentElement.scrollTop) > 8;
      header.classList.toggle('is-stuck', isStuck);
    }, 12);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------- BACK TO TOP ---------------------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const onScroll = debounce(() => {
      const show = (window.scrollY || document.documentElement.scrollTop) > 320;
      btn.classList.toggle('is-visible', show);
    }, 25);

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------- PLAN TRIP CTA ---------------------- */
  function initPlanTripCta() {
    const cta = document.querySelector('.nav-cta');
    const searchInput = document.getElementById('where');
    const form = document.getElementById('searchForm');

    if (!cta || !searchInput || !form) return;

    cta.addEventListener('click', (e) => {
      // If nav-cta contains a button/link, prefer that
      const targetBtn = cta.closest('.nav-cta') || cta;
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => searchInput.focus(), 600);
      e.preventDefault();
    });
  }

  /* ---------------------- AI CHAT ---------------------- */
  function initAiChat() {
    // Create UI if missing
    createChatUI();

    const chatToggle = document.querySelector('.ai-chat-toggle');
    const chatContainer = document.querySelector('.ai-chat-container');
    const chatClose = document.querySelector('.ai-chat-close');
    const chatInput = document.querySelector('.ai-chat-input');
    const chatSend = document.querySelector('.ai-chat-send');
    const chatMessages = document.querySelector('.ai-chat-messages');
    const suggestions = document.querySelector('.ai-suggestions');

    if (!chatToggle || !chatContainer || !chatInput || !chatMessages) return;

    let isOpen = false;
    let conversationHistory = [];

    chatToggle.addEventListener('click', () => {
      isOpen = !isOpen;
      chatContainer.classList.toggle('is-open', isOpen);
      chatToggle.classList.toggle('is-open', isOpen);

      if (isOpen && conversationHistory.length === 0) {
        setTimeout(() => {
          addAiMessage("Hi! 👋 I'm your KPM travel assistant. I can help you find the perfect holiday package. Where would you like to go?");
          showSuggestedActions();
        }, 300);
      }
    });

    chatClose && chatClose.addEventListener('click', () => {
      isOpen = false;
      chatContainer.classList.remove('is-open');
      chatToggle.classList.remove('is-open');
    });

    chatSend && chatSend.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      addUserMessage(message);
      chatInput.value = '';

      chatInput.disabled = true;
      chatSend.disabled = true;

      showTypingIndicator();

      callAiApi(message)
        .then((response) => {
          hideTypingIndicator();
          addAiMessage(response);
        })
        .catch(() => {
          hideTypingIndicator();
          addAiMessage('Sorry, something went wrong. Please try again.');
        })
        .finally(() => {
          chatInput.disabled = false;
          chatSend.disabled = false;
          chatInput.focus();
        });
    }

    function addUserMessage(text) {
      const messageEl = document.createElement('div');
      messageEl.className = 'user-message';
      messageEl.innerHTML = `${escapeHtml(text)}<div class="message-time">${getCurrentTime()}</div>`;
      chatMessages.appendChild(messageEl);
      scrollToBottom();
      conversationHistory.push({ role: 'user', content: text });
    }

    function addAiMessage(text) {
      const messageEl = document.createElement('div');
      messageEl.className = 'ai-message';
      messageEl.innerHTML = `${escapeHtml(text)}<div class="message-time">${getCurrentTime()}</div>`;
      chatMessages.appendChild(messageEl);
      scrollToBottom();
      conversationHistory.push({ role: 'assistant', content: text });
    }

    function showTypingIndicator() {
      hideTypingIndicator();
      const indicator = document.createElement('div');
      indicator.className = 'ai-typing-indicator';
      indicator.id = 'typingIndicator';
      indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      chatMessages.appendChild(indicator);
      scrollToBottom();
    }

    function hideTypingIndicator() {
      const indicator = document.getElementById('typingIndicator');
      if (indicator) indicator.remove();
    }

    function showSuggestedActions() {
      if (!suggestions) return;
      suggestions.innerHTML = '';
      const chips = [
        { text: '🏖️ Beach holidays', value: 'Show me beach destinations' },
        { text: '✈️ International', value: 'What are popular international trips?' },
        { text: '💰 Budget trips', value: 'Budget-friendly packages' }
      ];

      chips.forEach((c) => {
        const el = document.createElement('div');
        el.className = 'ai-suggestion-chip';
        el.setAttribute('data-suggestion', c.value);
        el.textContent = c.text;
        el.addEventListener('click', () => {
          chatInput.value = c.value;
          sendMessage();
          suggestions.innerHTML = '';
        });
        suggestions.appendChild(el);
      });
    }

    function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  /* ---------------------- SIMULATED AI API ---------------------- */
  async function callAiApi(promptText) {
    const delay = 800 + Math.random() * 700;
    await new Promise((resolve) => setTimeout(resolve, delay));
    const lowerPrompt = (promptText || '').toLowerCase();

    if (lowerPrompt.includes('beach') || lowerPrompt.includes('coast') || lowerPrompt.includes('sea')) {
      return '🏖️ For beach lovers, I recommend **Goa** (starting ₹8,499) for a quick weekend getaway, or **Thailand** (starting ₹42,999) for stunning islands like Phuket and Phi Phi.';
    }

    if (lowerPrompt.includes('international') || lowerPrompt.includes('abroad') || lowerPrompt.includes('overseas')) {
      return '✈️ Our most popular international packages are **Dubai** (₹52,999), **Thailand** (₹42,999), and **Iceland** (₹1,45,000). Which interests you?';
    }

    if (lowerPrompt.includes('budget') || lowerPrompt.includes('cheap') || lowerPrompt.includes('affordable')) {
      return '💰 Great value packages include **Goa** (from ₹8,499), **Manali** (from ₹13,499), and **Ladakh** (from ₹24,500). Which appeals to you?';
    }

    if (lowerPrompt.includes('mountain') || lowerPrompt.includes('trek') || lowerPrompt.includes('adventure')) {
      return '🏔️ For mountain adventures, check out **Ladakh** (₹32,999), **Manali** (₹13,499), or **Rajasthan** (₹26,750).';
    }

    if (lowerPrompt.includes('dubai')) return '✨ Dubai packages start at ₹52,999 for 5N/6D including desert safari and city tour.';
    if (lowerPrompt.includes('goa')) return '🌴 Goa escapes start at ₹8,499 for 2N/3D with beachside stays and a sunset cruise.';
    if (lowerPrompt.includes('ladakh') || lowerPrompt.includes('leh')) return '🏔️ Ladakh roadtrip ₹32,999 for 7N/8D (Manali-Leh, Nubra, Pangong).';
    if (lowerPrompt.includes('thailand')) return '🏝️ Thailand packages ₹42,999 for 5N/6D including Phuket & Phi Phi island hopping.';

    if (lowerPrompt.includes('when') || lowerPrompt.includes('best time') || lowerPrompt.includes('season')) {
      return '📅 Best times: Goa Oct–Mar, Ladakh May–Sep, Manali (Dec–Feb for snow), Dubai Nov–Mar.';
    }

    if (lowerPrompt.includes('book') || lowerPrompt.includes('price') || lowerPrompt.includes('cost')) {
      return '💳 Prices include stays, transfers and sightseeing. You can customize any package. Want details?';
    }

    if (lowerPrompt.includes('help') || lowerPrompt.includes('support') || lowerPrompt.includes('contact')) {
      return '💬 I can connect you with our travel experts on WhatsApp or show packages below. What do you need?';
    }

    if (['hi', 'hello', 'hey'].some((w) => lowerPrompt.includes(w))) {
      return "Hi there! 😊 Looking for beach, mountain, family or international trips?";
    }

    if (lowerPrompt.includes('thank')) return "You're welcome! 😊";

    return "I'd love to help. Tell me what you're looking for — beach, mountains, family trips or a specific place like Goa or Dubai?";
  }

  /* ---------------------- CREATE CHAT UI ---------------------- */
  function createChatUI() {
    if (document.querySelector('.ai-chat-container')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'ai-chat-toggle';
    toggleBtn.setAttribute('aria-label', 'Open AI travel assistant');
    toggleBtn.innerHTML = '💬';
    document.body.appendChild(toggleBtn);

    const chatContainer = document.createElement('div');
    chatContainer.className = 'ai-chat-container';
    chatContainer.innerHTML = `
      <div class="ai-chat-header">
        <div class="ai-chat-title">
          <div class="ai-avatar">AI</div>
          <div class="ai-chat-title-text"><strong>Travel Assistant</strong><span>Online now</span></div>
        </div>
        <button class="ai-chat-close" aria-label="Close chat">×</button>
      </div>
      <div class="ai-chat-messages"></div>
      <div class="ai-suggestions"></div>
      <div class="ai-chat-input-container">
        <input type="text" class="ai-chat-input" placeholder="Ask about destinations, packages..." aria-label="Chat message" />
        <button class="ai-chat-send" aria-label="Send message"> 
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(chatContainer);
  }

  /* ---------------------- ADVANCED ANIMATIONS ---------------------- */
  function initAdvancedAnimations() {
    const groups = [
      ...document.querySelectorAll('.destination-card'),
      ...document.querySelectorAll('.package-card'),
      ...document.querySelectorAll('.why-card'),
      ...document.querySelectorAll('.testimonial-card')
    ];

    groups.forEach((card, i) => {
      card.style.animationDelay = `${(i % 12) * 0.06}s`;
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const interactive = document.querySelectorAll('.destination-card, .package-card, .why-card, .testimonial-card, .stat-card');
    interactive.forEach((el) => el.addEventListener('mouseenter', () => el.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'));
  }

  /* ---------------------- BUTTON RIPPLE ---------------------- */
  function initButtonRipple() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline, .chip, .ai-chat-send');

    buttons.forEach((button) => {
      button.addEventListener('click', function (e) {
        const existingRipple = this.querySelector('.ripple-effect');
        if (existingRipple) existingRipple.remove();

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.5);left:${x}px;top:${y}px;transform:scale(0);animation:ripple-animation 0.6s ease-out;pointer-events:none;`;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 650);
      });
    });

    if (!document.getElementById('ripple-animation-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation-style';
      style.textContent = `@keyframes ripple-animation { to { transform: scale(2.5); opacity: 0; } }`;
      document.head.appendChild(style);
    }
  }

  /* ---------------------- HOVER EFFECTS ---------------------- */
  function initHoverEffects() {
    const magnetic = document.querySelectorAll('.btn-primary, .ai-chat-toggle');
    magnetic.forEach((button) => {
      button.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) scale(1.02)`;
      });

      button.addEventListener('mouseleave', function () { this.style.transform = 'translate(0,0) scale(1)'; });
    });

    const tiltCards = document.querySelectorAll('.destination-card, .package-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', function () { this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; });
    });
  }

  /* ---------------------- SCROLL TRIGGERS ---------------------- */
  function initScrollTriggers() {
    createScrollProgressBar();

    const fadeElements = document.querySelectorAll('.hero-content > *, .section-heading, .price-block, .testimonial-text');
    if ('IntersectionObserver' in window) {
      const fadeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      fadeElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
      });
    } else {
      fadeElements.forEach((el) => (el.style.opacity = '1'));
    }

    const sections = document.querySelectorAll('.section');
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('section-visible');
              const children = entry.target.querySelectorAll('.destination-card, .package-card, .why-card, .testimonial-card');
              children.forEach((child, index) => {
                setTimeout(() => {
                  child.style.opacity = '1';
                  child.style.transform = 'translateY(0)';
                }, index * 80);
              });
            }
          });
        },
        { threshold: 0.15 }
      );
      sections.forEach((s) => sectionObserver.observe(s));
    }
  }

  function createScrollProgressBar() {
    if (document.getElementById('scroll-progress-bar')) return;
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    Object.assign(progressBar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '0%',
      height: '3px',
      background: 'linear-gradient(90deg, #7c3aed, #0ea5e9)',
      zIndex: 9999,
      transition: 'width 0.1s ease',
      boxShadow: '0 2px 10px rgba(124, 58, 237, 0.5)'
    });
    document.body.appendChild(progressBar);

    const updateProgress = debounce(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = scrollPercent + '%';
    }, 20);

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------------------- LAZY LOADING ---------------------- */
  function initLazyLoading() {
    const lazyImages = Array.from(document.querySelectorAll('img[data-src]'));
    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            img.addEventListener('load', () => img.classList.add('lazy-loaded'));
            obs.unobserve(img);
          });
        },
        { rootMargin: '50px 0px' }
      );

      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback: load all
      lazyImages.forEach((img) => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
    }
  }

  /* ---------------------- PAGE TRANSITIONS ---------------------- */
  function initPageTransitions() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    window.addEventListener('load', () => (document.body.style.opacity = '1'));

    document.querySelectorAll("a[href$='.html']").forEach((link) => {
      link.addEventListener('click', function (e) {
        if (this.hostname === window.location.hostname) {
          e.preventDefault();
          const href = this.getAttribute('href');
          document.body.style.opacity = '0';
          setTimeout(() => (window.location.href = href), 300);
        }
      });
    });
  }

  /* ---------------------- FLOATING HINTS ---------------------- */
  function initFloatingHints() {
    setTimeout(() => {
      const primaryCtas = document.querySelectorAll('.nav-cta, .search-btn, .ai-chat-toggle');
      primaryCtas.forEach((cta) => (cta.style.animation = 'subtle-pulse 2s ease-in-out infinite'));

      if (!document.getElementById('subtle-pulse-style')) {
        const style = document.createElement('style');
        style.id = 'subtle-pulse-style';
        style.textContent = '@keyframes subtle-pulse { 0%,100% { box-shadow: 0 6px 20px rgba(14,165,233,0.25);} 50% { box-shadow: 0 8px 30px rgba(14,165,233,0.4);} }';
        document.head.appendChild(style);
      }
    }, 3000);
  }

  /* ---------------------- KEYBOARD NAV ---------------------- */
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('where');
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      if (e.key === 'Escape') {
        const chatContainer = document.querySelector('.ai-chat-container');
        const chatToggle = document.querySelector('.ai-chat-toggle');
        if (chatContainer && chatContainer.classList.contains('is-open')) {
          chatContainer.classList.remove('is-open');
          chatToggle && chatToggle.classList.remove('is-open');
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        const chatToggle = document.querySelector('.ai-chat-toggle');
        if (chatToggle) chatToggle.click();
      }
    });

    if (!document.getElementById('focus-visible-style')) {
      const style = document.createElement('style');
      style.id = 'focus-visible-style';
      style.textContent = `*:focus { outline: 2px solid rgba(124,58,237,0.5); outline-offset: 2px; } *:focus:not(:focus-visible) { outline:none; }`;
      document.head.appendChild(style);
    }
  }

  /* ---------------------- MOUSE TRAIL (OPT-IN) ---------------------- */
  function initMouseTrail() {
    const trail = [];
    const trailLength = 8;
    document.addEventListener('mousemove', (e) => {
      const dot = document.createElement('div');
      dot.className = 'mouse-trail-dot';
      dot.style.cssText = `position:fixed;width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,rgba(124,58,237,0.3),rgba(14,165,233,0.3));pointer-events:none;z-index:9998;left:${e.clientX - 3}px;top:${e.clientY - 3}px;animation:trail-fade 0.5s ease-out forwards;`;
      document.body.appendChild(dot);
      trail.push(dot);
      if (trail.length > trailLength) {
        const old = trail.shift();
        old && old.remove();
      }
    });

    if (!document.getElementById('trail-fade-style')) {
      const style = document.createElement('style');
      style.id = 'trail-fade-style';
      style.textContent = '@keyframes trail-fade { to { opacity:0; transform:scale(0.5);} }';
      document.head.appendChild(style);
    }
  }

  /* ---------------------- TOAST ---------------------- */
  function showToast(message, type = 'info', duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = 'position:fixed;top:80px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    const bgColors = {
      info: 'linear-gradient(135deg, rgba(14,165,233,0.95), rgba(6,182,212,0.95))',
      success: 'linear-gradient(135deg, rgba(34,197,94,0.95), rgba(16,185,129,0.95))',
      warning: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
      error: 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,0.95))'
    };

    toast.style.cssText = `background:${bgColors[type] || bgColors.info};color:white;padding:14px 18px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.15);font-size:14px;font-weight:500;max-width:320px;animation:toast-slide-in 0.3s ease-out;backdrop-filter:blur(10px);`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    if (!document.getElementById('toast-animation-style')) {
      const style = document.createElement('style');
      style.id = 'toast-animation-style';
      style.textContent = '@keyframes toast-slide-in { from { opacity:0; transform:translateX(100px);} to { opacity:1; transform:translateX(0);} } @keyframes toast-slide-out { from { opacity:1; transform:translateX(0);} to { opacity:0; transform:translateX(100px);} }';
      document.head.appendChild(style);
    }

    setTimeout(() => {
      toast.style.animation = 'toast-slide-out 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ---------------------- PERFORMANCE MONITOR ---------------------- */
  function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('load', () => {
      try {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime + 'ms');
      } catch (e) {}
    });
  }

  /* ---------------------- EXPORT ---------------------- */
  window.KPMUtils = {
    showToast,
    animateCounter,
    callAiApi
  };

})();
