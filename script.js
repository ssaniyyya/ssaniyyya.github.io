// === CONFIG: change this to your GitHub username ===
const GITHUB_USERNAME = "ssaniyyya";

// === Typewriter effect ===
const roles = [
  "a Computer Science Student",
  "an Aspiring Data Scientist",
  "a Future Software Engineer",
  "a Project Builder & Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
const roleText = document.getElementById("role-text");

function typeRole() {
  const current = roles[roleIndex];
  roleText.textContent = current.slice(0, charIndex);
  charIndex++;

  if (charIndex <= current.length) {
    setTimeout(typeRole, 60);
  } else {
    setTimeout(eraseRole, 1700);
  }
}

function eraseRole() {
  const current = roles[roleIndex];
  roleText.textContent = current.slice(0, charIndex);
  charIndex--;

  if (charIndex >= 0) {
    setTimeout(eraseRole, 40);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 300);
  }
}

// === On DOM ready ===
document.addEventListener("DOMContentLoaded", () => {
  // Start typewriter
  typeRole();

  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");

  // === Theme toggle with localStorage ===
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    body.dataset.theme = savedTheme;
  }
  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", body.dataset.theme);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    themeToggle.textContent = body.dataset.theme === "dark" ? "🌙" : "☀️";
  }

  // === Smooth scroll for nav links ===
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // === Active nav link + back-to-top visibility ===
  const sections = document.querySelectorAll("main section");
  const backToTop = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      if (
        scrollPos >= sec.offsetTop &&
        scrollPos < sec.offsetTop + sec.offsetHeight
      ) {
        const id = sec.getAttribute("id");
        document.querySelectorAll(".nav-link").forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      }
    });

    backToTop.style.display = window.scrollY > 350 ? "block" : "none";
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // === Project filters ===
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach(card => {
        const categories = (card.dataset.category || "").split(",");
        const show =
          filter === "all" || categories.map(c => c.trim()).includes(filter);

        card.style.display = show ? "block" : "none";
        card.style.opacity = show ? "1" : "0";
      });
    });
  });

  // === Project modal ===
  const modal = document.getElementById("project-modal");
  const modalBackdrop = modal.querySelector(".modal-backdrop");
  const modalClose = modal.querySelector(".modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalTech = document.getElementById("modal-tech");
  const modalCodeLink = document.getElementById("modal-code-link");
  const modalDemoLink = document.getElementById("modal-demo-link");

  projectCards.forEach(card => {
    card.addEventListener("click", e => {
      // ✅ Allow 'View Code' / 'Live Demo' links to work normally
      if (e.target.closest("a")) return;

      modalTitle.textContent =
        card.dataset.title || card.querySelector("h3").textContent;
      modalDesc.textContent =
        card.dataset.longDesc || card.querySelector("p").textContent;
      modalTech.textContent = card.dataset.tech || "";

      const code = card.dataset.linkCode || "#";
      const demo = card.dataset.linkDemo || "";

      modalCodeLink.href = code;
      modalDemoLink.href = demo || "#";
      modalDemoLink.style.display = demo ? "inline-flex" : "none";

      modal.classList.add("open");
    });
  });

  function closeModal() {
    modal.classList.remove("open");
  }

  modalBackdrop.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  // === Scroll reveal with IntersectionObserver ===
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(el => observer.observe(el));

  // === GitHub stats using public API ===
  const ghUsernameLabel = document.getElementById("gh-username-label");
  const ghBio = document.getElementById("gh-bio");
  const ghRepos = document.getElementById("gh-repos");
  const ghFollowers = document.getElementById("gh-followers");
  const ghGists = document.getElementById("gh-gists");
  const ghProfileLink = document.getElementById("gh-profile-link");

  if (GITHUB_USERNAME && ghUsernameLabel) {
    ghUsernameLabel.textContent = GITHUB_USERNAME;
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          ghBio.textContent = data.bio || "No bio provided on GitHub.";
          ghRepos.textContent = data.public_repos ?? "0";
          ghFollowers.textContent = data.followers ?? "0";
          ghGists.textContent = data.public_gists ?? "0";
          ghProfileLink.href =
            data.html_url || `https://github.com/${GITHUB_USERNAME}`;
        } else {
          ghBio.textContent = "Could not load GitHub data.";
        }
      })
      .catch(() => {
        ghBio.textContent = "Error fetching GitHub data.";
      });
  } else {
    ghBio.textContent = "Set your GitHub username in script.js.";
  }
});
