# Lakshmen Roy – AI/ML Engineer Portfolio

A modern, animated portfolio website built with HTML, CSS, and JavaScript.

## 🌐 Live Site

Hosted on **GitHub Pages**: `https://lakshmenroy.github.io/portfolio`

## 🚀 Features

- Animated particle background
- Typing animation for roles
- Responsive on mobile & desktop
- Smooth scroll & section transitions
- Animated skill bars
- Timeline-style experience section
- Project filtering
- LinkedIn updates panel
- Contact form (ready for Formspree)

## 📁 Structure

```
portfolio/
├── index.html
├── resume.pdf          ← Add your actual resume here
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/             ← Add profile photo here
```

## 🛠 Customisation

1. **Replace `resume.pdf`** with your real resume PDF.
2. **Add your photo** in `assets/photo.jpg` and update the avatar in `index.html`.
3. **Enable contact form** – sign up at [Formspree](https://formspree.io) and replace the form action URL in `index.html`.
4. **Update GitHub links** with your actual repository URLs.

## 🆓 Free Hosting on GitHub Pages

```bash
# 1. Create a GitHub repo named: lakshmenroy.github.io  OR any name for project pages
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/lakshmenroy/portfolio.git
git push -u origin main

# 2. Enable GitHub Pages:
#    Repo → Settings → Pages → Source: main branch → / (root)
```

Your site will be live at: `https://lakshmenroy.github.io/portfolio/`

## 📧 Contact Form (Formspree)

1. Go to https://formspree.io and create a free account
2. Create a new form and get the endpoint URL
3. In `index.html`, update the form: `<form action="https://formspree.io/f/YOUR_ID" method="POST">`
4. Remove the `e.preventDefault()` from `main.js` for the contact form, or keep JS handling.

## 💡 LinkedIn Live Data Note

LinkedIn's API requires OAuth 2.0 authentication and doesn't allow direct embedding.
The updates section shows curated posts styled to match your LinkedIn voice.
To display real posts, use a backend proxy with LinkedIn OAuth or embed LinkedIn native posts.
