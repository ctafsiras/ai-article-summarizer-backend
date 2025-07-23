# AI Article Summarizer Backend

## Running the Project Locally

### Prerequisites

- **Node.js**: v18.x or later is recommended
- **Package Manager**: `pnpm` (preferred) or `npm`
- **PostgreSQL**: Required for database operations
- **OpenAI API Key**: For article summarization features

### Installation Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ctafsiras/ai-article-summarizer-backend.git
   cd ai-article-summarizer-backend
   ```
2. **Install Dependencies**
   - Using `pnpm` (recommended):
     ```bash
     pnpm install
     ```
   - Or using `npm`:
     ```bash
     npm install
     ```
3. **Generate Prisma Client**
   ```bash
   pnpm prisma generate
   # or
   npm run postinstall
   ```

### Environment Variables

Create a `.env` file in the root of the backend directory. Below are the required variables with sample values and descriptions:

| Variable                 | Sample Value                                                  | Description                                   |
| ------------------------ | ------------------------------------------------------------- | --------------------------------------------- |
| `DATABASE_URL`           | `postgresql://user:password@host:port/dbname?sslmode=require` | PostgreSQL connection string                  |
| `OPENAI_API_KEY`         | `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`         | Your OpenAI API key                           |
| `PORT`                   | `5000`                                                        | Port for backend server                       |
| `BCRYPT_SALT_ROUNDS`     | `10`                                                          | Salt rounds for bcrypt password hashing       |
| `DEFAULT_PASS`           | `changeme`                                                    | Default password for seeded users             |
| `NODE_ENV`               | `development`                                                 | Node environment (`development`/`production`) |
| `JWT_ACCESS_SECRET`      | `your_access_secret`                                          | JWT access token secret                       |
| `JWT_REFRESH_SECRET`     | `your_refresh_secret`                                         | JWT refresh token secret                      |
| `JWT_ACCESS_EXPIRES_IN`  | `86400000`                                                    | JWT access token expiry (ms)                  |
| `JWT_REFRESH_EXPIRES_IN` | `86400000`                                                    | JWT refresh token expiry (ms)                 |

> **Tip:** Never commit your actual `.env` file to version control.

### Configuration Instructions

- **Database**: Update `DATABASE_URL` in your `.env` file with your PostgreSQL credentials.
- **Prisma**: Schema is in `prisma/schema.prisma`. After changing the schema, run:
  ```bash
  pnpm prisma migrate dev
  # or
  npx prisma migrate dev
  ```
- **Third-Party Services**: Set your OpenAI API key in `OPENAI_API_KEY`.

### Pre-Run Scripts

- **Prisma Generate**: Automatically runs after install (`postinstall` hook).
- **Migrations**: If you change the schema, run `prisma migrate dev`.

### Running the Application

- **Development Mode** (with hot reload):
  ```bash
  pnpm dev
  # or
  npm run dev
  ```
- **Production Build**:
  ```bash
  pnpm build
  pnpm start
  # or
  npm run build
  npm start
  ```

The backend should now be running at `http://localhost:5000` (or your specified `PORT`).

---
