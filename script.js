(function () {
  // Dynamic year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle
  (function () {
    var toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "light" || (!stored && !prefersDark)) {
      document.documentElement.classList.add("light");
    }
    function applyTheme(isLight) {
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = isLight ? "#f8fafc" : "#07111d";
    }
    applyTheme(document.documentElement.classList.contains("light"));
    toggle.addEventListener("click", function () {
      document.documentElement.classList.toggle("light");
      var isLight = document.documentElement.classList.contains("light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      applyTheme(isLight);
    });
  })();

  // Mobile nav
  (function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav-links");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open");
      document.body.classList.toggle("nav-open");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });
  })();

  // Scroll progress bar
  (function () {
    var bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var h = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = h > 0 ? (window.scrollY / h) * 100 + "%" : "0%";
          ticking = false;
        });
        ticking = true;
      }
    });
  })();

  // Back to top
  (function () {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 300);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  })();

  // Scroll reveal
  (function () {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) {
      observer.observe(el);
    });
  })();

  // Project filter (projects page only)
  (function () {
    var filterEl = document.getElementById("project-filter");
    var cards = document.querySelectorAll(".card-grid .card");
    if (!filterEl || !cards.length) return;
    filterEl.addEventListener("change", function () {
      var val = filterEl.value;
      cards.forEach(function (card) {
        var tags = card.getAttribute("data-tags") || "";
        if (!val || tags.split(",").indexOf(val) !== -1) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  })();
})();
