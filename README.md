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

## Running with Docker

You can run this backend easily using Docker. This is useful for local development, production deployments, or when you want to avoid installing dependencies manually.

### 1. Prepare Your `.env` File

Make sure you have a `.env` file with above mentioned variables.

### 2. Build the Docker Image

From the `ai-article-summarizer-backend/` directory, build the Docker image:

```bash
docker build -t ai-article-summarizer-backend .
```

### 3. Run the Docker Container

Run the container and pass your `.env` file:

```bash
docker run --env-file .env -p 5000:5000 ai-article-summarizer-backend
```

- The app will be available at [http://localhost:5000](http://localhost:5000) (or the port you specify in `.env`).
- Ensure your database and API keys are reachable from inside the container.

---

## CI/CD Setup

This project uses **GitHub Actions** for Continuous Integration (CI) to ensure code quality and consistency on every push and pull request to the `main` branch. The workflow automatically runs:

- **Linting** (`npm run lint`): Checks code for style and programming errors using ESLint.
- **Formatting** (`npx prettier --check`): Ensures code is formatted according to Prettier rules.
- **Testing** (`npm test`): Runs unit tests using Jest.

You can find the workflow configuration in `.github/workflows/ci.yml`.

### Running Checks Locally

- **Lint**:
  ```bash
  npm run lint
  # or
  pnpm lint
  ```
- **Format**:
  ```bash
  npm run prettier
  # or
  pnpm prettier
  ```
- **Test**:
  ```bash
  npm test
  # or
  pnpm test
  ```
