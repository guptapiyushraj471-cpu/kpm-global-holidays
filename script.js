/* KPM Global Holidays – Landing V2 Enhancements
   - Mobile navigation toggle
   - Smooth section reveal via IntersectionObserver
   - Destination filters (chips)
   - Package highlighting on search
   - Image skeleton -> loaded state
   - Stats animation (on visible)
   - Newsletter handler (basic validation)
   - Sticky header shadow on scroll
   - Back to Top button
   - Minimal parallax
   - Plan a Trip CTA scroll + focus
*/

document.addEventListener("DOMContentLoaded", () => {
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
  
  // --- NEW AI LOGIC START ---
  initAiChat();
  // --- NEW CODE END ---
  
  // --- NEW ANIMATION LOGIC START ---
  initAdvancedAnimations();
  initButtonRipple();
  initHoverEffects();
  initScrollTriggers();
  // --- NEW CODE END ---
});

/* Navigation: mobile toggle + close on click */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after clicking any in-page link
  nav.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Reveal sections on scroll */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* Skeleton loader -> mark loaded */
function initSkeletonImages() {
  const wraps = document.querySelectorAll(".image-wrap");
  wraps.forEach((wrap) => {
    const img = wrap.querySelector("img");
    if (!img) return;

    if (img.complete) {
      wrap.classList.add("image-loaded");
      wrap.classList.remove("skeleton");
    } else {
      img.addEventListener("load", () => {
        wrap.classList.add("image-loaded");
        wrap.classList.remove("skeleton");
      });
      img.addEventListener("error", () => {
        wrap.classList.remove("skeleton");
      });
    }
  });
}

/* Destination filters using chip group and data-type */
function initDestinationFilters() {
  const group = document.getElementById("destinationFilters");
  const cards = Array.from(document.querySelectorAll(".destination-card"));
  if (!group || cards.length === 0) return;

  group.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;

    // active state on chip
    group.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");
    cards.forEach((card) => {
      const type = card.getAttribute("data-type");
      const show = filter === "all" || type === filter;
      card.style.display = show ? "" : "none";
    });
  });
}

/* Search: highlights matching packages by destination or text */
function initSearchHighlight() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("where");
  const resultText = document.getElementById("searchResultText");
  const packageCards = Array.from(document.querySelectorAll(".package-card"));

  if (!form || !input || packageCards.length === 0) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim().toLowerCase();
    let matches = 0;

    // clear old highlight
    packageCards.forEach((card) => card.classList.remove("highlight"));

    if (query.length === 0) {
      if (resultText) {
        resultText.textContent =
          "Type a place or experience to find relevant packages.";
      }
      return;
    }

    packageCards.forEach((card) => {
      const dest = (card.getAttribute("data-destination") || "").toLowerCase();
      const title = (card.querySelector("h3")?.textContent || "").toLowerCase();
      const desc = (card.querySelector("p")?.textContent || "").toLowerCase();

      if (dest.includes(query) || title.includes(query) || desc.includes(query)) {
        card.classList.add("highlight");
        matches++;
      }
    });

    if (resultText) {
      resultText.textContent =
        matches > 0
          ? `Found ${matches} matching package${matches > 1 ? "s" : ""}.`
          : "No matching packages found. Try a different destination or keyword.";
    }

    const packages = document.getElementById("packages");
    packages?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* Stats animation: count up when visible */
function initStatsAnimation() {
  const stats = Array.from(document.querySelectorAll(".stat-value"));
  if (stats.length === 0) return;

  const easeOutQuad = (t) => t * (2 - t);

  const animateValue = (el, end, duration = 1800) => {
    const start = 0;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      const current = Math.floor(start + (end - start) * eased);
      el.textContent = current.toLocaleString("en-IN");
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"), 10);
        if (!isNaN(target)) {
          animateValue(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.25 }
  );

  stats.forEach((el) => observer.observe(el));
}

/* Newsletter: simple validation and feedback */
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  const email = document.getElementById("newsletterEmail");
  const success = document.getElementById("newsletterSuccess");
  if (!form || !email || !success) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = email.value.trim();

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValid) {
      success.textContent = "Please enter a valid email address.";
      success.style.color =
        getComputedStyle(document.documentElement).getPropertyValue("--danger") ||
        "#dc2626";
      return;
    }

    success.textContent = "Thanks! You'll receive curated holiday ideas soon.";
    success.style.color =
      getComputedStyle(document.documentElement).getPropertyValue("--accent") ||
      "#0ea5e9";
    email.value = "";
    success.setAttribute("aria-live", "polite");
  });
}

/* Parallax: minimal effect on hero-media */
function initParallax() {
  const layers = document.querySelectorAll(".parallax-layer");
  if (!layers.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    layers.forEach((layer) => {
      const factor = parseFloat(layer.getAttribute("data-parallax") || "0.15");
      layer.style.transform = `translate3d(0, ${scrollY * factor}px, 0)`;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Sticky header: adds subtle shadow when scrolled past top */
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    const isStuck = (window.scrollY || document.documentElement.scrollTop) > 8;
    header.classList.toggle("is-stuck", isStuck);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* Back to Top */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const onScroll = () => {
    const show = (window.scrollY || document.documentElement.scrollTop) > 320;
    btn.classList.toggle("is-visible", show);
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* Plan a Trip CTA: scroll to search + focus input */
function initPlanTripCta() {
  const cta = document.querySelector(".nav-cta");
  const searchInput = document.getElementById("where");
  const form = document.getElementById("searchForm");

  if (!cta || !searchInput || !form) return;

  cta.addEventListener("click", () => {
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      searchInput.focus();
    }, 600);
  });
}

// --- NEW AI LOGIC START ---

/* AI Chat System - Complete Implementation */
function initAiChat() {
  // Create chat UI elements dynamically if they don't exist
  createChatUI();
  
  const chatToggle = document.querySelector(".ai-chat-toggle");
  const chatContainer = document.querySelector(".ai-chat-container");
  const chatClose = document.querySelector(".ai-chat-close");
  const chatInput = document.querySelector(".ai-chat-input");
  const chatSend = document.querySelector(".ai-chat-send");
  const chatMessages = document.querySelector(".ai-chat-messages");
  
  if (!chatToggle || !chatContainer) return;
  
  let isOpen = false;
  let conversationHistory = [];
  
  // Toggle chat window
  chatToggle.addEventListener("click", () => {
    isOpen = !isOpen;
    chatContainer.classList.toggle("is-open", isOpen);
    chatToggle.classList.toggle("is-open", isOpen);
    
    if (isOpen && conversationHistory.length === 0) {
      // Send welcome message
      setTimeout(() => {
        addAiMessage("Hi! 👋 I'm your KPM travel assistant. I can help you find the perfect holiday package. Where would you like to go?");
        showSuggestedActions();
      }, 300);
    }
  });
  
  // Close button
  if (chatClose) {
    chatClose.addEventListener("click", () => {
      isOpen = false;
      chatContainer.classList.remove("is-open");
      chatToggle.classList.remove("is-open");
    });
  }
  
  // Send message on button click
  if (chatSend) {
    chatSend.addEventListener("click", () => {
      sendMessage();
    });
  }
  
  // Send message on Enter key
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // Send message function
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addUserMessage(message);
    chatInput.value = "";
    
    // Disable input while processing
    chatInput.disabled = true;
    chatSend.disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Call AI API (simulated)
    callAiApi(message).then((response) => {
      hideTypingIndicator();
      addAiMessage(response);
      
      // Re-enable input
      chatInput.disabled = false;
      chatSend.disabled = false;
      chatInput.focus();
    });
  }
  
  // Add user message to chat
  function addUserMessage(text) {
    const messageEl = document.createElement("div");
    messageEl.className = "user-message";
    messageEl.innerHTML = `
      ${escapeHtml(text)}
      <div class="message-time">${getCurrentTime()}</div>
    `;
    chatMessages.appendChild(messageEl);
    scrollToBottom();
    
    conversationHistory.push({ role: "user", content: text });
  }
  
  // Add AI message to chat
  function addAiMessage(text) {
    const messageEl = document.createElement("div");
    messageEl.className = "ai-message";
    messageEl.innerHTML = `
      ${escapeHtml(text)}
      <div class="message-time">${getCurrentTime()}</div>
    `;
    chatMessages.appendChild(messageEl);
    scrollToBottom();
    
    conversationHistory.push({ role: "assistant", content: text });
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "ai-typing-indicator";
    indicator.id = "typingIndicator";
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(indicator);
    scrollToBottom();
  }
  
  // Hide typing indicator
  function hideTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    if (indicator) {
      indicator.remove();
    }
  }
  
  // Show suggested actions
  function showSuggestedActions() {
    const suggestions = document.querySelector(".ai-suggestions");
    if (!suggestions) return;
    
    suggestions.innerHTML = `
      <div class="ai-suggestion-chip" data-suggestion="Show me beach destinations">🏖️ Beach holidays</div>
      <div class="ai-suggestion-chip" data-suggestion="What are popular international trips?">✈️ International</div>
      <div class="ai-suggestion-chip" data-suggestion="Budget-friendly packages">💰 Budget trips</div>
    `;
    
    // Add click handlers
    suggestions.querySelectorAll(".ai-suggestion-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const suggestion = chip.getAttribute("data-suggestion");
        chatInput.value = suggestion;
        sendMessage();
        suggestions.innerHTML = "";
      });
    });
  }
  
  // Scroll chat to bottom
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Get current time
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
  }
  
  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

/* AI API Call - Simulated with intelligent responses */
async function callAiApi(promptText) {
  // Simulate API delay (800ms - 1500ms)
  const delay = 800 + Math.random() * 700;
  
  await new Promise((resolve) => setTimeout(resolve, delay));
  
  // Smart response generation based on keywords
  const lowerPrompt = promptText.toLowerCase();
  
  // Beach destinations
  if (lowerPrompt.includes("beach") || lowerPrompt.includes("coast") || lowerPrompt.includes("sea")) {
    return "🏖️ For beach lovers, I recommend **Goa** (starting ₹8,499) for a quick weekend getaway, or **Thailand** (starting ₹42,999) for stunning islands like Phuket and Phi Phi. Both offer amazing coastal experiences!";
  }
  
  // International trips
  if (lowerPrompt.includes("international") || lowerPrompt.includes("abroad") || lowerPrompt.includes("overseas")) {
    return "✈️ Our most popular international packages are **Dubai** (₹52,999) for luxury and desert adventures, **Thailand** (₹42,999) for tropical beaches, and **Iceland** (₹1,45,000) for the Northern Lights experience. Which interests you?";
  }
  
  // Budget trips
  if (lowerPrompt.includes("budget") || lowerPrompt.includes("cheap") || lowerPrompt.includes("affordable")) {
    return "💰 Great value packages include **Goa** (from ₹8,499), **Manali** (from ₹13,499), and **Ladakh** (from ₹24,500). All include accommodation, meals, and sightseeing. Which destination appeals to you?";
  }
  
  // Mountain/adventure
  if (lowerPrompt.includes("mountain") || lowerPrompt.includes("trek") || lowerPrompt.includes("adventure") || lowerPrompt.includes("hill")) {
    return "🏔️ For mountain adventures, check out **Ladakh** (₹32,999) for epic high-altitude drives, **Manali** (₹13,499) for snow peaks and cozy stays, or **Rajasthan** (₹26,750) for palace tours. What kind of experience are you looking for?";
  }
  
  // Family trips
  if (lowerPrompt.includes("family") || lowerPrompt.includes("kids") || lowerPrompt.includes("children")) {
    return "👨‍👩‍👧‍👦 Perfect family packages include **Dubai** (₹52,999) with theme parks and desert safaris, **Goa** (₹8,499) for beach fun, and **Manali** (₹13,499) for snow activities. All are family-friendly with comfortable stays!";
  }
  
  // Specific destinations
  if (lowerPrompt.includes("dubai")) {
    return "✨ Dubai packages start at ₹52,999 for 5N/6D including desert safari, city tour, Dhow cruise, and 4-star hotels. We also offer Abu Dhabi add-ons. Interested in booking?";
  }
  
  if (lowerPrompt.includes("goa")) {
    return "🌴 Goa beach escapes start at just ₹8,499 for 2N/3D with beachside stays, breakfast, and sunset cruise. Perfect for a quick weekend trip. Want to see the full itinerary?";
  }
  
  if (lowerPrompt.includes("ladakh") || lowerPrompt.includes("leh")) {
    return "🏔️ Our Ladakh roadtrip (₹32,999 for 7N/8D) covers Manali to Leh, Nubra Valley, Pangong Lake, and high mountain passes. Includes permits, stays, and an experienced driver. Adventure awaits!";
  }
  
  if (lowerPrompt.includes("thailand")) {
    return "🏝️ Thailand packages (₹42,999 for 5N/6D) combine Bangkok city tours with Phuket beaches and Phi Phi island hopping. Includes flights, transfers, and 3-4★ hotels. Ready to explore?";
  }
  
  // Dates/when to go
  if (lowerPrompt.includes("when") || lowerPrompt.includes("best time") || lowerPrompt.includes("season")) {
    return "📅 The best time depends on your destination! Goa: Oct–Mar, Ladakh: May–Sep, Manali: All year (Dec–Feb for snow), Dubai: Nov–Mar. Which destination are you considering?";
  }
  
  // Booking/price questions
  if (lowerPrompt.includes("book") || lowerPrompt.includes("price") || lowerPrompt.includes("cost") || lowerPrompt.includes("how much")) {
    return "💳 All our packages have transparent pricing with no hidden costs. Prices include stays, meals (where mentioned), transfers, and sightseeing. You can customize any package to fit your budget. Would you like to see specific package details?";
  }
  
  // Help/support
  if (lowerPrompt.includes("help") || lowerPrompt.includes("support") || lowerPrompt.includes("contact")) {
    return "💬 I'm here to help! You can also chat with our travel experts on WhatsApp for personalized quotes, or browse our packages below. What can I help you find?";
  }
  
  // Greetings
  if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi") || lowerPrompt.includes("hey")) {
    return "Hi there! 😊 I'm here to help you plan your perfect holiday. Are you looking for beach escapes, mountain adventures, or international experiences?";
  }
  
  // Thanks
  if (lowerPrompt.includes("thank") || lowerPrompt.includes("thanks")) {
    return "You're welcome! 😊 Feel free to ask if you need more help planning your trip. Happy to assist!";
  }
  
  // Default response
  return "I'd love to help you find the perfect trip! 🌍 Could you tell me more about what you're looking for? For example: beach destinations, adventure trips, family holidays, budget options, or specific places like Goa, Dubai, or Ladakh?";
}

/* Create Chat UI dynamically */
function createChatUI() {
  // Check if chat UI already exists
  if (document.querySelector(".ai-chat-container")) return;
  
  // Create chat toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "ai-chat-toggle";
  toggleBtn.setAttribute("aria-label", "Open AI travel assistant");
  toggleBtn.innerHTML = "💬";
  document.body.appendChild(toggleBtn);
  
  // Create chat container
  const chatContainer = document.createElement("div");
  chatContainer.className = "ai-chat-container";
  chatContainer.innerHTML = `
    <div class="ai-chat-header">
      <div class="ai-chat-title">
        <div class="ai-avatar">AI</div>
        <div class="ai-chat-title-text">
          <strong>Travel Assistant</strong>
          <span>Online now</span>
        </div>
      </div>
      <button class="ai-chat-close" aria-label="Close chat">×</button>
    </div>
    <div class="ai-chat-messages"></div>
    <div class="ai-suggestions"></div>
    <div class="ai-chat-input-container">
      <input 
        type="text" 
        class="ai-chat-input" 
        placeholder="Ask about destinations, packages..."
        aria-label="Chat message"
      />
      <button class="ai-chat-send" aria-label="Send message">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(chatContainer);
}

// --- NEW CODE END ---

// --- NEW ANIMATION LOGIC START ---

/* Advanced Animations - Card stagger effects, parallax on elements */
function initAdvancedAnimations() {
  // Stagger animation for cards
  const cardGroups = [
    document.querySelectorAll(".destination-card"),
    document.querySelectorAll(".package-card"),
    document.querySelectorAll(".why-card"),
    document.querySelectorAll(".testimonial-card")
  ];
  
  cardGroups.forEach((cards) => {
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  });
  
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
  
  // Add hover animation class to interactive elements
  const interactiveElements = document.querySelectorAll(
    ".destination-card, .package-card, .why-card, .testimonial-card, .stat-card"
  );
  
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
    });
  });
}

/* Button Ripple Effect */
function initButtonRipple() {
  const buttons = document.querySelectorAll(
    ".btn-primary, .btn-outline, .chip, .ai-chat-send"
  );
  
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Remove any existing ripples
      const existingRipple = this.querySelector(".ripple-effect");
      if (existingRipple) {
        existingRipple.remove();
      }
      
      // Create ripple element
      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      
      // Get button dimensions and click position
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      // Set ripple position and size
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple-animation 0.6s.ease-out;
        pointer-events: none;
      `.replace(".ease-out", " ease-out"); // small fix
      
      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add ripple animation to document if not exists
  if (!document.getElementById("ripple-animation-style")) {
    const style = document.createElement("style");
    style.id = "ripple-animation-style";
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(2.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/* Hover Effects - Magnetic buttons, tilt cards */
function initHoverEffects() {
  // Magnetic effect for CTAs
  const magneticButtons = document.querySelectorAll(
    ".btn-primary, .ai-chat-toggle"
  );
  
  magneticButtons.forEach((button) => {
    button.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = x * 0.15;
      const moveY = y * 0.15;
      
      this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    });
    
    button.addEventListener("mouseleave", function () {
      this.style.transform = "translate(0, 0) scale(1)";
    });
  });
  
  // Tilt effect for cards
  const tiltCards = document.querySelectorAll(
    ".destination-card, .package-card"
  );
  
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener("mouseleave", function () {
      this.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  });
}

/* Scroll Triggers - Fade in elements, progress indicators */
function initScrollTriggers() {
  // Progress bar on scroll
  createScrollProgressBar();
  
  // Fade-in on scroll for additional elements
  const fadeElements = document.querySelectorAll(
    ".hero-content > *, .section-heading, .price-block, .testimonial-text"
  );
  
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }
  );
  
  fadeElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    fadeObserver.observe(el);
  });
  
  // Section entrance animations
  const sections = document.querySelectorAll(".section");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          
          // Trigger stagger animation for children
          const children = entry.target.querySelectorAll(
            ".destination-card, .package-card, .why-card, .testimonial-card"
          );
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = "1";
              child.style.transform = "translateY(0)";
            }, index * 80);
          });
        }
      });
    },
    {
      threshold: 0.15
    }
  );
  
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* Create Scroll Progress Bar */
function createScrollProgressBar() {
  // Check if progress bar already exists
  if (document.getElementById("scroll-progress-bar")) return;
  
  const progressBar = document.createElement("div");
  progressBar.id = "scroll-progress-bar";
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #7c3aed, #0ea5e9);
    z-index: 9999;
    transition: width 0.1s.ease;
    box-shadow: 0 2px 10px rgba(124, 58, 237, 0.5);
  `.replace("0.1s.ease", "0.1s ease");
  document.body.appendChild(progressBar);
  
  // Update progress on scroll
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + "%";
  };
  
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

/* Animated Number Counter - For any element with data-count attribute */
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  
  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.floor(start + (target - start) * eased);
    
    element.textContent = current.toLocaleString("en-IN");
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  
  requestAnimationFrame(step);
}

/* Lazy Load Images with Intersection Observer */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll("img[loading='lazy']");
  
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src; // Trigger load
            img.classList.add("lazy-loaded");
            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px 0px"
      }
    );
    
    lazyImages.forEach((img) => imageObserver.observe(img));
  }
}

/* Smooth Page Transitions */
function initPageTransitions() {
  // Add fade-in to body on load
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s.ease";
  document.body.style.transition = "opacity 0.5s ease";
  
  window.addEventListener("load", () => {
    document.body.style.opacity = "1";
  });
  
  // Smooth exit on navigation (for internal links)
  document.querySelectorAll("a[href$='.html']").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.hostname === window.location.hostname) {
        e.preventDefault();
        const href = this.getAttribute("href");
        
        document.body.style.opacity = "0";
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });
}

/* Floating Action Hints */
function initFloatingHints() {
  // Add subtle pulse to important CTAs after delay
  setTimeout(() => {
    const primaryCtas = document.querySelectorAll(
      ".nav-cta, .search-btn, .ai-chat-toggle"
    );
    
    primaryCtas.forEach((cta) => {
      cta.style.animation = "subtle-pulse 2s ease-in-out infinite";
    });
    
    // Add CSS animation if not exists
    if (!document.getElementById("subtle-pulse-style")) {
      const style = document.createElement("style");
      style.id = "subtle-pulse-style";
      style.textContent = `
        @keyframes subtle-pulse {
          0%, 100% {
            box-shadow: 0 6px 20px rgba(14, 165, 233, 0.25);
          }
          50% {
            box-shadow: 0 8px 30px rgba(14, 165, 233, 0.4);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, 3000);
}

/* Keyboard Navigation Enhancement */
function initKeyboardNav() {
  // Add keyboard shortcut hints
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      const searchInput = document.getElementById("where");
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    
    // Escape to close chat
    if (e.key === "Escape") {
      const chatContainer = document.querySelector(".ai-chat-container");
      const chatToggle = document.querySelector(".ai-chat-toggle");
      if (chatContainer && chatContainer.classList.contains("is-open")) {
        chatContainer.classList.remove("is-open");
        if (chatToggle) {
          chatToggle.classList.remove("is-open");
        }
      }
    }
    
    // Ctrl/Cmd + H to open chat
    if ((e.ctrlKey || e.metaKey) && e.key === "h") {
      e.preventDefault();
      const chatToggle = document.querySelector(".ai-chat-toggle");
      if (chatToggle) {
        chatToggle.click();
      }
    }
  });
  
  // Add focus visible styles programmatically for better UX
  const style = document.createElement("style");
  style.textContent = `
    *:focus {
      outline: 2px solid rgba(124, 58, 237, 0.5);
      outline-offset: 2px;
    }
    
    *:focus:not(:focus-visible) {
      outline: none;
    }
  `;
  document.head.appendChild(style);
}

/* Mouse Trail Effect (Subtle) */
function initMouseTrail() {
  const trail = [];
  const trailLength = 8;
  
  document.addEventListener("mousemove", (e) => {
    // Create trail dot
    const dot = document.createElement("div");
    dot.className = "mouse-trail-dot";
    dot.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(14, 165, 233, 0.3));
      pointer-events: none;
      z-index: 9998;
      left: ${e.clientX - 3}px;
      top: ${e.clientY - 3}px;
      animation: trail-fade 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(dot);
    trail.push(dot);
    
    // Remove old dots
    if (trail.length > trailLength) {
      const oldDot = trail.shift();
      if (oldDot) oldDot.remove();
    }
  });
  
  // Add trail fade animation
  if (!document.getElementById("trail-fade-style")) {
    const style = document.createElement("style");
    style.id = "trail-fade-style";
    style.textContent = `
      @keyframes trail-fade {
        to {
          opacity: 0;
          transform: scale(0.5);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/* Toast Notifications */
function showToast(message, type = "info", duration = 3000) {
  // Create toast container if not exists
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toast = document.createElement("div");
  toast.className = "toast";
  
  const bgColors = {
    info: "linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(6, 182, 212, 0.95))",
    success: "linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95))",
    warning: "linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95))",
    error: "linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))"
  };
  
  toast.style.cssText = `
    background: ${bgColors[type] || bgColors.info};
    color: white;
    padding: 14px 18px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    font-weight: 500;
    max-width: 320px;
    animation: toast-slide-in 0.3s ease-out;
    backdrop-filter: blur(10px);
  `;
  
  toast.textContent = message;
  toastContainer.appendChild(toast);
  
  // Add slide-in animation
  if (!document.getElementById("toast-animation-style")) {
    const style = document.createElement("style");
    style.id = "toast-animation-style";
    style.textContent = `
      @keyframes toast-slide-in {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes toast-slide-out {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100px);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.animation = "toast-slide-out 0.3s ease-out";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/* Performance Monitoring */
function initPerformanceMonitoring() {
  if ("PerformanceObserver" in window) {
    // Monitor largest contentful paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log("LCP:", lastEntry.renderTime || lastEntry.loadTime);
    });
    
    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      // Browser doesn't support this metric
    }
  }
  
  // Log page load time
  window.addEventListener("load", () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log("Page load time:", pageLoadTime + "ms");
  });
}

/* Initialize all new features on load */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize lazy loading
  initLazyLoading();
  
  // Initialize page transitions
  initPageTransitions();
  
  // Initialize floating hints after delay
  initFloatingHints();
  
  // Initialize keyboard navigation
  initKeyboardNav();
  
  // Initialize mouse trail (optional - can be disabled for performance)
  // initMouseTrail();
  
  // Initialize performance monitoring (dev only)
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    initPerformanceMonitoring();
  }
});

/* Export utility functions for use elsewhere */
window.KPMUtils = {
  showToast,
  animateCounter,
  callAiApi
};

// ==================
// Razorpay TEST payment integration (uses rzp_test_RkFoZ8ffEMkACn)
// ==================

function initRazorpayTestPayment() {
  // NOTE: key_secret must NEVER be used on frontend (even in test).
  // Only the test key_id is used here.
  const payBtn = document.getElementById("rzp-button1");
  if (!payBtn) return;

  if (typeof Razorpay === "undefined") {
    console.warn("Razorpay script not loaded. Please add checkout.js in HTML.");
    return;
  }

  // Base options for test payment
  const options = {
    key: "rzp_test_RkFoZ8ffEMkACn", // test key_id
    amount: 10000, // default: 100.00 INR in paise (will be overridden if data-amount is present)
    currency: "INR",
    name: "KPM Global Holidays",
    description: "Test Booking Payment",
    handler: function (response) {
      // On successful payment (TEST mode)
      if (window.KPMUtils && typeof window.KPMUtils.showToast === "function") {
        window.KPMUtils.showToast(
          "Test payment successful! ID: " + response.razorpay_payment_id,
          "success",
          5000
        );
      } else {
        alert("Test payment successful! Payment ID: " + response.razorpay_payment_id);
      }
    },
    prefill: {
      name: "",
      email: "",
      contact: ""
    },
    theme: {
      color: "#0ea5e9"
    }
  };

  // Click on pay button -> open Razorpay Checkout
  payBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Dynamic amount from button if provided (data-amount in paise)
    var btnAmount = parseInt(payBtn.getAttribute("data-amount"), 10);
    if (!isNaN(btnAmount) && btnAmount > 0) {
      options.amount = btnAmount;
    }

    // Prefill from form fields if they exist
    var nameField = document.getElementById("fullName");
    var emailField = document.getElementById("email");
    var phoneField = document.getElementById("phone");

    if (nameField) options.prefill.name = nameField.value || "";
    if (emailField) options.prefill.email = emailField.value || "";
    if (phoneField) options.prefill.contact = phoneField.value || "";

    var rzp = new Razorpay(options);
    rzp.open();
  });
}

// Initialize Razorpay test payment on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  initRazorpayTestPayment();
});

document.getElementById("navToggle").addEventListener("click", () => {
  const nav = document.getElementById("primaryNav");
  nav.classList.toggle("open");
});

// --- NEW CODE END ---
