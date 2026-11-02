/* RESPAWN ARENA - main.js
   Small progressive enhancements: every page still works if this file fails. */
(function () {
  "use strict";

  // Tell CSS that JavaScript is available (enables reveal animations + mobile menu)
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  // --- Mobile menu toggle ---
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // --- Scroll reveal (IntersectionObserver) ---
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in-view"); });
  }

  // --- Count-up numbers ---
  var counters = document.querySelectorAll("[data-count]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1600, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else { counters.forEach(runCounter); }

  // --- Back-to-top button ---
  var top = document.querySelector(".to-top");
  if (top) {
    window.addEventListener("scroll", function () {
      top.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  // --- Prefill enquiry form when arriving from a product card (?item=...) ---
  var select = document.getElementById("topic");
  var params = new URLSearchParams(window.location.search);
  if (select && params.get("item")) {
    var msg = document.getElementById("message");
    if (msg) msg.value = "Hi Respawn Arena, I'd like to know more about: " + params.get("item");
    select.value = "product";
  }

  // --- Friendly confirmation on form submit (no server in Part 1/2) ---
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var note = form.querySelector(".form-msg");
      if (note) { note.classList.add("show"); note.focus(); }
      form.reset();
    });
  });

  // --- Konami code easter egg: up up down down left right left right B A ---
  var code = [38,38,40,40,37,39,37,39,66,65], pos = 0;
  document.addEventListener("keydown", function (e) {
    pos = (e.keyCode === code[pos]) ? pos + 1 : 0;
    if (pos === code.length) { document.body.classList.toggle("party"); pos = 0; }
  });
})();
