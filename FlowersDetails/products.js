@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");

/* VARIABLES */
:root {
  --green: #2f9e77;
  --green-dark: #1f7a5a;
  --cream: #f6fbf7;
  --text: #0f1a15;
  --muted: #4c5f55;
  --shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  --radius: 16px;
}

/* RESET */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Poppins", Arial, sans-serif;
  color: var(--text);
  background: var(--cream);
  line-height: 1.6;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  max-width: 100%;
  display: block;
}

/* HEADER */
header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  box-shadow: var(--shadow);
}

.nav-bar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 18px;
  margin: 0;
  padding: 0;
}

nav a {
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
}

nav a:hover,
nav a.active {
  background: var(--green);
  color: #fff;
}

/* PAGE TITLE */
.section-title {
  max-width: 1200px;
  margin: 20px auto 0;
  padding: 0 28px;
}

.section-title h1 {
  margin: 0;
}

.section-title p {
  margin-top: 6px;
  color: var(--muted);
}

/* PRODUCTS GRID */
.grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.card {
  background: #fff;
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.12);
}

.card h3 {
  margin: 0;
}

.price {
  font-weight: 700;
  color: var(--green-dark);
}

/* BUTTON */
.pill {
  align-self: flex-start;
  padding: 10px 16px;
  border-radius: 999px;
  background: linear-gradient(120deg, #f9fffa, #e7f8ee);
  border: 1px solid rgba(47, 158, 119, 0.4);
  color: var(--green-dark);
  font-weight: 600;
}

/* FOOTER */
footer {
  margin-top: 40px;
  background: #0f1a15;
  color: #dce7e0;
  padding: 24px 28px;
}

/* MOBILE NAV */
@media (max-width: 720px) {
  nav ul {
    display: none;
    flex-direction: column;
    position: absolute;
    right: 16px;
    top: 70px;
    background: #fff;
    padding: 14px;
    box-shadow: var(--shadow);
  }

  nav ul.open {
    display: flex;
  }

  .menu-toggle {
    display: inline-flex;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid var(--green);
    background: #fff;
    color: var(--green-dark);
  }
}

@media (min-width: 721px) {
  .menu-toggle {
    display: none;
  }
}
