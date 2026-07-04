# Md Amran Ahmad — Portfolio

A static, dependency-free portfolio site. No build step, no framework — just HTML, CSS, and vanilla JS, so it deploys anywhere in minutes.

## Project structure

```
.
├── index.html          → all page content
├── css/style.css        → all styling
├── js/main.js           → nav, showcase filtering/search, form logic
├── assets/profile.jpg   → profile photo
└── README.md
```

## 1. Make the contact form actually send email

Right now the form validates input and shows a success screen, but **does not deliver messages anywhere** until you connect a form backend. The easiest option (free, no server required):

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Create a new form and copy its endpoint, e.g. `https://formspree.io/f/xnqeqwer`.
3. Open `js/main.js` and set it at the top of the file:
   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/xnqeqwer";
   ```
4. Redeploy. Test the form yourself once live — Formspree requires one confirmation click on the first submission.

Alternatives to Formspree: [Getform](https://getform.io), [Web3Forms](https://web3forms.com), or a small serverless function (Vercel/Netlify function) if you want full control later. All of them work the same way — POST the form's JSON payload to an endpoint URL.

Until `FORM_ENDPOINT` is set, submissions are validated and the success screen still shows (so you can review the UI), but check your browser console — you'll see a warning that nothing was actually sent.

## 2. Deploy

Any static host works. Three easy options:

**Netlify (drag and drop)**
- Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this whole folder in. Done — you get a live URL immediately.

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

## 3. Things to double check before going live

- Confirm the "Available for freelance & full-time work" line in the hero still reflects your status.
- Add live demo links for the other two projects if/when you deploy them.
- Swap or update `assets/profile.jpg` any time — just keep the same filename, or update the `src` in `index.html` (two references: hero and about section).
- Update social links in the footer/contact section if any handles change.

## 4. Local preview

No build tools needed — just open `index.html` in a browser, or serve it locally:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
