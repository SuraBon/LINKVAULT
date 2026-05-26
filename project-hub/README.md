# Link Vault

React + Vite web app for collecting useful website links. Links can be added, searched, filtered by category, opened, copied, and deleted.

## Storage

The app can store links in Google Sheets through a Google Apps Script Web App.

- Frontend env var: `VITE_SHEETS_WEB_APP_URL`
- Apps Script source: `google-apps-script/Code.gs`
- Sheet tab created/used by the script: `Links`
- Columns: `id`, `title`, `url`, `category`, `description`, `createdAt`

If `VITE_SHEETS_WEB_APP_URL` is not set, the app falls back to browser `localStorage`.

## Google Sheets Setup

1. Create a Google Sheet.
2. In the Sheet, open `Extensions` -> `Apps Script`.
3. Replace the default script with the contents of `google-apps-script/Code.gs`.
4. Click `Deploy` -> `New deployment`.
5. Select type `Web app`.
6. Set `Execute as` to `Me`.
7. Set `Who has access` to `Anyone`.
8. Deploy, authorize, and copy the Web App URL ending with `/exec`.
9. Create `.env.local`:

```bash
VITE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

10. Restart the dev server.

For Vercel, add the same env var in Project Settings -> Environment Variables, then redeploy.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
