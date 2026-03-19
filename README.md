# Laksh Menroy — AI/ML Engineer Portfolio

> Personal portfolio site hosted on **GitHub Pages**  
> 🌐 **Live:** https://lakshmenroy.github.io/portfolio

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Running Locally](#running-locally)
3. [Deploying to GitHub Pages](#deploying-to-github-pages)
4. [How to Update Each Section](#how-to-update-each-section)
   - [Your Name / Title / SEO](#1-your-name--title--seo)
   - [Profile Photo](#2-profile-photo)
   - [Hero Text & Typed Phrases](#3-hero-text--typed-phrases)
   - [About Me](#4-about-me)
   - [Experience (Timeline)](#5-experience-timeline)
   - [Skills & Skill Bars](#6-skills--skill-bars)
   - [Education](#7-education)
   - [Projects](#8-projects)
   - [Resume PDF](#9-resume-pdf)
   - [LinkedIn Updates](#10-linkedin-updates)
   - [Contact Form](#11-contact-form)
   - [Footer Links](#12-footer-links)
5. [Changing the Colour Theme](#changing-the-colour-theme)
6. [Changing Fonts](#changing-fonts)
7. [Adding / Removing Nav Links](#adding--removing-nav-links)
8. [Particle Background](#particle-background)
9. [Dependencies](#dependencies)

---

## Project Structure

```
portfolio/
├── index.html          ← ALL content lives here — edit this for text/sections
├── resume.pdf          ← Drop your updated resume PDF here (keep same filename)
├── css/
│   └── style.css       ← All styling: theme colours, layout, animations
├── js/
│   └── main.js         ← Typed animation, particles, scroll effects, contact form
├── assets/
│   ├── image-6.png     ← Your profile photo (used in hero section)
│   ├── favicon.svg     ← Browser tab icon (LM branded)
│   └── avatar-placeholder.svg
├── server.py           ← Local dev server (Python)
├── _config.yml         ← GitHub Pages / Jekyll config
├── .nojekyll           ← Disables Jekyll processing on GitHub Pages
└── 404.html            ← Custom 404 page
```

---

## Running Locally

```bash
cd ~/Desktop/portfolio
python server.py
# → open http://localhost:8080
```

The `server.py` serves files with correct MIME types (important for PDF preview).  
Any file change is reflected on the next browser refresh — no build step needed.

---

## Deploying to GitHub Pages

### Push a change

```bash
cd ~/Desktop/portfolio
git add .
git commit -m "your message"
git push origin main
```

GitHub Pages is configured to serve from the **`main` branch root**.  
Changes go live at https://lakshmenroy.github.io/portfolio within ~1 minute.

### GitHub Pages settings (if you ever reset the repo)

1. Repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Save — done.

---

## How to Update Each Section

All content edits happen in **`index.html`** unless noted otherwise.

---

### 1. Your Name / Title / SEO

**File:** `index.html` — top `<head>` block

```html
<title>Laksh Menroy | AI/ML Engineer</title>
<meta name="description" content="..." />
<meta property="og:title" content="Laksh Menroy | AI/ML Engineer" />
<meta property="og:description" content="..." />
```

Change the page `<title>`, `description`, and Open Graph tags to update what appears in browser tabs, Google results, and link previews on WhatsApp/Slack etc.

---

### 2. Profile Photo

**File:** `assets/image-6.png`

1. Replace `assets/image-6.png` with your new photo — **keep the filename the same**.  
   Or rename it and update this line in `index.html`:
   ```html
   <div class="hero-bg-photo" aria-hidden="true">
     <img src="assets/image-6.png" alt="" />   ← change filename here
   </div>
   ```
2. The photo fills the right half of the hero on desktop and fades to a faint background on mobile. No other CSS changes needed.

**Tips for best results:**
- Portrait orientation, head near the top.
- Minimum 800 × 1200 px.
- PNG or JPG both work.

---

### 3. Hero Text & Typed Phrases

**Greeting / description** — `index.html`, inside `<section id="home">`:

```html
<h1 class="hero-title">
  Hi, I'm <span class="gradient-text">Laksh Menroy</span>
</h1>
<p class="hero-description">
  AI/ML Engineer passionate about ...   ← edit this
</p>
```

**Typed rotating phrases** — `js/main.js`, around line 155:

```js
const phrases = [
  'AI / ML Engineer',
  'Computer Vision Specialist',
  'Edge AI Developer',
  'Kubernetes & Cloud Expert',
  'Robotics Enthusiast',
  'Building Smarter Cities 🌆'
];
```

Add, remove, or reorder phrases freely. Each phrase cycles with a typewriter effect.

**Availability badge** (the green pill):

```html
<div class="hero-tag">
  <span class="status-dot"></span> Open to Collaboration  ← edit text here
</div>
```

---

### 4. About Me

**File:** `index.html` → `<section id="about">`

Edit the `<p>` paragraphs inside `.about-text` for your bio.

**Quick-facts grid** (the four icon pills):

```html
<div class="highlight-item">
  <i class="fas fa-map-marker-alt"></i>
  <span>London, UK</span>              ← change location
</div>
```

**Stat cards** (the 2×2 grid of mini cards beneath the bio):  
Find `.about-mini-card` blocks — each has an icon, a big number, and a label.  
Edit the number and label text directly in the HTML.

---

### 5. Experience (Timeline)

**File:** `index.html` → `<section id="experience">`

Each job is a `.timeline-item`. Example structure:

```html
<div class="timeline-item" data-side="left">
  <div class="timeline-dot"><i class="fas fa-robot"></i></div>
  <div class="timeline-card">
    <div class="timeline-date">Oct 2024 – Present</div>
    <h3 class="timeline-title">AI/ML Engineer</h3>
    <div class="timeline-company">
      <i class="fas fa-building"></i> Bucher Municipal · London, UK
    </div>
    <p class="timeline-desc">...</p>
    <div class="timeline-tags">
      <span class="tag">Python</span>
      <span class="tag">PyTorch</span>
    </div>
  </div>
</div>
```

- **Alternate sides** using `data-side="left"` or `data-side="right"` for the desktop zigzag layout.
- Change the `<i class="fas fa-...">` icon inside `.timeline-dot` — pick any from [fontawesome.com/icons](https://fontawesome.com/icons).
- Add a new job by copy-pasting a `.timeline-item` block and editing the content.

---

### 6. Skills & Skill Bars

**File:** `index.html` → `<section id="skills">`

Each skill row looks like:

```html
<div class="skill-item">
  <div class="skill-meta">
    <span class="skill-name">PyTorch</span>
    <span class="skill-pct">80%</span>
  </div>
  <div class="skill-bar">
    <div class="skill-fill" data-width="80"></div>  ← set 0–100
  </div>
</div>
```

- Set `data-width` to any integer **0–100** — the bar animates to that width when scrolled into view.
- Keep `skill-pct` text in sync with `data-width` (it's just the display label).
- Skill categories are `.skill-category-card` blocks — copy-paste a whole card to add a new group.

---

### 7. Education

**File:** `index.html` → `<section id="education">`

Degrees use `.edu-card`, certifications use `.cert-card`. Both are straightforward — edit the text inside each card directly in HTML.

---

### 8. Projects

**File:** `index.html` → `<section id="projects">`

Currently shows a **"Coming Soon"** banner. When you're ready to add real projects, replace the `.projects-coming-soon` div with a grid of `.project-card` blocks:

```html
<div class="projects-grid">
  <div class="project-card">
    <div class="project-header">
      <i class="fas fa-robot project-icon"></i>
      <div class="project-links">
        <a href="https://github.com/lakshmenroy/your-repo" target="_blank" title="GitHub">
          <i class="fab fa-github"></i>
        </a>
        <!-- optional live demo link -->
        <a href="https://your-demo.com" target="_blank" title="Live Demo">
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>
    <h3 class="project-title">Your Project Name</h3>
    <p class="project-desc">One or two sentences describing what it does.</p>
    <div class="project-tags">
      <span class="tag">Python</span>
      <span class="tag">PyTorch</span>
    </div>
  </div>
</div>
```

The `.projects-grid` already has responsive CSS — it automatically goes 3 columns → 2 → 1 on smaller screens.

**To update the "coming soon" tech tags** (while still in placeholder mode):

```html
<div class="coming-soon-tags">
  <span class="cs-tag"><i class="fas fa-brain"></i> Computer Vision</span>
  <!-- add/remove tags here -->
</div>
```

---

### 9. Resume PDF

**File:** `resume.pdf` (project root)

Simply drop your new PDF into the project root with the **exact filename `resume.pdf`**.  
It is referenced in three places — all update automatically:

| Location | Purpose |
|---|---|
| Nav bar "Download CV" button | Direct download |
| Hero "Download Resume" button | Direct download |
| Resume section `<iframe>` | Inline PDF preview |

If you ever rename the file, do a global find-and-replace for `resume.pdf` in `index.html`.

---

### 10. LinkedIn Updates

**File:** `index.html` → `<section id="updates">`

These are **manually written** cards (LinkedIn's API doesn't allow unauthenticated public embedding).  
Each post is an `.update-card`:

```html
<div class="update-card">
  <div class="update-meta">
    <span class="update-date">March 2025</span>
    <span class="update-type">📢 Announcement</span>
  </div>
  <p class="update-text">Your post text here...</p>
  <a href="https://linkedin.com/posts/your-post-url" target="_blank" class="update-link">
    View on LinkedIn <i class="fas fa-arrow-right"></i>
  </a>
</div>
```

Update the date, emoji type label, body text, and the LinkedIn post URL whenever you want to add a new update.

---

### 11. Contact Form

**File:** `index.html` line ~731 and `js/main.js`

The form submits to **Formspree** — messages are delivered directly to your email inbox.

```html
<form class="contact-form" id="contact-form"
      action="https://formspree.io/f/xpwrjgnd"   ← your Formspree form ID
      method="POST">
```

Your current Formspree endpoint: `https://formspree.io/f/xpwrjgnd`  
To change it, replace `xpwrjgnd` with your new form ID from [formspree.io/dashboard](https://formspree.io/dashboard).

Submissions are handled via **AJAX** in `js/main.js` (the `#contact-form` submit listener) — no page reload, shows inline success/error feedback.

**Contact info cards** (email, location etc.) are inside `.contact-info` in `index.html` — edit those directly.

---

### 12. Footer Links

**File:** `index.html` → `<footer>`

Social links, copyright year, and the quick-nav links are plain HTML — find and edit the text or URLs directly.

---

## Changing the Colour Theme

**File:** `css/style.css` — top `:root { }` block

```css
:root {
  --accent:         #1d4ed8;   /* primary blue  — buttons, highlights */
  --accent-light:   #3b82f6;   /* lighter blue  — typed text, hovers  */
  --accent-red:     #dc2626;   /* red accent    — gradient, logo dot  */
  --bg-primary:     #f0f4ff;   /* page background */
  --bg-secondary:   #e8eeff;   /* alternate section background */
  --bg-card:        #ffffff;   /* card background */
  --text-primary:   #0f172a;   /* main text */
  --text-secondary: #334155;   /* body text */
  --text-muted:     #64748b;   /* captions, labels */
  --gradient:       linear-gradient(135deg, #1d4ed8, #dc2626);
}
```

Changing `--accent` and `--accent-red` propagates the new colour throughout the entire site automatically.  
Use [coolors.co](https://coolors.co) to pick harmonious pairs.

> **Note:** The particle canvas colours are hardcoded in `js/main.js` inside the `mkParticle` function.  
> If you change the theme colour, also update the RGB values there:
> ```js
> rgb: Math.random() > 0.5 ? '29,78,216' : '220,38,38'
> //                          ^ blue RGB     ^ red RGB
> ```
> And the connecting line colour in `drawLines()`:
> ```js
> ctx.strokeStyle = `rgba(29,78,216, ...)`;  ← update this too
> ```

---

## Changing Fonts

**File:** `index.html` `<head>` and `css/style.css`

Current fonts: **Inter** (body) + **Space Grotesk** (headings). Both load from Google Fonts.

1. Pick a font at [fonts.google.com](https://fonts.google.com)
2. Replace the `<link>` in `index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap" rel="stylesheet"/>
   ```
3. Update `css/style.css`:
   ```css
   body { font-family: 'YourFont', sans-serif; }
   ```

---

## Adding / Removing Nav Links

**File:** `index.html` — `<ul class="nav-links" id="nav-links">`

Each nav item is a plain `<li>`:

```html
<li><a href="#section-id" class="nav-link">Label</a></li>
```

The `href` must match the `id` of a `<section>` tag on the page.  
The active highlight is managed automatically by the scroll observer in `js/main.js` — no JS changes needed.

---

## Particle Background

**File:** `js/main.js` — `initParticles()` function (top of file)

| Setting | What it controls |
|---|---|
| `length: 90` | Number of dots — lower = less dense, lighter on CPU |
| `rand(1, 2.2)` (radius) | Dot size range in pixels |
| `rand(-0.25, 0.25)` (dx/dy) | Speed — increase values for faster movement |
| `d < 130` | Max distance at which a connecting line is drawn |
| `opacity: 0.25` on `#particles-canvas` | Overall canvas opacity (in `style.css`) |

To disable particles entirely, remove `<canvas id="particles-canvas"></canvas>` from `index.html`.

---

## Dependencies

All external dependencies load from CDN — **no npm install or build step needed**.

| Dependency | Version | Purpose |
|---|---|---|
| [Font Awesome](https://fontawesome.com) | 6.5.0 | All icons throughout the site |
| [Google Fonts](https://fonts.google.com) | — | Inter + Space Grotesk typefaces |
| [Formspree](https://formspree.io) | — | Contact form → email delivery |

Everything else is vanilla HTML, CSS, and JavaScript — no frameworks, no bundlers, no node_modules.
