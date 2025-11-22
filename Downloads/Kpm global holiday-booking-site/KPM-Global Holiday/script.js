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
