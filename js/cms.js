/**
 * ═══════════════════════════════════════════════════════
 * CMS SCRIPT — cms.js
 * Content Management System untuk Portofolio Nicolas
 * ═══════════════════════════════════════════════════════
 *
 * Fitur:
 *  - Login dengan password (disimpan di localStorage)
 *  - CRUD: About Me, Technical Skills, Featured Projects
 *  - Upload / path gambar profil dan proyek
 *  - Perubahan langsung tersimpan di localStorage
 *  - Dashboard statistik
 *  - Ganti password
 *  - Reset ke data default
 */

/* ── PASSWORD DEFAULT (Ganti di halaman Settings CMS) ── */
const DEFAULT_PASSWORD = "nicolas2024";
const PASSWORD_KEY = "cms_password";
const SESSION_KEY = "cms_session";
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 jam

/* ══════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initCMSTheme();
  checkSession();
  initLoginForm();
});

/* ══════════════════════════════════════════════════════
   THEME
   ══════════════════════════════════════════════════════ */
function initCMSTheme() {
  const stored = localStorage.getItem("theme");
  const theme = stored || "dark";
  document.documentElement.setAttribute("data-theme", theme);

  const toggle = document.getElementById("cmsThemeToggle");
  if (toggle) {
    toggle.checked = theme === "light";
    toggle.addEventListener("change", () => {
      const t = toggle.checked ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", t);
      localStorage.setItem("theme", t);
    });
  }
}

/* ══════════════════════════════════════════════════════
   SESSION / AUTH
   ══════════════════════════════════════════════════════ */
function getPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
}

function checkSession() {
  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    try {
      const parsed = JSON.parse(session);
      if (parsed && parsed.expiry && Date.now() < parsed.expiry) {
        showCMSApp();
        return;
      }
    } catch (e) {
      // Sesi rusak / tidak valid
    }
  }
  destroySession();
  showLogin();
}

function createSession() {
  const session = { expiry: Date.now() + SESSION_DURATION };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function destroySession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

function showLogin() {
  const overlay = document.getElementById("loginOverlay");
  const cmsApp = document.getElementById("cmsApp");
  if (overlay) overlay.style.display = "flex";
  if (cmsApp) cmsApp.classList.remove("visible");

  const pwInput = document.getElementById("loginPassword");
  if (pwInput) {
    pwInput.value = "";
    setTimeout(() => pwInput.focus(), 100);
  }
  const errEl = document.getElementById("loginError");
  if (errEl) errEl.classList.remove("show");
}

function showCMSApp() {
  document.getElementById("loginOverlay").style.display = "none";
  document.getElementById("cmsApp").classList.add("visible");
  initCMSApp();
}

function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const pw = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");

    if (pw === getPassword()) {
      createSession();
      errorEl.classList.remove("show");
      showCMSApp();
    } else {
      errorEl.textContent = "❌ Password salah. Coba lagi.";
      errorEl.classList.add("show");
      document.getElementById("loginPassword").value = "";
    }
  });

  // Toggle show/hide password
  const toggleBtn = document.getElementById("togglePassword");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const input = document.getElementById("loginPassword");
      input.type = input.type === "password" ? "text" : "password";
      toggleBtn.textContent = input.type === "password" ? "👁️" : "🙈";
    });
  }
}

function cmsLogout() {
  destroySession();
  window.location.href = "index.html";
}

/* ══════════════════════════════════════════════════════
   CMS APP INIT
   ══════════════════════════════════════════════════════ */
function initCMSApp() {
  renderDashboard();
  initSidebar();
  initMobileSidebarToggle();

  // Default: tampilkan dashboard
  switchPanel("dashboard");
}

/* ══════════════════════════════════════════════════════
   SIDEBAR NAVIGATION
   ══════════════════════════════════════════════════════ */
function initSidebar() {
  document.querySelectorAll(".sidebar-link[data-panel]").forEach((link) => {
    link.addEventListener("click", () => {
      const panel = link.getAttribute("data-panel");
      switchPanel(panel);
      // Tutup sidebar di mobile
      document.querySelector(".cms-sidebar").classList.remove("open");
    });
  });
}

function switchPanel(panelName) {
  // Update sidebar active
  document.querySelectorAll(".sidebar-link[data-panel]").forEach((l) => {
    l.classList.toggle("active", l.getAttribute("data-panel") === panelName);
  });

  // Sembunyikan semua panel
  document.querySelectorAll(".cms-panel").forEach((p) => p.classList.remove("active"));

  // Tampilkan panel target
  const target = document.getElementById("panel-" + panelName);
  if (target) {
    target.classList.add("active");
    // Render isi panel
    renderPanel(panelName);
  }

  // Update topbar title
  const titles = {
    dashboard: "Dashboard",
    profile: "Profil & Foto",
    about: "About Me",
    skills: "Technical Skills",
    projects: "Featured Projects",
    settings: "Pengaturan",
  };
  const topbarTitle = document.querySelector(".cms-topbar-title");
  if (topbarTitle) topbarTitle.textContent = titles[panelName] || panelName;
}

function renderPanel(name) {
  switch (name) {
    case "dashboard": renderDashboard(); break;
    case "profile": renderProfilePanel(); break;
    case "about": renderAboutPanel(); break;
    case "skills": renderSkillsPanel(); break;
    case "projects": renderProjectsPanel(); break;
    case "settings": renderSettingsPanel(); break;
  }
}

function initMobileSidebarToggle() {
  const toggleBtn = document.getElementById("sidebarToggle");
  const sidebar = document.querySelector(".cms-sidebar");
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Tutup saat klik di luar
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
      sidebar.classList.remove("open");
    }
  });
}

/* ══════════════════════════════════════════════════════
   DASHBOARD
   ══════════════════════════════════════════════════════ */
function renderDashboard() {
  const data = getPortfolioData();
  const el = document.getElementById("panel-dashboard");
  if (!el) return;

  const statsHTML = `
    <div class="cms-stats-grid">
      <div class="cms-stat-card">
        <div class="stat-icon blue">💼</div>
        <div>
          <div class="stat-value">${data.projects.length}</div>
          <div class="stat-label">Proyek</div>
        </div>
      </div>
      <div class="cms-stat-card">
        <div class="stat-icon purple">⚡</div>
        <div>
          <div class="stat-value">${data.skills.length}</div>
          <div class="stat-label">Skills</div>
        </div>
      </div>
      <div class="cms-stat-card">
        <div class="stat-icon green">📝</div>
        <div>
          <div class="stat-value">${data.about.paragraphs.length}</div>
          <div class="stat-label">Paragraf</div>
        </div>
      </div>
      <div class="cms-stat-card">
        <div class="stat-icon orange">🖼️</div>
        <div>
          <div class="stat-value">${data.projects.filter(p => p.image && p.image !== "").length}</div>
          <div class="stat-label">Dengan Foto</div>
        </div>
      </div>
    </div>

    <div class="alert-box info" style="margin-bottom:1rem">
      ℹ️ Selamat datang di CMS Portofolio Nicolas. Semua perubahan disimpan otomatis di browser (localStorage).
      Kunjungi halaman portfolio untuk melihat hasilnya.
    </div>

    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">Akses Cepat</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:0.6rem">
        <button class="btn-sm primary" onclick="switchPanel('profile')">✏️ Edit Profil</button>
        <button class="btn-sm" onclick="switchPanel('about')">📄 Edit About</button>
        <button class="btn-sm" onclick="switchPanel('skills')">⚡ Edit Skills</button>
        <button class="btn-sm" onclick="switchPanel('projects')">💼 Edit Proyek</button>
        <a href="index.html" target="_blank" class="btn-sm">🌐 Lihat Portfolio</a>
      </div>
    </div>

    <div class="cms-card" style="margin-top:0">
      <div class="cms-card-header">
        <span class="cms-card-title">Profil Saat Ini</span>
      </div>
      <div style="display:flex;align-items:center;gap:1rem">
        <img src="${data.profile.localPhoto || data.profile.githubPhoto}" 
          alt="${data.profile.name}" 
          style="width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--border)"
          onerror="this.src='${data.profile.githubPhoto}'"
        >
        <div>
          <div style="font-family:var(--font-head);font-weight:700">${data.profile.name}</div>
          <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted)">${data.profile.email}</div>
        </div>
      </div>
    </div>
  `;

  const statsContainer = el.querySelector(".dashboard-content");
  if (statsContainer) statsContainer.innerHTML = statsHTML;
}

/* ══════════════════════════════════════════════════════
   PROFILE PANEL
   ══════════════════════════════════════════════════════ */
function renderProfilePanel() {
  const data = getPortfolioData();
  const p = data.profile;
  const el = document.getElementById("profile-form-container");
  if (!el) return;

  const photoSrc = p.localPhoto && p.localPhoto.trim() !== "" ? p.localPhoto : p.githubPhoto;

  el.innerHTML = `
    <!-- Foto Profil -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">📸 Foto Profil</span>
      </div>

      <div class="field-group">
        <label class="field-label">Foto Aktif (Preview)</label>
        <div class="profile-photo-wrapper">
          <img id="profilePhotoPreview" src="${photoSrc}" alt="Preview" class="profile-photo-preview"
            onerror="this.src='${p.githubPhoto}'">
          <div style="flex:1">
            <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.5rem">
              Foto diambil dari <strong style="color:var(--accent)">Local Photo</strong> jika tersedia,
              atau <strong style="color:var(--accent2)">GitHub Photo</strong> sebagai cadangan.
            </div>
          </div>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">Path Foto Lokal</label>
        <div style="display:flex;gap:0.5rem;align-items:center">
          <input type="text" class="field-input" id="profile_localPhoto" 
            value="${p.localPhoto || ""}" 
            placeholder="assets/images/profile/nama-foto.jpg"
            style="flex:1"
          >
          <button class="btn-sm" onclick="previewProfilePhoto('local')" title="Preview">👁️</button>
        </div>
        <div class="field-hint">
          Simpan foto ke folder: <code style="color:var(--accent3)">assets/images/profile/</code> lalu isi path di sini.<br>
          Kosongkan untuk menggunakan foto GitHub.
        </div>
      </div>

      <div class="divider"></div>

      <div class="field-group">
        <label class="field-label">GitHub Photo URL (Cadangan)</label>
        <div style="display:flex;gap:0.5rem;align-items:center">
          <input type="text" class="field-input" id="profile_githubPhoto" 
            value="${p.githubPhoto || ""}" 
            placeholder="https://avatars.githubusercontent.com/u/..."
            style="flex:1"
          >
          <button class="btn-sm" onclick="previewProfilePhoto('github')" title="Preview">👁️</button>
        </div>
        <div class="field-hint">
          URL foto dari GitHub profile. Alternatif cadangan:
          <div style="margin-top:0.3rem;display:flex;flex-wrap:wrap;gap:0.3rem">
            <button class="btn-sm" onclick="setGithubPhotoAlt('https://avatars.githubusercontent.com/u/149449407?v=4')" 
              style="font-size:0.65rem">v=4 (Default)</button>
            <button class="btn-sm" onclick="setGithubPhotoAlt('https://avatars.githubusercontent.com/u/149449407?s=400&v=4')" 
              style="font-size:0.65rem">s=400 (Besar)</button>
            <button class="btn-sm" onclick="setGithubPhotoAlt('https://avatars.githubusercontent.com/u/149449407?s=200&v=4')"
              style="font-size:0.65rem">s=200 (Sedang)</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Identitas -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">👤 Identitas</span>
      </div>
      <div class="field-group">
        <label class="field-label">Nama Lengkap</label>
        <input type="text" class="field-input" id="profile_name" value="${p.name}">
      </div>
      <div class="field-group">
        <label class="field-label">Tagline (Hero Section)</label>
        <input type="text" class="field-input" id="profile_tagline" value="${p.tagline}">
      </div>
      <div class="field-group">
        <label class="field-label">Deskripsi Singkat</label>
        <textarea class="field-textarea" id="profile_description" style="min-height:80px">${p.description}</textarea>
      </div>
      <div class="field-row">
        <div class="field-group">
          <label class="field-label">Lokasi</label>
          <input type="text" class="field-input" id="profile_location" value="${p.location}">
        </div>
        <div class="field-group">
          <label class="field-label">Status Availability</label>
          <input type="text" class="field-input" id="profile_availability" value="${p.availability}">
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Currently Doing</label>
        <textarea class="field-textarea" id="profile_currently" style="min-height:60px">${p.currentlyDoing}</textarea>
      </div>
    </div>

    <!-- Kontak -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">🔗 Link & Kontak</span>
      </div>
      <div class="field-group">
        <label class="field-label">Email</label>
        <input type="email" class="field-input" id="profile_email" value="${p.email}">
      </div>
      <div class="field-group">
        <label class="field-label">GitHub URL</label>
        <input type="url" class="field-input" id="profile_github" value="${p.github}">
      </div>
      <div class="field-group">
        <label class="field-label">LinkedIn URL</label>
        <input type="url" class="field-input" id="profile_linkedin" value="${p.linkedin}">
      </div>
      <div class="field-group">
        <label class="field-label">Instagram URL</label>
        <input type="url" class="field-input" id="profile_instagram" value="${p.instagram}">
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:0.6rem">
      <button class="btn-sm" onclick="renderProfilePanel()">↩ Reset</button>
      <button class="btn-sm primary" onclick="saveProfilePanel()">💾 Simpan Profil</button>
    </div>
  `;
}

function previewProfilePhoto(type) {
  const preview = document.getElementById("profilePhotoPreview");
  let src = "";
  if (type === "local") {
    src = document.getElementById("profile_localPhoto").value.trim();
  } else {
    src = document.getElementById("profile_githubPhoto").value.trim();
  }
  if (src && preview) {
    preview.src = src;
    preview.onerror = () => {
      cmsToast("⚠️ Gambar tidak ditemukan. Periksa path/URL.", "error");
    };
  }
}

function setGithubPhotoAlt(url) {
  const input = document.getElementById("profile_githubPhoto");
  if (input) {
    input.value = url;
    previewProfilePhoto("github");
  }
}

function saveProfilePanel() {
  const data = getPortfolioData();
  data.profile.name = document.getElementById("profile_name").value.trim();
  data.profile.tagline = document.getElementById("profile_tagline").value.trim();
  data.profile.description = document.getElementById("profile_description").value.trim();
  data.profile.location = document.getElementById("profile_location").value.trim();
  data.profile.availability = document.getElementById("profile_availability").value.trim();
  data.profile.currentlyDoing = document.getElementById("profile_currently").value.trim();
  data.profile.email = document.getElementById("profile_email").value.trim();
  data.profile.github = document.getElementById("profile_github").value.trim();
  data.profile.linkedin = document.getElementById("profile_linkedin").value.trim();
  data.profile.instagram = document.getElementById("profile_instagram").value.trim();
  data.profile.localPhoto = document.getElementById("profile_localPhoto").value.trim();
  data.profile.githubPhoto = document.getElementById("profile_githubPhoto").value.trim();

  savePortfolioData(data);
  cmsToast("✅ Profil berhasil disimpan!", "success");
}

/* ══════════════════════════════════════════════════════
   ABOUT PANEL
   ══════════════════════════════════════════════════════ */
function renderAboutPanel() {
  const data = getPortfolioData();
  const about = data.about;
  const el = document.getElementById("about-form-container");
  if (!el) return;

  el.innerHTML = `
    <!-- Paragraf About -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">📝 Paragraf Teks</span>
        <div class="cms-card-actions">
          <button class="btn-sm success" onclick="addAboutParagraph()">+ Tambah</button>
        </div>
      </div>
      <div class="list-editor" id="aboutParagraphsList">
        ${about.paragraphs
          .map(
            (p, i) => `
          <div class="list-editor-item" id="aboutPara_${i}">
            <textarea class="field-textarea" id="aboutPara_text_${i}" style="min-height:80px">${p}</textarea>
            <button class="btn-icon" onclick="removeAboutParagraph(${i})" title="Hapus">✕</button>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <!-- Cards -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">🃏 Cards (Education & Focus)</span>
        <button class="btn-sm success" onclick="addAboutCard()">+ Tambah</button>
      </div>
      <div id="aboutCardsList">
        ${about.cards
          .map(
            (c, i) => `
          <div class="cms-card" style="border:1px dashed var(--border);margin-bottom:0.8rem" id="aboutCard_${i}">
            <div class="cms-card-header">
              <span class="cms-card-title" style="font-size:0.82rem">Card #${i + 1}</span>
              <button class="btn-icon" onclick="removeAboutCard(${i})" title="Hapus">✕</button>
            </div>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Icon (Emoji)</label>
                <input type="text" class="field-input" id="aboutCard_icon_${i}" value="${c.icon}" style="font-size:1.2rem">
              </div>
              <div class="field-group">
                <label class="field-label">Judul</label>
                <input type="text" class="field-input" id="aboutCard_title_${i}" value="${c.title}">
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Konten</label>
              <textarea class="field-textarea" id="aboutCard_content_${i}" style="min-height:70px">${c.content}</textarea>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <!-- Highlights -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">✅ Highlights (Check Pills)</span>
        <button class="btn-sm success" onclick="addAboutHighlight()">+ Tambah</button>
      </div>
      <div class="list-editor" id="highlightsList">
        ${about.highlights
          .map(
            (h, i) => `
          <div class="list-editor-item" id="highlight_${i}">
            <input type="text" class="field-input" id="highlight_text_${i}" value="${h}">
            <button class="btn-icon" onclick="removeHighlight(${i})" title="Hapus">✕</button>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:0.6rem">
      <button class="btn-sm" onclick="renderAboutPanel()">↩ Reset</button>
      <button class="btn-sm primary" onclick="saveAboutPanel()">💾 Simpan About</button>
    </div>
  `;
}

function addAboutParagraph() {
  const data = getPortfolioData();
  data.about.paragraphs.push("Isi paragraf baru...");
  savePortfolioData(data);
  renderAboutPanel();
}

function removeAboutParagraph(i) {
  const data = getPortfolioData();
  data.about.paragraphs.splice(i, 1);
  savePortfolioData(data);
  renderAboutPanel();
  cmsToast("🗑️ Paragraf dihapus", "info");
}

function addAboutCard() {
  const data = getPortfolioData();
  data.about.cards.push({ icon: "⭐", title: "Card Baru", content: "Isi card baru..." });
  savePortfolioData(data);
  renderAboutPanel();
}

function removeAboutCard(i) {
  const data = getPortfolioData();
  data.about.cards.splice(i, 1);
  savePortfolioData(data);
  renderAboutPanel();
  cmsToast("🗑️ Card dihapus", "info");
}

function addAboutHighlight() {
  const data = getPortfolioData();
  data.about.highlights.push("Highlight baru");
  savePortfolioData(data);
  renderAboutPanel();
}

function removeHighlight(i) {
  const data = getPortfolioData();
  data.about.highlights.splice(i, 1);
  savePortfolioData(data);
  renderAboutPanel();
  cmsToast("🗑️ Highlight dihapus", "info");
}

function saveAboutPanel() {
  const data = getPortfolioData();

  // Paragraf
  const parasCount = document.querySelectorAll("[id^='aboutPara_text_']").length;
  data.about.paragraphs = [];
  for (let i = 0; i < parasCount; i++) {
    const el = document.getElementById("aboutPara_text_" + i);
    if (el) data.about.paragraphs.push(el.value.trim());
  }

  // Cards
  const cardsCount = document.querySelectorAll("[id^='aboutCard_icon_']").length;
  data.about.cards = [];
  for (let i = 0; i < cardsCount; i++) {
    const icon = document.getElementById("aboutCard_icon_" + i);
    const title = document.getElementById("aboutCard_title_" + i);
    const content = document.getElementById("aboutCard_content_" + i);
    if (icon && title && content) {
      data.about.cards.push({
        icon: icon.value.trim(),
        title: title.value.trim(),
        content: content.value.trim(),
      });
    }
  }

  // Highlights
  const hlCount = document.querySelectorAll("[id^='highlight_text_']").length;
  data.about.highlights = [];
  for (let i = 0; i < hlCount; i++) {
    const el = document.getElementById("highlight_text_" + i);
    if (el) data.about.highlights.push(el.value.trim());
  }

  savePortfolioData(data);
  cmsToast("✅ About Me berhasil disimpan!", "success");
}

/* ══════════════════════════════════════════════════════
   SKILLS PANEL
   ══════════════════════════════════════════════════════ */
function renderSkillsPanel() {
  const data = getPortfolioData();
  const el = document.getElementById("skills-form-container");
  if (!el) return;

  el.innerHTML = `
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">⚡ Daftar Technical Skills</span>
        <div class="cms-card-actions">
          <button class="btn-sm success" onclick="addSkill()">+ Tambah Skill</button>
        </div>
      </div>
      <div class="field-hint" style="margin-bottom:0.8rem">
        Klik ✕ untuk hapus. Tekan Enter di input baru untuk menambah.
        Total saat ini: <strong style="color:var(--accent)">${data.skills.length} skills</strong>
      </div>
      <div class="list-editor" id="skillsList">
        ${data.skills
          .map(
            (s, i) => `
          <div class="list-editor-item" id="skill_${i}">
            <input type="text" class="field-input" id="skill_text_${i}" value="${s}" 
              placeholder="Nama skill..." onkeydown="if(event.key==='Enter'){addSkill();}">
            <button class="btn-icon" onclick="removeSkill(${i})" title="Hapus">✕</button>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <!-- Quick Add -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">➕ Tambah Cepat</span>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
        ${["React", "Vue.js", "Kotlin", "Swift", "Laravel", "Django", "Redis", "GraphQL", "AWS", "Firebase", "Dart", "C++", "Java", "Rust", "TensorFlow", "Kubernetes"]
          .map(s => `<button class="btn-sm" onclick="quickAddSkill('${s}')">${s}</button>`)
          .join("")}
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:0.6rem">
      <button class="btn-sm" onclick="renderSkillsPanel()">↩ Reset</button>
      <button class="btn-sm primary" onclick="saveSkillsPanel()">💾 Simpan Skills</button>
    </div>
  `;
}

function addSkill(value = "") {
  const data = getPortfolioData();
  data.skills.push(value || "Skill Baru");
  savePortfolioData(data);
  renderSkillsPanel();
  // Fokus ke input terakhir
  setTimeout(() => {
    const inputs = document.querySelectorAll("[id^='skill_text_']");
    if (inputs.length) inputs[inputs.length - 1].focus();
  }, 100);
}

function quickAddSkill(name) {
  const data = getPortfolioData();
  if (!data.skills.includes(name)) {
    data.skills.push(name);
    savePortfolioData(data);
    renderSkillsPanel();
    cmsToast(`✅ ${name} ditambahkan!`, "success");
  } else {
    cmsToast(`⚠️ ${name} sudah ada`, "info");
  }
}

function removeSkill(i) {
  const data = getPortfolioData();
  const removed = data.skills[i];
  data.skills.splice(i, 1);
  savePortfolioData(data);
  renderSkillsPanel();
  cmsToast(`🗑️ "${removed}" dihapus`, "info");
}

function saveSkillsPanel() {
  const data = getPortfolioData();
  const count = document.querySelectorAll("[id^='skill_text_']").length;
  data.skills = [];
  for (let i = 0; i < count; i++) {
    const el = document.getElementById("skill_text_" + i);
    if (el && el.value.trim()) {
      data.skills.push(el.value.trim());
    }
  }
  savePortfolioData(data);
  cmsToast("✅ Skills berhasil disimpan!", "success");
  renderSkillsPanel();
}

/* ══════════════════════════════════════════════════════
   PROJECTS PANEL
   ══════════════════════════════════════════════════════ */
function renderProjectsPanel() {
  const data = getPortfolioData();
  const el = document.getElementById("projects-list-container");
  if (!el) return;

  el.innerHTML = data.projects
    .map(
      (proj, i) => `
    <div class="cms-project-card" id="cmsProj_${proj.id}">
      <div class="cms-project-card-img">
        <span style="position:relative;z-index:2">${proj.emoji || "💻"}</span>
        ${proj.image ? `<img src="${proj.image}" alt="${proj.title}" onerror="this.remove()">` : ""}
      </div>
      <div class="cms-project-card-body">
        <div class="cms-project-card-label">${proj.label}</div>
        <div class="cms-project-card-title">${proj.title}</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-top:0.4rem">
          ${proj.tags.slice(0, 3).map(t => `<span style="font-family:var(--font-mono);font-size:0.62rem;padding:0.15rem 0.5rem;background:rgba(99,179,237,0.1);border:1px solid rgba(99,179,237,0.2);border-radius:3px;color:var(--accent)">${t}</span>`).join("")}
          ${proj.tags.length > 3 ? `<span style="font-size:0.62rem;color:var(--text-dim)">+${proj.tags.length - 3}</span>` : ""}
        </div>
      </div>
      <div class="cms-project-card-footer">
        <button class="btn-sm danger" onclick="deleteProject('${proj.id}')">🗑️</button>
        <button class="btn-sm primary" onclick="openProjectEditModal('${proj.id}')">✏️ Edit</button>
      </div>
    </div>`
    )
    .join("");
}

function deleteProject(id) {
  if (!confirm("Hapus proyek ini? Tindakan ini tidak bisa dibatalkan.")) return;
  const data = getPortfolioData();
  data.projects = data.projects.filter((p) => p.id !== id);
  savePortfolioData(data);
  renderProjectsPanel();
  cmsToast("🗑️ Proyek dihapus", "info");
}

function addNewProject() {
  const data = getPortfolioData();
  const newId = "proj-" + Date.now();
  data.projects.push({
    id: newId,
    label: "Full-stack Development",
    title: "Proyek Baru",
    description: "Deskripsi singkat proyek...",
    detailDescription: "Deskripsi lengkap proyek...",
    tags: ["JavaScript"],
    githubUrl: "",
    liveUrl: "",
    image: "",
    emoji: "💻",
  });
  savePortfolioData(data);
  renderProjectsPanel();
  // Langsung buka modal edit untuk proyek baru
  openProjectEditModal(newId);
}

function openProjectEditModal(projId) {
  const data = getPortfolioData();
  const proj = data.projects.find((p) => p.id === projId);
  if (!proj) return;

  const modal = document.getElementById("projectEditModal");
  const overlay = document.getElementById("projectEditOverlay");
  if (!modal || !overlay) return;

  const emojis = ["💻", "🏛️", "🏥", "🍽️", "📊", "🚌", "🎮", "😊", "📚", "🏫", "🌐", "📱", "🔬", "⚙️", "🚀"];

  modal.innerHTML = `
    <div class="cms-modal-header">
      <span class="cms-modal-title">✏️ Edit Proyek</span>
      <button class="cms-modal-close" onclick="closeProjectEditModal()">✕</button>
    </div>
    <div class="cms-modal-body">
      <!-- Gambar Proyek -->
      <div class="field-group">
        <label class="field-label">🖼️ Gambar Proyek</label>
        <div style="display:flex;gap:1rem;align-items:flex-start;flex-wrap:wrap">
          <div style="width:100px;height:80px;border-radius:8px;background:linear-gradient(135deg,var(--bg3),var(--bg2));border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0;position:relative;overflow:hidden">
            <span id="projEmojiPreview">${proj.emoji || "💻"}</span>
            ${proj.image ? `<img id="projImgPreview" src="${proj.image}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" onerror="this.remove()">` : ""}
          </div>
          <div style="flex:1">
            <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem">
              <input type="text" class="field-input" id="proj_image" value="${proj.image || ""}" 
                placeholder="assets/images/projects/nama-gambar.jpg" style="flex:1">
              <button class="btn-sm" onclick="previewProjImg()" title="Preview">👁️</button>
              <button class="btn-sm" onclick="clearProjImg()" title="Hapus">✕</button>
            </div>
            <div class="field-hint">Path gambar dari folder <code style="color:var(--accent3)">assets/images/projects/</code></div>
          </div>
        </div>
        <div style="margin-top:0.6rem">
          <label class="field-label">Emoji Placeholder (jika tidak ada gambar)</label>
          <div style="display:flex;flex-wrap:wrap;gap:0.3rem">
            ${emojis.map(e => `<button class="btn-sm" onclick="setEmoji('${e}')" style="font-size:1.1rem;padding:0.3rem 0.5rem">${e}</button>`).join("")}
          </div>
        </div>
        <input type="hidden" id="proj_emoji" value="${proj.emoji || "💻"}">
      </div>

      <div class="divider"></div>

      <div class="field-group">
        <label class="field-label">Kategori / Label</label>
        <input type="text" class="field-input" id="proj_label" value="${proj.label}">
      </div>
      <div class="field-group">
        <label class="field-label">Judul Proyek</label>
        <input type="text" class="field-input" id="proj_title" value="${proj.title}">
      </div>
      <div class="field-group">
        <label class="field-label">Deskripsi Singkat (ditampilkan di card)</label>
        <textarea class="field-textarea" id="proj_description" style="min-height:75px">${proj.description}</textarea>
      </div>
      <div class="field-group">
        <label class="field-label">Deskripsi Detail (modal "Lihat Detail")</label>
        <textarea class="field-textarea" id="proj_detailDescription" style="min-height:110px">${proj.detailDescription || ""}</textarea>
      </div>
      <div class="field-group">
        <label class="field-label">Teknologi (Tags)</label>
        <div class="tags-editor" id="tagsEditor" onclick="document.getElementById('tagInput').focus()">
          ${proj.tags
            .map(
              (t) =>
                `<span class="tag-chip">${t}<button class="tag-chip-remove" onclick="removeTag('${t.replace(/'/g, "\\'")}')">✕</button></span>`
            )
            .join("")}
          <input type="text" class="tag-input" id="tagInput" placeholder="Ketik & Enter..." 
            onkeydown="handleTagInput(event)">
        </div>
        <div class="field-hint">Ketik nama teknologi lalu tekan Enter untuk menambah</div>
        <input type="hidden" id="proj_tags" value="${proj.tags.join(",")}">
      </div>
      <div class="field-row">
        <div class="field-group">
          <label class="field-label">GitHub URL</label>
          <input type="url" class="field-input" id="proj_github" value="${proj.githubUrl || ""}">
        </div>
        <div class="field-group">
          <label class="field-label">Live Demo URL</label>
          <input type="url" class="field-input" id="proj_live" value="${proj.liveUrl || ""}" placeholder="https://...">
        </div>
      </div>
    </div>
    <div class="cms-modal-footer">
      <button class="btn-sm" onclick="closeProjectEditModal()">Batal</button>
      <button class="btn-sm primary" onclick="saveProjectEdit('${projId}')">💾 Simpan</button>
    </div>
  `;

  overlay.classList.add("open");
  overlay.setAttribute("data-proj-id", projId);
}

function closeProjectEditModal() {
  const overlay = document.getElementById("projectEditOverlay");
  if (overlay) overlay.classList.remove("open");
}

function previewProjImg() {
  const src = document.getElementById("proj_image").value.trim();
  const preview = document.getElementById("projImgPreview");
  if (!src) { cmsToast("Isi path gambar terlebih dahulu", "info"); return; }
  if (!preview) {
    const wrapper = document.getElementById("projEmojiPreview").parentElement;
    const img = document.createElement("img");
    img.id = "projImgPreview";
    img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover";
    img.onerror = () => { cmsToast("⚠️ Gambar tidak ditemukan", "error"); img.remove(); };
    wrapper.appendChild(img);
    img.src = src;
  } else {
    preview.src = src;
    preview.onerror = () => { cmsToast("⚠️ Gambar tidak ditemukan", "error"); };
  }
}

function clearProjImg() {
  document.getElementById("proj_image").value = "";
  const preview = document.getElementById("projImgPreview");
  if (preview) preview.remove();
  cmsToast("Gambar dihapus", "info");
}

function setEmoji(emoji) {
  document.getElementById("proj_emoji").value = emoji;
  const preview = document.getElementById("projEmojiPreview");
  if (preview) preview.textContent = emoji;
}

function handleTagInput(e) {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,$/, "");
    if (val) {
      addTag(val);
      e.target.value = "";
    }
  } else if (e.key === "Backspace" && !e.target.value) {
    // Hapus tag terakhir
    const tagsInput = document.getElementById("proj_tags");
    const tags = tagsInput.value ? tagsInput.value.split(",") : [];
    if (tags.length) {
      tags.pop();
      tagsInput.value = tags.join(",");
      rebuildTagsEditor(tags);
    }
  }
}

function addTag(name) {
  const tagsInput = document.getElementById("proj_tags");
  const tags = tagsInput.value ? tagsInput.value.split(",").map(t => t.trim()).filter(Boolean) : [];
  if (!tags.includes(name)) {
    tags.push(name);
    tagsInput.value = tags.join(",");
    rebuildTagsEditor(tags);
  }
}

function removeTag(name) {
  const tagsInput = document.getElementById("proj_tags");
  const tags = tagsInput.value ? tagsInput.value.split(",").map(t => t.trim()).filter(Boolean) : [];
  const newTags = tags.filter(t => t !== name);
  tagsInput.value = newTags.join(",");
  rebuildTagsEditor(newTags);
}

function rebuildTagsEditor(tags) {
  const editor = document.getElementById("tagsEditor");
  if (!editor) return;
  const input = document.getElementById("tagInput");
  const inputVal = input ? input.value : "";
  editor.innerHTML = `
    ${tags.map(t => `<span class="tag-chip">${t}<button class="tag-chip-remove" onclick="removeTag('${t.replace(/'/g, "\\'")}')">✕</button></span>`).join("")}
    <input type="text" class="tag-input" id="tagInput" placeholder="Ketik & Enter..." 
      value="${inputVal}" onkeydown="handleTagInput(event)">
  `;
  document.getElementById("tagInput").focus();
}

function saveProjectEdit(projId) {
  const data = getPortfolioData();
  const idx = data.projects.findIndex((p) => p.id === projId);
  if (idx === -1) return;

  const tagsRaw = document.getElementById("proj_tags").value;
  const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];

  data.projects[idx] = {
    ...data.projects[idx],
    label: document.getElementById("proj_label").value.trim(),
    title: document.getElementById("proj_title").value.trim(),
    description: document.getElementById("proj_description").value.trim(),
    detailDescription: document.getElementById("proj_detailDescription").value.trim(),
    tags,
    githubUrl: document.getElementById("proj_github").value.trim(),
    liveUrl: document.getElementById("proj_live").value.trim(),
    image: document.getElementById("proj_image").value.trim(),
    emoji: document.getElementById("proj_emoji").value || "💻",
  };

  savePortfolioData(data);
  closeProjectEditModal();
  renderProjectsPanel();
  cmsToast("✅ Proyek berhasil disimpan!", "success");
}

/* ══════════════════════════════════════════════════════
   SETTINGS PANEL
   ══════════════════════════════════════════════════════ */
function renderSettingsPanel() {
  const el = document.getElementById("settings-container");
  if (!el) return;

  el.innerHTML = `
    <!-- Ganti Password -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">🔑 Ganti Password CMS</span>
      </div>
      <div class="alert-box warn" style="margin-bottom:1rem">
        ⚠️ Password disimpan di localStorage browser ini. Pastikan browser Anda aman.
      </div>
      <div class="field-group">
        <label class="field-label">Password Saat Ini</label>
        <input type="password" class="field-input" id="pw_current" placeholder="Password lama">
      </div>
      <div class="field-group">
        <label class="field-label">Password Baru</label>
        <input type="password" class="field-input" id="pw_new" placeholder="Min. 8 karakter"
          oninput="checkPasswordStrength(this.value)">
        <div class="password-strength">
          <div class="password-strength-bar" id="pwStrengthBar"></div>
        </div>
        <div class="field-hint" id="pwStrengthLabel"></div>
      </div>
      <div class="field-group">
        <label class="field-label">Konfirmasi Password Baru</label>
        <input type="password" class="field-input" id="pw_confirm" placeholder="Ulangi password baru">
      </div>
      <button class="btn-sm primary" onclick="changePassword()">🔑 Simpan Password</button>
    </div>

    <!-- Reset Data -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">🔄 Reset Data</span>
      </div>
      <div class="alert-box warn" style="margin-bottom:1rem">
        ⚠️ Reset akan mengembalikan SEMUA data ke default. Perubahan CMS akan hilang!
      </div>
      <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
        <button class="btn-sm danger" onclick="resetAllData()">🔄 Reset ke Default</button>
        <button class="btn-sm" onclick="exportData()">📤 Export Data (JSON)</button>
        <button class="btn-sm" onclick="document.getElementById('importFile').click()">📥 Import Data</button>
        <input type="file" id="importFile" accept=".json" style="display:none" onchange="importData(event)">
      </div>
    </div>

    <!-- Info -->
    <div class="cms-card">
      <div class="cms-card-header">
        <span class="cms-card-title">ℹ️ Informasi Sistem</span>
      </div>
      <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);line-height:1.8">
        <div>📦 Storage: localStorage (browser)</div>
        <div>🔒 Session: Berlaku 4 jam sejak login</div>
        <div>📁 Foto Profil: <code>assets/images/profile/</code></div>
        <div>📁 Foto Proyek: <code>assets/images/projects/</code></div>
        <div>🌐 Portfolio: <a href="index.html" target="_blank">index.html</a></div>
      </div>
    </div>
  `;
}

function checkPasswordStrength(pw) {
  const bar = document.getElementById("pwStrengthBar");
  const label = document.getElementById("pwStrengthLabel");
  if (!bar || !label) return;

  let strength = 0;
  if (pw.length >= 8) strength++;
  if (/[A-Z]/.test(pw)) strength++;
  if (/[0-9]/.test(pw)) strength++;
  if (/[^A-Za-z0-9]/.test(pw)) strength++;

  const configs = [
    { color: "#fc8181", label: "Lemah", width: "25%" },
    { color: "#f6ad55", label: "Cukup", width: "50%" },
    { color: "#68d391", label: "Kuat", width: "75%" },
    { color: "#63b3ed", label: "Sangat Kuat", width: "100%" },
  ];

  if (pw.length === 0) {
    bar.style.width = "0%";
    label.textContent = "";
    return;
  }

  const cfg = configs[strength - 1] || configs[0];
  bar.style.width = cfg.width;
  bar.style.background = cfg.color;
  label.textContent = "Kekuatan: " + cfg.label;
  label.style.color = cfg.color;
}

function changePassword() {
  const current = document.getElementById("pw_current").value;
  const newPw = document.getElementById("pw_new").value;
  const confirm = document.getElementById("pw_confirm").value;

  if (current !== getPassword()) {
    cmsToast("❌ Password saat ini salah!", "error");
    return;
  }
  if (newPw.length < 8) {
    cmsToast("⚠️ Password minimal 8 karakter!", "error");
    return;
  }
  if (newPw !== confirm) {
    cmsToast("❌ Konfirmasi password tidak cocok!", "error");
    return;
  }

  localStorage.setItem(PASSWORD_KEY, newPw);
  document.getElementById("pw_current").value = "";
  document.getElementById("pw_new").value = "";
  document.getElementById("pw_confirm").value = "";
  checkPasswordStrength("");
  cmsToast("✅ Password berhasil diubah!", "success");
}

function resetAllData() {
  if (!confirm("⚠️ Yakin ingin reset semua data? Ini tidak bisa dibatalkan.")) return;
  if (!confirm("Sekali lagi: SEMUA perubahan CMS akan hilang. Lanjutkan?")) return;
  resetPortfolioData();
  renderDashboard();
  renderPanel(document.querySelector(".sidebar-link.active")?.getAttribute("data-panel") || "dashboard");
  cmsToast("🔄 Data direset ke default!", "info");
}

function exportData() {
  const data = getPortfolioData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "portfolio_data_" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  cmsToast("📤 Data berhasil diekspor!", "success");
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.profile || !data.about || !data.skills || !data.projects) {
        throw new Error("Format data tidak valid");
      }
      savePortfolioData(data);
      cmsToast("✅ Data berhasil diimpor!", "success");
      renderPanel(document.querySelector(".sidebar-link.active")?.getAttribute("data-panel") || "dashboard");
    } catch (err) {
      cmsToast("❌ File JSON tidak valid: " + err.message, "error");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

/* ══════════════════════════════════════════════════════
   TOAST NOTIFICATION
   ══════════════════════════════════════════════════════ */
function cmsToast(message, type = "info", duration = 3000) {
  let toast = document.getElementById("cmsToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cmsToast";
    toast.className = "cms-toast";
    document.body.appendChild(toast);
  }

  toast.className = `cms-toast ${type}`;
  toast.textContent = message;

  clearTimeout(toast._timer);
  requestAnimationFrame(() => {
    toast.classList.add("show");
    toast._timer = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  });
}
