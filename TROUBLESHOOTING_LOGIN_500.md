# Troubleshooting: Login 500 Internal Server Error

## Problem
When attempting to log in, you receive a `500 (Internal Server Error)` from the `/api/auth/login` endpoint.

## Common Causes

### 1. Missing `.env` File
The most common cause is a missing or incorrectly configured `.env` file.

**Solution:**
Create a `.env` file in the project root with the following content:

```env
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="your-secret-key-change-in-production"
PORT=3001
```

**Important:** The `DATABASE_URL` should point to a SQLite database file.

### 2. Database Not Initialized
The SQLite database might not exist or tables might not be created.

**Solution:**
```bash
# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 3. Prisma Client Not Generated
The Prisma client might not be generated.

**Solution:**
```bash
npm run prisma:generate
```

### 4. Database Migrations Not Run
The database tables might not exist.

**Solution:**
```bash
npm run prisma:migrate
```

When prompted, enter a migration name (e.g., `init`) or press Enter for default.

### 5. Server Not Running
The backend server might not be running.

**Solution:**
```bash
npm run dev:server
```

Or start both frontend and backend:
```bash
npm run dev
```

## Diagnostic Steps

### Step 1: Check Server Logs
When you start the server, you should see:
```
Server running on http://localhost:3001
```

If you see an error instead, that's your issue.

### Step 2: Verify Database File Exists
Check if the database file exists:
- Windows: `prisma\dev.db`
- Linux/Mac: `prisma/dev.db`

If it doesn't exist, run:
```bash
npx prisma migrate dev --name init
```

### Step 3: Check Browser Console
Look at the Network tab → Login request → Response to see the detailed error.

The error response will include:
- `error`: General error message
- Specific error details in the server console

## Quick Fix Checklist

- [ ] `.env` file exists in project root
- [ ] `DATABASE_URL` is set correctly in `.env` (should be `file:./prisma/dev.db`)
- [ ] `SESSION_SECRET` is set in `.env` (optional, has default)
- [ ] Database file exists at `prisma/dev.db`
- [ ] Ran `npm run prisma:generate`
- [ ] Ran `npm run prisma:migrate`
- [ ] Server is running on port 3001
- [ ] No errors in server console

## After Fixing

1. **Restart the server:**
   ```bash
   npm run dev:server
   ```

2. **Verify the fix:**
   - Check server console for "Server running on http://localhost:3001"
   - Try logging in again
   - Check server console for any error messages

## Still Having Issues?

Check the server console output when you try to log in. The error handling will show:
- The exact error message
- Full error stack trace (in development)
- Database connection issues

This information will help identify the specific issue.

## Common Error Messages

### "Cannot find module '@prisma/client'"
**Solution:** Run `npm install` and then `npx prisma generate`

### "P1001: Can't reach database server"
**Solution:** This shouldn't happen with SQLite, but check that the database file path in `.env` is correct

### "P2002: Unique constraint failed"
**Solution:** A user with that email already exists. Try a different email or check the database.
