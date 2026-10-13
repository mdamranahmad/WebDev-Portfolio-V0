# Md Amran Ahmad — Portfolio

A static, dependency-free portfolio site. No build step, no framework — just
HTML, CSS, and vanilla JS, so it deploys anywhere in minutes.

The content mirrors the GitHub profile at
[github.com/mdamranahmad](https://github.com/mdamranahmad): backend-focused
full-stack developer working with TypeScript, Node.js, Express 5, Prisma,
PostgreSQL, Redis, and Next.js.

## Project structure

```
.
├── index.html                     → home page (hero, about, projects grid, contact)
├── projects/
│   ├── load-shedding.html         → Load Shedding & Power Management System
│   ├── rentnest.html              → RentNest
│   ├── prisma-press.html          → Prisma Press
│   ├── salary-calculator.html     → PayScale 2026 Salary Calculator
│   ├── football-ticket-booking.html → Football Ticket Booking System
│   └── devpulse.html              → DevPulse — Issue & Feature Tracker
├── css/style.css                  → all styling (home + project pages)
├── js/main.js                     → nav, project filter/search, form logic
├── assets/
│   ├── profile.jpg                → profile photo
│   └── projects/*.svg             → project preview images
└── README.md
```

## 1. Projects section

The home page shows six projects as cards in a responsive grid. Each card has:

- the project name,
- a preview image,
- a short description and a few tech tags,
- a **View More / Details** button.

The button opens a dedicated detail page in `projects/` that includes:

- the main technology stack,
- a brief description / overview,
- a live project link,
- GitHub repository links (the client/frontend repo is listed first, with the
  backend repo as a secondary link where one exists),
- the challenges faced while building it,
- potential improvements and future plans.

The filter buttons and the search box work on both the card tags
(`data-tags`) and a keyword string (`data-search`). To add or edit a project,
copy an existing `<article class="project-card" data-project ...>` block in
`index.html` and add a matching page under `projects/`.

## 2. Contact form — how it works

The contact form is **functional out of the box**. It posts the submitted data
to [FormSubmit](https://formsubmit.co), a free form-to-email relay that needs no
account and no API key.

The endpoint is set at the top of `js/main.js`:

```js
const FORM_ENDPOINT = "https://formsubmit.co/ajax/amranahmad.md@gmail.com";
```

Submissions are sent as JSON and arrive in the inbox as a table.

**One-time activation:** the very first submission triggers a confirmation
email from FormSubmit to `amranahmad.md@gmail.com`. Click the link in that email
once; after that, every submission is delivered normally.

To send to a different address, change the email in `FORM_ENDPOINT`. To use a
different provider, swap the URL and payload shape for
[Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) — the
form code is written so only the endpoint block needs to change.

If you set `FORM_ENDPOINT = ""`, the form still validates and shows the success
screen (useful for UI review) but sends nothing; a warning is logged to the
console.

## 3. Deploy

Any static host works. Three easy options:

**Netlify (drag and drop)**
- Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this whole
  folder in. Done — you get a live URL immediately.

**Vercel**
```
npm i -g vercel
vercel
```
Follow the prompts from inside this folder.

**GitHub Pages**
1. Push this folder to a GitHub repo.
2. Repo → Settings → Pages → Source → deploy from the `main` branch, root folder.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.

The project pages use relative links (`../index.html`, `../css`, `../assets`),
so they work from any base path — including a GitHub Pages sub-path.

## 4. Local preview

No build tools needed — just open `index.html` in a browser, or serve it locally:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## 5. Things to double check before going live

- Submit the contact form once and click the FormSubmit confirmation email.
- Confirm the "Available for freelance & contract" line in the hero still
  reflects your status.
- Update social links in the contact section if any handles change.
- Swap or update `assets/profile.jpg` any time — keep the same filename, or
  update the `src` in `index.html` (two references: hero and about section).
- Preview images live in `assets/projects/*.svg`; replace them with real
  screenshots as the projects evolve.
