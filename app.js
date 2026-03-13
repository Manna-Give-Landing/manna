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
  var menuBtn = document.getElementById("mobile-menu-btn");
  var nav = document.getElementById("header-nav");

  menuBtn.addEventListener("click", function () {
    var expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    menuBtn.classList.toggle("active");
    nav.classList.toggle("open");
  });

  // Close mobile nav when clicking a link
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    });
  });

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

      // Show success state
      var successEl = document.getElementById(successId);
      if (successEl) {
        successEl.hidden = false;
      }
      input.value = "";

      // Hide success after a few seconds
      setTimeout(function () {
        if (successEl) successEl.hidden = true;
      }, 5000);
    });
  }

  handleFormSubmit("hero-form", "hero-email", "hero-form-success");
  handleFormSubmit("cta-form", "cta-email", "cta-form-success");

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var reveals = document.querySelectorAll(".reveal");

    // If GSAP + ScrollTrigger are available, use them
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      reveals.forEach(function (el, i) {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true
            }
          }
        );
      });

      // Stagger animation on plan cards
      var planCards = document.querySelectorAll(".plan-card");
      if (planCards.length) {
        gsap.fromTo(planCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: planCards[0],
              start: "top 88%",
              once: true
            }
          }
        );
      }

      // Stagger on mini-cards
      var miniCards = document.querySelectorAll(".mini-card");
      if (miniCards.length) {
        gsap.fromTo(miniCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: miniCards[0],
              start: "top 88%",
              once: true
            }
          }
        );
      }

      // Trust strip entrance
      var trustMarks = document.querySelectorAll(".trust-mark");
      if (trustMarks.length) {
        gsap.fromTo(trustMarks,
          { opacity: 0, y: 10 },
          {
            opacity: 0.35,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: trustMarks[0],
              start: "top 92%",
              once: true
            }
          }
        );
      }

    } else {
      // Fallback: IntersectionObserver
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
      // Close all
      faqItems.forEach(function (other) {
        other.classList.remove("faq-item--open");
        var btn = other.querySelector(".faq-trigger");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
      // Toggle current
      if (!isOpen) {
        item.classList.add("faq-item--open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

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

  /* ---------- Init after load ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    // Small delay to let GSAP scripts load (they're deferred)
    setTimeout(initReveal, 100);
  }

})();
