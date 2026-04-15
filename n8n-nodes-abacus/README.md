# n8n-nodes-abacus

An n8n community node for automating [Abacus ERP](https://www.abacus.ch) operations.

## Resources

Supports full CRUD for 10 Abacus resources:

| Resource | Operations |
|---|---|
| Address | Get, Get All, Create, Update, Delete |
| Customer | Get, Get All, Create, Update |
| Invoice | Get, Get All, Create, Update, Delete |
| Order | Get, Get All, Create, Update, Delete |
| Project | Get, Get All, Create, Update, Delete |
| Subject | Get, Get All, Create, Update, Delete |
| Payment | Get, Get All, Create, Update, Delete |
| Delivery Note | Get, Get All, Create, Update, Delete |
| Financial Account | Get, Get All, Create, Update, Delete |
| Item | Get, Get All, Create, Update, Delete |

## Installation

In your n8n instance:

```bash
npm install n8n-nodes-abacus
```

Or via the n8n UI: **Settings → Community Nodes → Install** → enter `n8n-nodes-abacus`.

## Credentials

1. Add a new **Abacus ERP API** credential
2. Enter your **Instance URL** (e.g. `https://your-company.abacus.ch`)
3. Enter your **Client ID** and **Client Secret** (Service User credentials)
4. Click **Test** to verify the connection

## Local Development

```bash
# Install dependencies
npm install

# Build (compiles TypeScript → dist/)
npm run build

# Watch mode
npm run dev

# Lint
npm run lint
```

## Testing Against Mock Server

Start the mock server:
```bash
cd ../abacus-mock-server
uvicorn app.main:app --reload
```

Set your credential's Instance URL to `http://localhost:8000`.

## License

MIT
