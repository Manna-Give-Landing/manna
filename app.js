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

  /* ---------- Init ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    setTimeout(initReveal, 100);
  }

})();
