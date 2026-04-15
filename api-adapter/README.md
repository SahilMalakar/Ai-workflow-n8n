# API Adapter Service

A production-ready Node.js API adapter service built with TypeScript and Express.js.

## Features

- TypeScript support
- Express.js framework
- CORS and Helmet for security
- Structured folder organization
- Health check endpoint
- Error handling middleware
- Logging middleware

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── utils/          # Helper functions
├── middleware/     # Express middleware
├── routes/         # API routes
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:

   ```
   PORT=3000
   NODE_ENV=development
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm start
   ```

For development:

```bash
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check endpoint

## Scripts

- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run dev` - Start development server with ts-node
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## License

MIT
