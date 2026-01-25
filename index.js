document.addEventListener("DOMContentLoaded", async () => {
  // Mobile menu toggle
  const navToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector("nav ul");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
  }

  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) {
    let current = 0;
    slides[current].classList.add("active");

    setInterval(() => {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 4200);
  }

  // Modal Logic
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const closeBtn = document.querySelector(".close-modal");

  if (modal) {
    // Find all triggers
    const triggers = document.querySelectorAll(".show-details");
    
    triggers.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const title = btn.getAttribute("data-title");
        const desc = btn.getAttribute("data-desc");
        
        if (title && desc) {
          modalTitle.textContent = title;
          modalDesc.textContent = desc;
          modal.style.display = "block";
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});
