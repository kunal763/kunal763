/**
 * Kunal Singh — Portfolio Interactive Script
 * Handles theme switching, terminal emulator, skill filters, modals, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initCounters();
  initSkillsFilter();
  initTerminal();
  initNavScrollSpy();
  initCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark / Light)
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(`Switched to ${newTheme} theme 🌓`);
    });
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Menu Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   3. Animated Stat Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const runAnimation = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1200;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString();
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runAnimation();
      }
    });
  }, { threshold: 0.3 });

  const metricsStrip = document.querySelector('.stats-counter-strip') || document.querySelector('.metrics-strip');
  if (metricsStrip) {
    observer.observe(metricsStrip);
  }
}

/* --------------------------------------------------------------------------
   4. Skills Category Filter
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive Terminal Emulator
   -------------------------------------------------------------------------- */
function initTerminal() {
  const terminalScreen = document.getElementById('terminal-screen');
  const outputEl = document.getElementById('terminal-output');
  const inputEl = document.getElementById('terminal-active-input');
  const actionBtns = document.querySelectorAll('.term-btn');

  const commandResponses = {
    'cat profile.json': `<pre class="json-code"><code>{
  <span class="json-key">"name"</span>: <span class="json-string">"Kunal Singh"</span>,
  <span class="json-key">"role"</span>: <span class="json-string">"Software Developer L2"</span>,
  <span class="json-key">"location"</span>: <span class="json-string">"Pune, India"</span>,
  <span class="json-key">"experience_years"</span>: <span class="json-number">2.0</span>,
  <span class="json-key">"core_languages"</span>: [<span class="json-string">"Python"</span>, <span class="json-string">"C++"</span>, <span class="json-string">"Java"</span>, <span class="json-string">"JavaScript"</span>, <span class="json-string">"Kotlin"</span>],
  <span class="json-key">"specialties"</span>: [
    <span class="json-string">"High-Throughput Backend Architecture"</span>,
    <span class="json-string">"Autonomous AI Agents & RAG Vector Pipelines"</span>,
    <span class="json-string">"Low-Latency C++ Profiling (gprof, Benchmark)"</span>,
    <span class="json-string">"Cloud Infrastructure & Secrets Management"</span>
  ],
  <span class="json-key">"status"</span>: <span class="json-string">"🚀 Ready to deploy impactful code"</span>
}</code></pre>`,

    'kunal --skills': `<pre class="json-code"><code>[
  { <span class="json-key">"category"</span>: <span class="json-string">"Backend"</span>, <span class="json-key">"stack"</span>: [<span class="json-string">"FastAPI"</span>, <span class="json-string">"Django"</span>, <span class="json-string">"Spring Boot"</span>, <span class="json-string">"REST APIs"</span>] },
  { <span class="json-key">"category"</span>: <span class="json-string">"AI & Data"</span>, <span class="json-key">"stack"</span>: [<span class="json-string">"RAG Pipelines"</span>, <span class="json-string">"Embeddings"</span>, <span class="json-string">"Selenium/HTTPX"</span>] },
  { <span class="json-key">"category"</span>: <span class="json-string">"Systems"</span>, <span class="json-key">"stack"</span>: [<span class="json-string">"C++17/20"</span>, <span class="json-string">"gNMI/Protobuf"</span>, <span class="json-string">"Google Benchmark"</span>] },
  { <span class="json-key">"category"</span>: <span class="json-string">"Cloud/DevOps"</span>, <span class="json-key">"stack"</span>: [<span class="json-string">"AWS EC2"</span>, <span class="json-string">"Secrets Manager"</span>, <span class="json-string">"PM2"</span>, <span class="json-string">"Docker"</span>] }
]</code></pre>`,

    'kunal --benchmarks': `<pre class="json-code"><code>{
  <span class="json-key">"telemetry_latency"</span>: <span class="json-string">"12µs ➔ 4µs (66% speedup in C++ hot path)"</span>,
  <span class="json-key">"wire_payload_reduction"</span>: <span class="json-string">"49% payload shrink via YANG-Protobuf models"</span>,
  <span class="json-key">"concurrency_stress_test"</span>: <span class="json-string">"568 req/s under 10,000 simulated users"</span>,
  <span class="json-key">"db_read_reduction"</span>: <span class="json-string">"45% database read load reduction with Redis"</span>,
  <span class="json-key">"data_ingestion"</span>: <span class="json-string">"35,000+ web pages indexed into vector space"</span>
}</code></pre>`,

    'kunal --contact': `<pre class="json-code"><code>{
  <span class="json-key">"email"</span>: <span class="json-string">"ksingh112113114@gmail.com"</span>,
  <span class="json-key">"github"</span>: <span class="json-string">"https://github.com/kunal763"</span>,
  <span class="json-key">"linkedin"</span>: <span class="json-string">"https://linkedin.com/in/kunal-singh-chauhan"</span>,
  <span class="json-key">"location"</span>: <span class="json-string">"Pune, India"</span>
}</code></pre>`
  };

  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      actionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cmd = btn.getAttribute('data-cmd');
      if (inputEl) inputEl.textContent = cmd;
      if (outputEl && commandResponses[cmd]) {
        outputEl.innerHTML = commandResponses[cmd];
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Navigation Scroll Spy
   -------------------------------------------------------------------------- */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   7. Modals: Resume & Project Details
   -------------------------------------------------------------------------- */
function openResumeModal(event) {
  if (event) event.preventDefault();
  closeProjectModal();
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

const projectData = {
  'cab-sharing': {
    title: 'Scalable Cab Sharing Backend (smart-ride-sharing)',
    icon: '🚖',
    content: `
      <div class="modal-deep-dive-section">
        <h4 class="modal-section-title">System Overview</h4>
        <p class="modal-text">
          A high-throughput distributed backend built for real-time ride matching and pooling, designed to gracefully handle heavy request concurrency and spatial proximity algorithms.
        </p>
      </div>

      <div class="modal-deep-dive-section">
        <h4 class="modal-section-title">Performance Benchmarks &amp; Architecture</h4>
        <ul class="experience-bullets">
          <li><strong>Throughput:</strong> Maintained <strong>568 requests per second</strong> under a simulated load of 10,000 concurrent users.</li>
          <li><strong>Geospatial Proximity Queries:</strong> Utilized PostgreSQL with PostGIS extensions to run low-latency spherical radius calculations for optimal driver-rider matching.</li>
          <li><strong>Redis Caching Layer:</strong> Reduced database read traffic by <strong>45%</strong> by caching hot ride states, driver availability, and token lookups.</li>
          <li><strong>Containerization:</strong> Dockerized multi-stage container build with unified compose configuration for rapid orchestration.</li>
        </ul>
      </div>

      <div class="modal-deep-dive-section">
        <a href="https://github.com/kunal763/smart-ride-sharing" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
          View Repository on GitHub ↗
        </a>
      </div>
    `
  },
  'schedule-fa': {
    title: 'Schedule FA Creator — ITR Foreign Asset Automation',
    icon: '📊',
    content: `
      <div class="modal-deep-dive-section">
        <h4 class="modal-section-title">Project Overview</h4>
        <p class="modal-text">
          A 100% local, privacy-first tax automation tool engineered to parse foreign broker statements (Schwab, INDmoney, Vested, Generic CSV) and compute Schedule FA (Foreign Assets - Table A3) filing sheets for Indian taxpayers filing ITR-2 / ITR-3.
        </p>
      </div>

      <div class="modal-deep-dive-section">
        <h4 class="modal-section-title">System Architecture &amp; Engines</h4>
        <ul class="experience-bullets">
          <li><strong>100% Local Processing:</strong> Financial statement CSVs are processed entirely in-memory; no sensitive income data touches external servers.</li>
          <li><strong>Pluggable Factory Parsers:</strong> Factory design pattern supporting Charles Schwab (RSUs, ESPP, sell-to-cover, cash dividends, NRA withholdings), INDmoney, Vested, and generic CSV formats.</li>
          <li><strong>SBI TTBR Forex Engine:</strong> Rule 115 compliant currency conversions using official daily SBI Telegraphic Transfer Buying Rates with backward search for weekends and bank holidays.</li>
          <li><strong>Gross Dividend Reconstructor:</strong> Reconstructs pre-withholding gross foreign dividend income for accurate Table A3 Column 12 reporting.</li>
          <li><strong>Peak Value Engine:</strong> Automatic calculation of peak investment value across the target calendar year using daily high price history via <code>yfinance</code>.</li>
          <li><strong>Dual Interface:</strong> Interactive local FastAPI dashboard with instant previews and a CLI tool exporting 1-to-1 Excel (<code>.xlsx</code>) sheets matching the Income Tax e-filing schema.</li>
        </ul>
      </div>

      <div class="modal-deep-dive-section">
        <a href="https://github.com/kunal763/Schedule-fa" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
          View Repository on GitHub ↗
        </a>
      </div>
    `
  },
  'http-server': {
    title: 'High-Performance HTTP Server with Gzip Compression',
    icon: '⚡',
    content: `
      <div class="modal-deep-dive-section">
        <h4 class="modal-section-title">Project Overview</h4>
        <p class="modal-text">
          A lightweight, low-level HTTP server implemented from the ground up in modern C++17, supporting concurrent client connections, POSIX sockets, and dynamic gzip compression.
        </p>
      </div>

      <div class="modal-deep-dive-section">
        <h4 class="modal-section-title">Technical Implementation &amp; Features</h4>
        <ul class="experience-bullets">
          <li><strong>POSIX Concurrent Threads:</strong> Employs POSIX multithreading to concurrently process client HTTP requests without blocking on I/O.</li>
          <li><strong>Zlib Gzip Compression:</strong> Integrates the <code>zlib</code> library to compress HTTP payload responses on the fly, reducing network transfer sizes.</li>
          <li><strong>Hexadecimal Data Encoding:</strong> Converts binary compressed data to hex strings for reliable wire transmission and socket debugging.</li>
          <li><strong>Native Directory File Serving:</strong> Direct system call file handling via <code>--directory</code> CLI flag to stream static assets directly from disk.</li>
          <li><strong>Modern Toolchain:</strong> Managed with CMake build configurations and <code>vcpkg</code> dependency management for cross-platform POSIX compatibility.</li>
        </ul>
      </div>

      <div class="modal-deep-dive-section">
        <a href="https://github.com/kunal763/SimpleHttpServer" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
          View Repository on GitHub ↗
        </a>
      </div>
    `
  }
};

function showProjectDetails(projectId, event) {
  if (event) event.preventDefault();
  closeResumeModal();
  const data = projectData[projectId];
  if (!data) return;

  const modal = document.getElementById('project-modal');
  const title = document.getElementById('project-modal-title');
  const icon = document.getElementById('project-modal-icon');
  const body = document.getElementById('project-modal-body');

  if (title) title.textContent = data.title;
  if (icon) icon.textContent = data.icon;
  if (body) body.innerHTML = data.content;

  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Close modals when clicking backdrop
window.addEventListener('click', (e) => {
  const resumeModal = document.getElementById('resume-modal');
  const projectModal = document.getElementById('project-modal');
  if (e.target === resumeModal) closeResumeModal();
  if (e.target === projectModal) closeProjectModal();
});

// Close modals on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeResumeModal();
    closeProjectModal();
  }
});

/* --------------------------------------------------------------------------
   8. Clipboard Copy Helper
   -------------------------------------------------------------------------- */
function copyToClipboard(text, buttonElement) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied "${text}" to clipboard! 📋`);
    if (buttonElement) {
      const originalHTML = buttonElement.innerHTML;
      buttonElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      setTimeout(() => {
        buttonElement.innerHTML = originalHTML;
      }, 2000);
    }
  }).catch(() => {
    showToast('Failed to copy to clipboard.');
  });
}

/* --------------------------------------------------------------------------
   9. Interactive Contact Form Submission
   -------------------------------------------------------------------------- */
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  const recipient = 'ksingh112113114@gmail.com';
  const mailtoBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

  // Launch email client
  window.location.href = mailtoUrl;

  showToast('Opening your email client... 🚀');
  document.getElementById('portfolio-contact-form').reset();
}

/* --------------------------------------------------------------------------
   10. Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">✨</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 4000);
}

/* --------------------------------------------------------------------------
   11. Dynamic Year
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
