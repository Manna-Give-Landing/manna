/* =========================================================
   MANNA — App Logic
   Interactions, form handling, scroll animations
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Header scroll effect ---------- */
  var header = document.getElementById("site-header");

  function onScroll() {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.mobile-menu-toggle');
  var panel = document.querySelector('#mobile-nav');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      panel.hidden = !isOpen;
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      });
    });
  }

  /* ---------- Form handling ---------- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleFormSubmit(formId, emailId, successId) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById(emailId);
      var email = input.value.trim();

      if (!isValidEmail(email)) {
        input.style.borderColor = "#e74c3c";
        setTimeout(function () { input.style.borderColor = ""; }, 2000);
        return;
      }

      console.log("Waitlist signup:", email);

      var successEl = document.getElementById(successId);
      if (successEl) successEl.hidden = false;
      input.value = "";

      setTimeout(function () {
        if (successEl) successEl.hidden = true;
      }, 5000);
    });
  }

  handleFormSubmit("hero-form", "hero-email", "hero-form-success");
  handleFormSubmit("cta-form", "cta-email", "cta-form-success");

  /* ---------- Subscription Alerts form ---------- */
  var alertForm = document.getElementById("subscription-alerts-form");
  if (alertForm) {
    alertForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = alertForm.querySelector('input[name="email"]');
      var email = input.value.trim();
      if (!isValidEmail(email)) {
        input.style.borderColor = "#e74c3c";
        setTimeout(function () { input.style.borderColor = ""; }, 2000);
        return;
      }
      console.log("Subscription alert signup:", email);
      var successEl = document.getElementById("footer-alert-success");
      if (successEl) successEl.hidden = false;
      input.value = "";
      setTimeout(function () { if (successEl) successEl.hidden = true; }, 5000);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var reveals = document.querySelectorAll(".reveal");

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      reveals.forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true
            }
          }
        );
      });

    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      reveals.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------- FAQ Accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var trigger = item.querySelector(".faq-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("faq-item--open");
      faqItems.forEach(function (other) {
        other.classList.remove("faq-item--open");
        var btn = other.querySelector(".faq-trigger");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("faq-item--open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Contact modal ---------- */
  var contactModal = document.getElementById("investor-modal");
  var contactClose = document.getElementById("investor-modal-close");
  var contactForm = document.getElementById("investor-form");

  function openContactModal(reason) {
    if (!contactModal) return;
    contactModal.hidden = false;
    var reasonSelect = document.getElementById("inv-reason");
    if (reasonSelect && reason) reasonSelect.value = reason;
  }

  document.querySelectorAll(".contact-cta-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openContactModal("");
    });
  });

  if (contactModal) {
    if (contactClose) {
      contactClose.addEventListener("click", function () {
        contactModal.hidden = true;
      });
    }

    contactModal.addEventListener("click", function (e) {
      if (e.target === contactModal) {
        contactModal.hidden = true;
      }
    });

    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailInput = document.getElementById("inv-email");
        if (emailInput && !isValidEmail(emailInput.value.trim())) {
          emailInput.style.borderColor = "#e74c3c";
          setTimeout(function () { emailInput.style.borderColor = ""; }, 2000);
          return;
        }
        console.log("Contact inquiry submitted");
        var successEl = document.getElementById("investor-form-success");
        if (successEl) successEl.hidden = false;
        contactForm.reset();
        setTimeout(function () {
          if (successEl) successEl.hidden = true;
          contactModal.hidden = true;
        }, 3000);
      });
    }
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#") return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  /* ---------- Legal Modals ---------- */
  var legalContent = {
    privacy: {
      title: "Privacy Policy",
      body: '<p>This Privacy Policy describes how MANNA Platform LLC (\u201cMANNA,\u201d \u201cwe,\u201d or \u201cour\u201d) handles information collected through the mannagive.network website (the \u201cSite\u201d).</p>'
        + '<hr>'
        + '<h2>What We Collect</h2>'
        + '<p>When you visit the Site, we may collect basic usage information such as browser type, device information, IP address, and pages visited. If you submit your email address through a signup or contact form, we collect that as well.</p>'
        + '<p>We may use cookies or similar technologies to understand how visitors interact with the Site. You can disable cookies through your browser settings at any time.</p>'
        + '<hr>'
        + '<h2>How We Use It</h2>'
        + '<p>We use the information we collect to operate and improve the Site, respond to inquiries, send updates you have opted into, and understand how visitors use the Site.</p>'
        + '<p>We do not sell your personal information.</p>'
        + '<hr>'
        + '<h2>Third Parties</h2>'
        + '<p>We may use third-party services for analytics and email delivery. These providers only receive the information necessary to perform their services and are required to protect it.</p>'
        + '<hr>'
        + '<h2>Your Rights</h2>'
        + '<p>You may contact us at any time to request access to, correction of, or deletion of any personal information we hold about you.</p>'
        + '<hr>'
        + '<h2>Changes</h2>'
        + '<p>We may update this policy from time to time. Changes take effect when posted to the Site.</p>'
        + '<hr>'
        + '<h2>Contact</h2>'
        + '<p>Questions about this policy can be directed to <a href="mailto:info@mannagive.org">info@mannagive.org</a>.</p>'
    },
    terms: {
      title: "Terms of Service",
      body: '<p>These Terms govern your use of the mannagive.network website (the \u201cSite\u201d), operated by MANNA Platform LLC (\u201cMANNA,\u201d \u201cwe,\u201d or \u201cour\u201d). By using the Site, you agree to these Terms.</p>'
        + '<hr>'
        + '<h2>Use of the Site</h2>'
        + '<p>This Site is provided for informational purposes. You agree to use it lawfully and not to interfere with its operation, attempt unauthorized access, or misrepresent your identity.</p>'
        + '<hr>'
        + '<h2>Intellectual Property</h2>'
        + '<p>All content on the Site, including text, graphics, logos, and design, is the property of MANNA Platform LLC and is protected by applicable intellectual property laws. You may not copy, modify, or distribute any content without our written consent.</p>'
        + '<hr>'
        + '<h2>No Warranty</h2>'
        + '<p>The Site is provided \u201cas is\u201d without warranties of any kind. We do not guarantee that the Site will be available without interruption or free of errors.</p>'
        + '<hr>'
        + '<h2>Limitation of Liability</h2>'
        + '<p>To the fullest extent permitted by law, MANNA Platform LLC shall not be liable for any damages arising from your use of the Site.</p>'
        + '<hr>'
        + '<h2>Privacy</h2>'
        + '<p>Your use of the Site is also subject to our <a href="#" data-modal="privacy">Privacy Policy</a>.</p>'
        + '<hr>'
        + '<h2>Changes</h2>'
        + '<p>We may update these Terms at any time. Changes take effect when posted to the Site. Continued use of the Site after changes constitutes acceptance.</p>'
        + '<hr>'
        + '<h2>Governing Law</h2>'
        + '<p>These Terms are governed by the laws of the State of New Mexico.</p>'
        + '<hr>'
        + '<h2>Contact</h2>'
        + '<p>Questions about these Terms can be directed to <a href="mailto:info@mannagive.org">info@mannagive.org</a>.</p>'
    }
  };

  var overlay = document.getElementById("legal-overlay");
  var modalTitle = document.getElementById("legal-modal-title");
  var modalBody = document.getElementById("legal-modal-body");
  var triggerEl = null;

  function openLegalModal(type) {
    var data = legalContent[type];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;
    overlay.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    // Force reflow then add visible class for animation
    void overlay.offsetHeight;
    overlay.classList.add("is-visible");
    overlay.querySelector(".legal-modal-close").focus();
  }

  function closeLegalModal() {
    overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
    overlay.addEventListener("transitionend", function handler() {
      overlay.removeEventListener("transitionend", handler);
      overlay.setAttribute("hidden", "");
    });
    if (triggerEl) { triggerEl.focus(); triggerEl = null; }
  }

  // Trigger links
  document.addEventListener("click", function(e) {
    var link = e.target.closest("[data-modal]");
    if (link) {
      e.preventDefault();
      triggerEl = link;
      openLegalModal(link.getAttribute("data-modal"));
    }
  });

  // Close button
  overlay.querySelector(".legal-modal-close").addEventListener("click", closeLegalModal);

  // Backdrop click
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) closeLegalModal();
  });

  // Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && !overlay.hasAttribute("hidden")) closeLegalModal();
  });

  // Focus trap
  overlay.addEventListener("keydown", function(e) {
    if (e.key !== "Tab") return;
    var focusable = overlay.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- Init ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    setTimeout(initReveal, 100);
  }

})();
