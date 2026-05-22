// Import CSS structure so Vite processes Tailwind styles
import "./index.css";

// 1. STATS TICKER INCREMENT ANIMATION
// Ticks numbers from 0 up to their respective values nicely once they come in view
function initStatsCounters() {
  const statElements = document.querySelectorAll("[data-target]");
  
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, { threshold: 0.5 });

    statElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    statElements.forEach(el => animateCounter(el));
  }
}

function animateCounter(element) {
  const targetAttr = element.getAttribute("data-target");
  if (!targetAttr) return;
  
  const target = parseFloat(targetAttr);
  const duration = 2000; // Animation duration in milliseconds
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // EaseOutQuad function for pleasant slowing-down effect
    const easeProgress = progress * (2 - progress);
    const currentValue = Math.floor(easeProgress * target);

    element.textContent = currentValue.toString();

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = target.toString(); // Ensure perfect match at end
    }
  }

  requestAnimationFrame(updateCount);
}


// 2. MOBILE HAMBURGER COLLAPSIBILITY MENU OVERLAY CONTROLS
function initMobileMenu() {
  const burgerToggle = document.getElementById("mobile-menu-toggle");
  const menuCloseBtn = document.getElementById("mobile-menu-close");
  const overlay = document.getElementById("mobile-menu-overlay");
  const panel = document.getElementById("mobile-menu-panel");
  const links = document.querySelectorAll(".mobile-nav-link");

  function openMenu() {
    if (!overlay || !panel) return;
    overlay.classList.remove("opacity-0", "pointer-events-none");
    panel.classList.remove("translate-x-full");
  }

  function closeMenu() {
    if (!overlay || !panel) return;
    overlay.classList.add("opacity-0", "pointer-events-none");
    panel.classList.add("translate-x-full");
  }

  if (burgerToggle && overlay && panel && menuCloseBtn) {
    burgerToggle.addEventListener("click", openMenu);
    menuCloseBtn.addEventListener("click", closeMenu);
    
    // Click outside also closes
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeMenu();
      }
    });

    // Close on navigation click
    links.forEach(link => {
      link.addEventListener("click", closeMenu);
    });
  }
}


// 3. TOAST MICRO-SYSTEM FEEDBACK ON ACTIONS
function initToastFeedback() {
  const toast = document.getElementById("interactive-toast");
  const toastMsg = document.getElementById("toast-message");
  
  const downloadCvBtns = [
    document.getElementById("download-cv-btn"),
    document.getElementById("mobile-cv-cta")
  ];
  
  const contactCta = document.getElementById("hero-contact-cta");
  const aboutCta = document.getElementById("about-more-btn");
  
  function triggerToast(text) {
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = text;
    toast.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
    toast.classList.add("opacity-100", "translate-y-0");

    setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
    }, 3500);
  }

  downloadCvBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener("click", () => {
        triggerToast("CV download initiated successfully!");
      });
    }
  });

  if (contactCta) {
    contactCta.addEventListener("click", () => {
      triggerToast("Opening portfolio contacts...");
    });
  }

  if (aboutCta) {
    aboutCta.addEventListener("click", () => {
      triggerToast("Navigating to detailed background...");
    });
  }
}


// 4. ON WINDOW SCROLL STYLES TWEAK
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (header) {
    if (window.scrollY > 40) {
      header.classList.add("shadow-xl", "py-2.5", "bg-dark-bg/85");
      header.classList.remove("py-4");
    } else {
      header.classList.remove("shadow-xl", "bg-dark-bg/85");
      header.classList.add("py-4");
    }
  }
});


// RUN INITIALIZATIONS IMMEDIATELY (since type="module" scripts are deferred by default)
initStatsCounters();
initMobileMenu();
initToastFeedback();
