/**
 * ═══════════════════════════════════════════════════════
 * PORTFOLIO DATA — Sumber data yang dikelola oleh CMS
 * File ini menyimpan data default; perubahan via CMS
 * disimpan di localStorage dan dibaca oleh main.js
 * ═══════════════════════════════════════════════════════
 */

const DEFAULT_PORTFOLIO_DATA = {
  // ── PROFIL ──────────────────────────────────────────
  profile: {
    name: "Nicolas Prasetia H. Batubara",
    tagline: "🚀 Welcome to my portfolio",
    description:
      "Software Engineer & Tech Enthusiast passionate about building solutions to complex problems. Specializing in full-stack development with modern technologies.",
    location: "Indonesia",
    availability: "Available for Job/Projects",
    currentlyDoing:
      "Building full-stack web, mobile, and data science projects while strengthening backend development skills",
    email: "nicolasbatubaratbjs@gmail.com",
    github: "https://github.com/NicolasBatubara",
    linkedin: "https://linkedin.com/in/nicolasbatubara",
    instagram: "https://instagram.com/nicolas_pras",

    // ── FOTO PROFIL ──────────────────────────────────
    // Foto aktif diambil dari salah satu sumber di bawah.
    // Prioritas: localPhoto > githubPhoto
    //
    // localPhoto: path lokal dari folder assets/images/profile/
    // Contoh: "assets/images/profile/nicolas_profile.jpg"
    // Set ke "" atau null jika belum ada foto lokal.
    localPhoto: "",

    // githubPhoto: URL foto GitHub (cadangan / alternatif)
    // Jika ingin ganti, ubah URL di bawah ini.
    githubPhoto: "https://avatars.githubusercontent.com/u/149449407?v=4",

    // Cadangan foto alternatif — uncomment salah satu jika diperlukan:
    // githubPhoto: "https://avatars.githubusercontent.com/u/149449407?s=400&v=4",
    // githubPhoto: "https://avatars.githubusercontent.com/u/149449407?s=200&v=4",
  },

  // ── ABOUT ME ─────────────────────────────────────────
  about: {
    paragraphs: [
      "I'm a dedicated Software Engineering student at Institut Teknologi Del, passionate about building innovative digital solutions. My journey in tech started with a curiosity about how things work, and has evolved into a deep passion for creating meaningful software.",
      "With hands-on experience in full-stack development, mobile applications, and emerging technologies like AI and machine learning, I bring both technical expertise and creative problem-solving to every project.",
      "Currently in my final year of studies, I've had the opportunity to work on diverse projects, from enterprise-level web applications to innovative mobile solutions. I believe in continuous learning and staying updated with the latest technologies and best practices.",
    ],
    cards: [
      {
        icon: "🎓",
        title: "Education",
        content:
          "Student at Institut Teknologi Del, pursuing a degree in Software Engineering Technology while building projects around full-stack development, data science, and mobile applications.",
      },
      {
        icon: "🎯",
        title: "Area Focus",
        content:
          "Full-stack web apps, backend systems, data analysis and visualization, and mobile solutions that turn ideas into useful products.",
      },
    ],
    highlights: [
      "Full-stack web development with modern frameworks",
      "Mobile app development using Flutter",
      "Data structures and algorithms",
      "AI/ML implementation and data science",
      "UI/UX design with Figma",
    ],
  },

  // ── TECHNICAL SKILLS ─────────────────────────────────
  skills: [
    "JavaScript",
    "TypeScript",
    "GoLang",
    "Android Studio",
    "Jupyter Notebook",
    "Python",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "REST API",
    "Git",
    "Docker",
    "HTML/CSS",
    "Next.js",
    "Flutter",
    "Figma",
  ],

  // ── FEATURED PROJECTS ─────────────────────────────────
  projects: [
    {
      id: "proj-001",
      label: "Full-stack Development",
      title: "Pajak Retribusi Platform",
      description:
        "A major platform for asset, market, and waste management in North Tapanuli Regency, in collaboration with a group managing the traditional market sector.",
      detailDescription:
        "Platform lengkap untuk pengelolaan pajak dan retribusi di Kabupaten Tapanuli Utara. Sistem ini mencakup manajemen aset, pasar tradisional, dan pengelolaan sampah. Dibangun dengan arsitektur monolitik yang robust menggunakan PHP dan PostgreSQL di backend, serta JavaScript di frontend. Fitur utama meliputi dashboard analitik, manajemen pengguna berlevel, laporan otomatis, dan integrasi pembayaran digital.",
      tags: ["MongoDB", "Docker", "Javascript", "PostgreSQL", "PHP"],
      githubUrl: "https://github.com/NicolasBatubara/UTS-RPL-APPL-11423039",
      liveUrl: "",
      // Gambar proyek: path lokal dari folder assets/images/projects/
      // Set ke "" jika belum ada, akan tampilkan placeholder
      image: "",
      // Emoji placeholder jika tidak ada gambar
      emoji: "🏛️",
    },
    {
      id: "proj-002",
      label: "Full-stack Development",
      title: "Meditrack App with Monolith and Microservices Architecture",
      description:
        "The application supports the workflow of the patient management system within the hospital, utilizing a monolithic and microservices architecture built with GoLang and Next.js.",
      detailDescription:
        "Aplikasi manajemen pasien rumah sakit yang dibangun dengan pendekatan arsitektur ganda: monolitik dan microservices. Backend menggunakan GoLang untuk performa tinggi, sedangkan frontend dibangun dengan Next.js dan TypeScript. Sistem mendukung registrasi pasien, penjadwalan dokter, manajemen rekam medis, dan laporan medis real-time. Microservices memungkinkan skalabilitas horizontal untuk setiap modul layanan.",
      tags: ["TypeScript", "Golang", "Javascript", "Next.js"],
      githubUrl: "https://github.com/NicolasBatubara/UTS-RPL-APPL-11423039",
      liveUrl: "",
      image: "",
      emoji: "🏥",
    },
    {
      id: "proj-003",
      label: "Full-stack Development",
      title: "Campus Cafeteria Mobile App & Web Admin",
      description:
        "Android application designed to streamline campus cafeteria operations. Features include menu management, order tracking, and payment integration for improved user experience. and web-based admin panel for efficient management of cafeteria operations.",
      detailDescription:
        "Ekosistem lengkap untuk manajemen kantin kampus yang terdiri dari dua komponen utama: aplikasi mobile Android (Flutter) dan panel admin berbasis web (PHP). Fitur mobile meliputi browsing menu, pemesanan real-time, dan pembayaran digital via Midtrans. Panel admin menyediakan manajemen menu, monitoring pesanan, laporan penjualan harian/bulanan, dan manajemen stok bahan makanan.",
      tags: ["Flutter", "PHP", "Android Studio", "Midtrans"],
      githubUrl: "https://github.com/DhewMacharoe/Revisi",
      liveUrl: "",
      image: "",
      emoji: "🍽️",
    },
    {
      id: "proj-004",
      label: "Data Science - Data Analysis",
      title: "Machine Learning System for Detecting Stunting Risk and Predicting Toddler Growth in Silaen",
      description:
        "Data exploration, processing, visualization, and stunting risk prediction using EDA and the Naive Bayes method.",
      detailDescription:
        "Sistem machine learning untuk deteksi dan prediksi risiko stunting pada balita di Kecamatan Silaen. Menggunakan metodologi EDA (Exploratory Data Analysis) untuk memahami distribusi data, dan algoritma Naive Bayes sebagai model prediksi utama. Dataset mencakup data gizi, tinggi badan, berat badan, dan faktor sosioekonomis. Model mencapai akurasi 87% dalam mengklasifikasikan risiko stunting menjadi tiga kategori: rendah, sedang, dan tinggi.",
      tags: ["Python", "Numpy", "Pandas", "Matplotlib"],
      githubUrl:
        "https://github.com/ErwinSianturi/Machine-Learning-Deteksi-Resiko-Stunting",
      liveUrl: "",
      image: "",
      emoji: "📊",
    },
    {
      id: "proj-005",
      label: "Data Preprocessing & Visualization",
      title: "Midterm Exam - Data Science",
      description:
        "Exploration and visualization to identify distribution patterns and relationships between variables in the Transjakarta dataset.",
      detailDescription:
        "Analisis komprehensif dataset Transjakarta untuk mengidentifikasi pola distribusi penumpang, tren penggunaan rute, dan faktor-faktor yang mempengaruhi volume penumpang. Menggunakan teknik visualisasi lanjutan seperti heatmap korelasi, time-series plot, dan distribusi histogram. Temuan kunci meliputi pola rush hour, rute paling padat, dan rekomendasi peningkatan layanan berdasarkan data.",
      tags: ["Python", "Pandas", "Matplotlib", "Jupyter Notebook"],
      githubUrl: "https://github.com/whisnupenyayang/UTS-DASI",
      liveUrl: "",
      image: "",
      emoji: "🚌",
    },
    {
      id: "proj-006",
      label: "Design and Data Mining",
      title: "Midterm Exam - Data Analysis",
      description:
        "The application of the CRISP-DM (Cross-Industry Standard Process for Data Mining) methodology in conducting descriptive analysis of video game industry data.",
      detailDescription:
        "Penerapan metodologi CRISP-DM (Cross-Industry Standard Process for Data Mining) dalam analisis deskriptif industri video game global. Tahapan mencakup pemahaman bisnis, pemahaman data, persiapan data, pemodelan dengan clustering, evaluasi model, dan deployment menggunakan Tableau. Dashboard interaktif yang dibuat menampilkan tren penjualan game per platform, genre terpopuler, dan analisis publisher terbesar di industri.",
      tags: ["Tableau"],
      githubUrl: "https://github.com/whisnupenyayang/UTS-DALIS",
      liveUrl: "",
      image: "",
      emoji: "🎮",
    },
    {
      id: "proj-007",
      label: "Full Stack",
      title: "Classification of facial expressions",
      description:
        "A Python-based application designed to classify 5 facial expressions by uploading photos.",
      detailDescription:
        "Aplikasi klasifikasi ekspresi wajah berbasis deep learning yang mampu mendeteksi 5 ekspresi utama: senang, sedih, marah, terkejut, dan netral. Menggunakan model CNN (Convolutional Neural Network) yang dibangun dengan TensorFlow/Keras. Dataset training menggunakan FER-2013 yang diaugmentasi. Aplikasi menyediakan interface web sederhana di mana pengguna dapat mengunggah foto dan mendapatkan prediksi ekspresi secara real-time beserta confidence score.",
      tags: ["Python", "TensorFlow", "Jupyter Notebook"],
      githubUrl:
        "https://github.com/NicolasBatubara/klasifikasi_ekspresi_wajah_kel_11",
      liveUrl: "",
      image: "",
      emoji: "😊",
    },
    {
      id: "proj-008",
      label: "Backend",
      title: "Library Borrowing Activity Log",
      description:
        "The FXML Code Java application was developed using NetBeans and SceneBuilder to streamline book loan transaction data.",
      detailDescription:
        "Aplikasi desktop manajemen peminjaman buku perpustakaan yang dibangun menggunakan Java FX dengan FXML layout. Dikembangkan di NetBeans IDE menggunakan SceneBuilder untuk desain UI yang intuitif. Fitur utama mencakup registrasi anggota, katalog buku, pencatatan peminjaman dan pengembalian, perhitungan denda otomatis, dan laporan aktivitas harian. Database menggunakan SQLite untuk penyimpanan lokal yang ringan.",
      tags: ["Java FX", "NetBeans", "SceneBuilder"],
      githubUrl:
        "https://github.com/Hyzity/Log-Aktivitas-Peminjaman-Perpustakaan",
      liveUrl: "",
      image: "",
      emoji: "📚",
    },
    {
      id: "proj-009",
      label: "Backend & Design UI/UX",
      title: "SMPN 2 Balige Website",
      description:
        "Full-stack school information system built with Laravel framework. Provides comprehensive information management and student/staff portal functionality.",
      detailDescription:
        "Sistem informasi sekolah lengkap untuk SMPN 2 Balige yang dibangun menggunakan framework Laravel (PHP). Sistem ini menyediakan portal publik untuk informasi sekolah, berita, dan pengumuman; serta portal khusus untuk siswa dan staff. Fitur meliputi manajemen data siswa, jadwal pelajaran, nilai akademik, absensi digital, galeri foto kegiatan, dan sistem pengumuman berbasis kategori. Desain UI menggunakan pendekatan mobile-first dengan tema warna sekolah.",
      tags: ["Laravel", "PHP", "HTML/CSS", "JavaScript", "MySQL"],
      githubUrl:
        "https://github.com/NicolasBatubara/sistem_informasi_smpn_dua_balige",
      liveUrl: "",
      image: "",
      emoji: "🏫",
    },
  ],
};

/**
 * Ambil data portofolio — gabungkan default dengan data dari localStorage (hasil CMS)
 */
function getPortfolioData() {
  const saved = localStorage.getItem("portfolioData");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed;
    } catch (e) {
      console.warn("Data CMS tidak valid, menggunakan data default.");
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

/**
 * Simpan data ke localStorage (dipanggil oleh CMS)
 */
function savePortfolioData(data) {
  localStorage.setItem("portfolioData", JSON.stringify(data));
}

/**
 * Reset ke data default
 */
function resetPortfolioData() {
  localStorage.removeItem("portfolioData");
  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}
