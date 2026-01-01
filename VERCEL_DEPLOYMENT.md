# Vercel Deployment Guide

This guide explains how to deploy your e-health application (Frontend, Backend, and Prisma) to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Vercel CLI** (optional): `npm i -g vercel`

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended)

Vercel Postgres provides connection pooling and is optimized for serverless functions.

1. **Create Vercel Postgres Database:**
   - Go to your Vercel project dashboard
   - Navigate to **Storage** → **Create Database** → **Postgres**
   - Choose a name (e.g., `ehealth-db`)
   - Select a region close to your users

2. **Get Connection Strings:**
   - Vercel will automatically provide:
     - `POSTGRES_PRISMA_URL` (connection pooling)
     - `POSTGRES_URL_NON_POOLING` (direct connection)
   - These will be added as environment variables automatically

### Option 2: External PostgreSQL (Supabase, Neon, etc.)

If using an external database:

1. **Get Connection Strings:**
   - Get your PostgreSQL connection URL
   - Format: `postgresql://user:password@host:port/database?sslmode=require`

2. **Set Environment Variables:**
   ```env
   POSTGRES_PRISMA_URL=postgresql://user:password@host:port/database?sslmode=require&pgbouncer=true
   POSTGRES_URL_NON_POOLING=postgresql://user:password@host:port/database?sslmode=require
   ```

## 🚀 Deployment Steps

### Step 1: Update vercel.json

The `vercel.json` file is already configured, but ensure it matches this:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    }
  ],
  "functions": {
    "api/index.ts": {
      "includeFiles": "prisma/**",
      "maxDuration": 30
    }
  },
  "env": {
    "PRISMA_GENERATE_DATAPROXY": "true"
  }
}
```

### Step 2: Update package.json Scripts

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && npm run build"
  }
}
```

### Step 3: Set Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

#### Required Variables:

```env
# Database (automatically set if using Vercel Postgres)
POSTGRES_PRISMA_URL=your_connection_string
POSTGRES_URL_NON_POOLING=your_direct_connection_string

# JWT & Session Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Node Environment
NODE_ENV=production
```

#### Optional Variables:

```env
# Port (Vercel handles this automatically)
PORT=3001

# CORS Origins (if needed)
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

### Step 4: Deploy via Vercel Dashboard

1. **Import Project:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect the project

2. **Configure Project:**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables:**
   - Add all variables from Step 3
   - Make sure to add them for **Production**, **Preview**, and **Development**

4. **Deploy:**
   - Click **Deploy**
   - Wait for build to complete

### Step 5: Run Database Migrations

After first deployment, run migrations:

**Option A: Via Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Via Vercel Dashboard**

1. Go to your project → **Deployments**
2. Click on the latest deployment
3. Open **Function Logs**
4. Or use Vercel's built-in terminal (if available)

**Option C: Add Migration to Build Script**

Update `package.json`:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && npm run build"
  }
}
```

⚠️ **Note**: This runs migrations on every build. Only use if you want automatic migrations.

### Step 6: Seed Database (Optional)

If you need to seed the database:

```bash
# Pull environment variables
vercel env pull .env.local

# Run seed script
cd prisma
npx tsx seed_resources.ts
```

Or add to `package.json`:

```json
{
  "scripts": {
    "seed": "cd prisma && npx tsx seed_resources.ts"
  }
}
```

## 🔧 Project Structure for Vercel

```
e-health/
├── api/
│   └── index.ts          # Vercel serverless function entry point
├── server/
│   └── index.ts          # Express server (exported to api/index.ts)
├── src/                  # Frontend React app
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed_resources.ts # Seed script
├── dist/                 # Built frontend (generated)
├── vercel.json           # Vercel configuration
└── package.json
```

## 📝 Important Notes

### 1. Prisma on Vercel

- **Connection Pooling**: Use `POSTGRES_PRISMA_URL` for Prisma Client
- **Direct Connection**: Use `POSTGRES_URL_NON_POOLING` for migrations
- **Generate Client**: Runs automatically via `postinstall` script

### 2. Serverless Functions

- **Timeout**: Default is 10s, max is 60s (Pro plan) or 30s (Hobby)
- **Cold Starts**: First request may be slower
- **File Size**: Keep function size under 50MB

### 3. Frontend Build

- Vite builds to `dist/` directory
- Static files are served automatically
- API routes are handled by serverless functions

### 4. CORS Configuration

The server already includes Vercel domains in CORS. Update if needed:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app.vercel.app',
  // Add your custom domain here
];
```

## 🐛 Troubleshooting

### Issue: Database Connection Errors

**Solution:**
- Verify `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` are set
- Check connection string format
- Ensure database is accessible from Vercel's IP ranges

### Issue: Prisma Client Not Found

**Solution:**
- Ensure `postinstall` script runs: `"postinstall": "prisma generate"`
- Check build logs for Prisma generation
- Verify `@prisma/client` is in dependencies

### Issue: Migrations Not Running

**Solution:**
- Run migrations manually via Vercel CLI
- Or add to build script (see Step 5, Option C)
- Check migration files exist in `prisma/migrations/`

### Issue: Build Fails

**Solution:**
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` scripts are correct
- Check Node.js version (Vercel uses Node 18+ by default)

### Issue: API Routes Not Working

**Solution:**
- Verify `vercel.json` rewrites are correct
- Check `api/index.ts` exports the app correctly
- Ensure routes start with `/api/`
- Check function logs in Vercel dashboard

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to `main` branch → Production
- Push to other branches → Preview
- Pull requests → Preview

## 📊 Monitoring

- **Logs**: View in Vercel dashboard → **Deployments** → **Function Logs**
- **Analytics**: Available in Vercel dashboard (Pro plan)
- **Errors**: Check **Functions** tab for errors

## 🔐 Security Checklist

- [ ] Use strong `JWT_SECRET` and `SESSION_SECRET`
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable Vercel's security headers
- [ ] Review database access permissions

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Serverless Functions](https://vercel.com/docs/functions)

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Database created (Vercel Postgres or external)
- [ ] Environment variables set
- [ ] `vercel.json` configured
- [ ] Build scripts updated
- [ ] Migrations run
- [ ] Database seeded (if needed)
- [ ] CORS configured
- [ ] Test deployment
- [ ] Custom domain configured (optional)

---

**Need Help?** Check Vercel's [documentation](https://vercel.com/docs) or [community forums](https://github.com/vercel/vercel/discussions).

