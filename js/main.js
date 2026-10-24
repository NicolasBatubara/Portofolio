/**
 * ═══════════════════════════════════════════════════════
 * PORTFOLIO MAIN SCRIPT — main.js
 * Render konten dari data.js + interaksi UI
 * ═══════════════════════════════════════════════════════
 */

document.addEventListener("DOMContentLoaded", () => {
  // ── 1. Load & Render data dari CMS / default ──────────
  renderPortfolio();

  // ── 2. Theme Toggle ───────────────────────────────────
  initTheme();

  // ── 3. Mobile Menu ────────────────────────────────────
  initMobileMenu();

  // ── 4. Fade-in Animation ──────────────────────────────
  initFadeIn();

  // ── 5. Footer copyright ───────────────────────────────
  initFooter();

  // ── 6. Project Modal ──────────────────────────────────
  initProjectModal();

  // ── 7. Secret CMS Shortcut: Ctrl+Shift+A ─────────────
  initCMSShortcut();
});

/* ══════════════════════════════════════════════════════
   SECRET CMS SHORTCUT — Ctrl + Shift + A
   Tidak tampil di UI, hanya diketahui oleh admin
   ══════════════════════════════════════════════════════ */
function initCMSShortcut() {
  let isOpening = false;
  document.addEventListener("keydown", (e) => {
    // Shortcut: Ctrl + Shift + A (atau Cmd + Shift + A di Mac)
    const isKeyA = e.key.toUpperCase() === "A" || e.code === "KeyA";
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && isKeyA) {
      e.preventDefault();
      if (isOpening) return;
      isOpening = true;
      showCMSAccessToast();
    }
  });
}

function showCMSAccessToast() {
  // Tampilkan toast singkat lalu redirect ke CMS
  let toast = document.getElementById("cmsAccessToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cmsAccessToast";
    toast.className = "toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 0.85rem 1.4rem;
      background: var(--card);
      border: 1px solid var(--border-hover);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--accent2);
      z-index: 9000;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = "⚙️ Membuka CMS...";
  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    window.location.href = "cms.html";
  }, 800);
}

/* ══════════════════════════════════════════════════════
   RENDER PORTFOLIO DARI DATA
   ══════════════════════════════════════════════════════ */
function renderPortfolio() {
  const data = getPortfolioData();
  renderProfile(data.profile);
  renderAbout(data.about);
  renderSkills(data.skills);
  renderProjects(data.projects);
}

function renderProfile(profile) {
  // Nama
  const nameEls = document.querySelectorAll("[data-cms='profile-name']");
  nameEls.forEach((el) => (el.textContent = profile.name));

  // Tagline
  const taglineEl = document.querySelector("[data-cms='profile-tagline']");
  if (taglineEl) taglineEl.textContent = profile.tagline;

  // Description
  const descEl = document.querySelector("[data-cms='profile-description']");
  if (descEl) descEl.textContent = profile.description;

  // Location
  const locEl = document.querySelector("[data-cms='profile-location']");
  if (locEl) locEl.textContent = profile.location;

  // Availability
  const availEl = document.querySelector("[data-cms='profile-availability']");
  if (availEl) availEl.textContent = profile.availability;

  // Currently
  const currEl = document.querySelector("[data-cms='profile-currently']");
  if (currEl) currEl.textContent = profile.currentlyDoing;

  // Links
  const emailLinks = document.querySelectorAll("[data-cms='profile-email']");
  emailLinks.forEach((el) => el.setAttribute("href", "mailto:" + profile.email));

  const githubLinks = document.querySelectorAll("[data-cms='profile-github']");
  githubLinks.forEach((el) => el.setAttribute("href", profile.github));

  const linkedinLinks = document.querySelectorAll("[data-cms='profile-linkedin']");
  linkedinLinks.forEach((el) => el.setAttribute("href", profile.linkedin));

  const igLinks = document.querySelectorAll("[data-cms='profile-instagram']");
  igLinks.forEach((el) => el.setAttribute("href", profile.instagram));

  // Foto profil: prioritas localPhoto, fallback githubPhoto
  const photoEls = document.querySelectorAll("[data-cms='profile-photo']");
  const photoSrc =
    profile.localPhoto && profile.localPhoto.trim() !== ""
      ? profile.localPhoto
      : profile.githubPhoto;
  photoEls.forEach((el) => {
    el.src = photoSrc;
    el.alt = profile.name;
  });

  // OG meta photo
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.setAttribute("content", photoSrc);
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) twitterImage.setAttribute("content", photoSrc);
}

function renderAbout(about) {
  // Paragraf teks
  const aboutTextEl = document.querySelector("[data-cms='about-text']");
  if (aboutTextEl && about.paragraphs) {
    aboutTextEl.innerHTML = about.paragraphs
      .map((p) => `<p>${p}</p>`)
      .join("");
  }

  // Cards
  const cardsContainer = document.querySelector("[data-cms='about-cards']");
  if (cardsContainer && about.cards) {
    cardsContainer.innerHTML = about.cards
      .map(
        (card, i) => `
      <div class="about-card fade-in" ${i > 0 ? 'style="margin-top:1rem"' : ""}>
        <h3>${card.icon} ${card.title}</h3>
        <p>${card.content}</p>
      </div>`
      )
      .join("");
  }

  // Highlights / Check pills
  const highlightsEl = document.querySelector("[data-cms='about-highlights']");
  if (highlightsEl && about.highlights) {
    highlightsEl.innerHTML = about.highlights
      .map((h) => `<div class="skill-tag check-pill">${h}</div>`)
      .join("");
  }
}

function renderSkills(skills) {
  const skillsGrid = document.querySelector("[data-cms='skills-grid']");
  if (!skillsGrid) return;
  skillsGrid.innerHTML = skills
    .map((s) => `<div class="skill-tag">${s}</div>`)
    .join("");
}

function renderProjects(projects) {
  const grid = document.querySelector("[data-cms='projects-grid']");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (proj) => `
    <div class="project-card fade-in" data-project-id="${proj.id}" onclick="openProjectModal('${proj.id}')">
      <div class="project-label">${proj.label}</div>
      <h3>${proj.title}</h3>
      <p>${proj.description}</p>
      <div class="project-tags">
        ${proj.tags.map((t) => `<span class="project-tag">${t}</span>`).join("")}
      </div>
      <div class="project-card-footer">
        ${
          proj.githubUrl
            ? `<a href="${proj.githubUrl}" class="project-link" target="_blank" onclick="event.stopPropagation()">View on GitHub →</a>`
            : `<span></span>`
        }
        <button class="project-detail-btn" onclick="event.stopPropagation(); openProjectModal('${proj.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Lihat Detail
        </button>
      </div>
    </div>`
    )
    .join("");

  // Re-init fade-in untuk elemen baru
  initFadeIn();
}

/* ══════════════════════════════════════════════════════
   PROJECT MODAL
   ══════════════════════════════════════════════════════ */
function initProjectModal() {
  const overlay = document.getElementById("projectModalOverlay");
  if (!overlay) return;

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeProjectModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });
}

function openProjectModal(projectId) {
  const data = getPortfolioData();
  const proj = data.projects.find((p) => p.id === projectId);
  if (!proj) return;

  const overlay = document.getElementById("projectModalOverlay");
  const modal = document.getElementById("projectModal");
  if (!overlay || !modal) return;

  // Bangun konten modal
  const imgSrc = proj.image && proj.image.trim() !== "" ? proj.image : null;

  modal.innerHTML = `
    <div class="project-modal-header">
      ${
        imgSrc
          ? `<img class="project-modal-img" src="${imgSrc}" alt="${proj.title}" onerror="this.parentElement.innerHTML='<div class=\\'project-modal-img-placeholder\\'>${proj.emoji || "💻"}</div>'">`
          : `<div class="project-modal-img-placeholder">${proj.emoji || "💻"}</div>`
      }
      <button class="project-modal-close" onclick="closeProjectModal()" aria-label="Tutup">✕</button>
    </div>
    <div class="project-modal-body">
      <div class="project-modal-label">${proj.label}</div>
      <h3 class="project-modal-title">${proj.title}</h3>
      <p class="project-modal-desc">${proj.detailDescription || proj.description}</p>
      <div class="project-modal-tags">
        ${proj.tags.map((t) => `<span class="project-tag">${t}</span>`).join("")}
      </div>
      <div class="project-modal-footer">
        ${
          proj.githubUrl
            ? `<a href="${proj.githubUrl}" target="_blank" class="btn-primary" style="font-size:0.78rem;padding:0.55rem 1.2rem">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>`
            : ""
        }
        ${
          proj.liveUrl
            ? `<a href="${proj.liveUrl}" target="_blank" class="btn-outline" style="font-size:0.78rem;padding:0.55rem 1.2rem">
                🌐 Live Demo
              </a>`
            : ""
        }
        <button onclick="closeProjectModal()" class="btn-outline" style="font-size:0.78rem;padding:0.55rem 1.2rem;margin-left:auto">
          Tutup
        </button>
      </div>
    </div>
  `;

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  const overlay = document.getElementById("projectModalOverlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

/* ══════════════════════════════════════════════════════
   THEME TOGGLE
   ══════════════════════════════════════════════════════ */
function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  const currentTheme =
    savedTheme ||
    document.documentElement.getAttribute("data-theme") ||
    "dark";

  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      applyTheme(themeToggle.checked ? "light" : "dark");
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.checked = theme === "light";
  localStorage.setItem("theme", theme);
}

/* ══════════════════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileClose");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => mobileMenu.classList.add("open"));
  mobileClose &&
    mobileClose.addEventListener("click", () =>
      mobileMenu.classList.remove("open")
    );
  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") mobileMenu.classList.remove("open");
  });
}

/* ══════════════════════════════════════════════════════
   FADE-IN ANIMATION
   ══════════════════════════════════════════════════════ */
function initFadeIn() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in:not(.visible)").forEach((el) => {
    observer.observe(el);
  });
}

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
function initFooter() {
  const footerEl = document.getElementById("footerCopyright");
  if (footerEl) {
    const data = getPortfolioData();
    const year = new Date().getFullYear();
    footerEl.innerHTML = `&copy; ${year} ${data.profile.name}. All rights reserved.`;
  }
}
