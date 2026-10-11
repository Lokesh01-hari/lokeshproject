# Ransomware Watch

A web app that watches a folder you choose and warns you when files start changing the way they do during a ransomware attack. It runs **entirely in Chrome**. There is no server, nothing is uploaded, and it is hosted for free on GitHub Pages.

## Put it online with GitHub (one time)

1. Create a new repository on GitHub and upload everything in this folder (keep the `.github` folder).
2. In the repository open **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.
3. Open the **Actions** tab. The *Deploy to GitHub Pages* run starts by itself on every push to `main`. When it turns green, your app is live at `https://<your-username>.github.io/<repository-name>/`.

## Use it in Chrome

1. Open your GitHub Pages link in **Chrome or Edge on a desktop computer**.
2. Click **Try a demo** to see how the warnings look. No files are touched.
3. Click **Choose folder**, pick a folder, and allow access when Chrome asks.
4. To check it really works on your machine, click **Run self-test**. It creates a few new files in a sub-folder called `_detector_selftest`, makes them look like encrypted files, then deletes them. Your own files are never written to.

Keep the tab open while you want protection. Chrome asks for folder access again each time you reopen the page.

## What it looks for

| Signal | Why it matters |
| --- | --- |
| Many changes in a few seconds | Ransomware rewrites files fast |
| File contents turning into random data | Encrypted data looks like noise |
| Names ending in `.locked`, `.lockbit` and similar | Common ransomware extensions |
| `report.docx` becoming `report.docx.something` | Typical rename after encryption |
| A file like `HOW_TO_DECRYPT_FILES.txt` | Ransom note |
| Many deletions | Originals removed after encrypting copies |

Signals add up to a 0–100 score: 25+ is *unusual activity*, 60+ is an *alert*. A burst of changes on its own never reaches alert level, because backups and installs behave the same way. The full breakdown is in the app under **How the score works**.

## Limits you should know about

- It **warns**. It cannot stop or undo anything. Keep offline backups and real antivirus.
- It only sees the chosen folder, and only while the tab is open.
- Browsers can't be notified of file changes, so the app compares snapshots every few seconds (default 3). Very fast or very slow attacks can be missed.
- Files that already look random (zip, Office, images, video) can't show the "became random" signal. The other signals still apply.
- Chrome refuses to share some folders (drive roots, system folders). Choose a sub-folder.
- Up to 5,000 files are watched, 8 folders deep.
- Large legitimate jobs can cause false alarms.

## Run on your own computer instead

```bash
npm start            # serves the docs/ folder at http://localhost:8000
npm test             # runs the detector unit tests (Node 18+)
```

## Project layout

```
docs/            the web app (this is what GitHub Pages publishes)
  detector.js    detection engine, no browser APIs
  scanner.js     folder access, snapshots, self-test
  app.js         page logic
tests/           unit tests for the detector
.github/         workflow that tests and deploys to GitHub Pages
flask_version/   your original Python/Flask prototype (needs a Python host, cannot run on GitHub Pages)
```
