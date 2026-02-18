# 🔧 Vercel Deployment Troubleshooting Guide

## Common DATABASE_URL Issues on Vercel

### Issue: "Environment variable not found: DATABASE_URL"

This is the most common issue when deploying to Vercel. Here's how to fix it:

## ✅ Solution 1: Add Environment Variables in Vercel Dashboard

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project `quan-ly-tai-san`

2. **Navigate to Settings**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add Required Variables**

   Add these THREE variables (all required):

   | Variable Name | Value | Environment |
   |--------------|--------|-------------|
   | `DATABASE_URL` | Your Supabase pooled connection string | Production, Preview, Development |
   | `DIRECT_URL` | Your Supabase direct connection string | Production, Preview, Development |
   | `POSTGRES_PRISMA_URL` | Same as DATABASE_URL | Production, Preview, Development |

   **Important**: Select **ALL THREE** environments (Production, Preview, Development) for each variable!

4. **Get Connection Strings from Supabase**

   **For DATABASE_URL (Pooled/Transaction mode):**
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```
   
   **Note**: The `connection_limit=1` parameter is crucial for preventing prepared statement conflicts in serverless environments.

   **For DIRECT_URL (Direct connection):**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

   **How to get these:**
   - Go to your Supabase project
   - Click **Settings** → **Database**
   - Scroll to **Connection string**
   - Choose **Connection Pooling** tab for DATABASE_URL
   - Choose **Direct Connection** tab for DIRECT_URL
   - **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password!

5. **Redeploy**
   - After adding variables, go to **Deployments** tab
   - Click the three dots (...) on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

---

## ✅ Solution 2: Verify Prisma Schema Configuration

Make sure your `prisma/schema.prisma` has the correct datasource configuration:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Key points:**
- Both `url` and `directUrl` must be present
- They reference environment variables that will be set in Vercel

---

## ✅ Solution 3: Check Build Configuration

### Option A: Update `vercel.json`

Create or update `vercel.json` in your project root:

```json
{
  "buildCommand": "prisma generate && prisma db push && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "env": {
    "DATABASE_URL": "@database_url",
    "DIRECT_URL": "@direct_url"
  }
}
```

### Option B: Update `package.json` scripts

Add or update these scripts in `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build",
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

**Note**: `vercel-build` runs automatically on Vercel if present.

---

## ✅ Solution 4: Use Vercel CLI for Testing

Test your deployment locally before pushing:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   vercel link
   ```

4. **Pull environment variables:**
   ```bash
   vercel env pull .env.local
   ```

5. **Build locally:**
   ```bash
   vercel build
   ```

6. **If successful, deploy:**
   ```bash
   vercel --prod
   ```

---

## 🔍 Debugging Steps

### 1. Check Vercel Build Logs

1. Go to **Deployments** in Vercel dashboard
2. Click on the failed deployment
3. Check **Build Logs** for errors
4. Look for:
   ```
   Error: P1001: Can't reach database server
   ```
   or
   ```
   Error: Environment variable not found: DATABASE_URL
   ```

### 2. Verify Environment Variables Are Set

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Verify you see:
   - ✅ DATABASE_URL (with value hidden)
   - ✅ DIRECT_URL (with value hidden)
3. Check that **all three environments** are selected:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

### 3. Test Database Connection

Create a test API route to verify database connection:

**File: `app/api/test-db/route.ts`**
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Try to query database
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL
      }
    }, { status: 500 });
  }
}
```

After deployment, visit: `https://your-app.vercel.app/api/test-db`

---

## 🎯 Common Mistakes & Solutions

### Mistake 1: Wrong Connection String Format

❌ **Wrong:**
```
postgres://user:pass@host:5432/db
```

✅ **Correct for Supabase:**
```
postgresql://postgres.xxxxx:pass@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Mistake 2: Not Selecting All Environments

When adding environment variables, you MUST select all three:
- [x] Production
- [x] Preview
- [x] Development

### Mistake 3: Password Not URL Encoded

If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `&` → `%26`

Example:
```
Password: Pass@123#
Encoded: Pass%40123%23
```

### Mistake 4: Using `env("POSTGRES_URL")` Instead of `env("DATABASE_URL")`

Make sure your `schema.prisma` uses the correct variable names that match Vercel environment variables.

---

## 🚀 Alternative: Use Vercel Postgres

If you don't want to use Supabase, you can use Vercel's built-in Postgres:

1. **Go to Storage tab** in Vercel dashboard
2. **Create new Postgres database**
3. Vercel automatically sets `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.
4. Update `schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL")
     directUrl = env("POSTGRES_URL_NON_POOLING")
   }
   ```
5. Redeploy

---

## 📋 Checklist for Successful Deployment

- [ ] Supabase project created
- [ ] Database password saved
- [ ] Connection strings copied (both pooled and direct)
- [ ] Environment variables added to Vercel
- [ ] All three environments selected for each variable
- [ ] Password special characters URL-encoded if needed
- [ ] `prisma/schema.prisma` has correct datasource config
- [ ] `package.json` has `postinstall` script for Prisma
- [ ] Code pushed to GitHub
- [ ] Redeployed after adding environment variables
- [ ] Checked build logs for errors
- [ ] Tested `/api/test-db` endpoint

---

## 🆘 Still Having Issues?

### Check These:

1. **Supabase Project Status**
   - Is your Supabase project active?
   - Go to Supabase dashboard and check project status
   - If paused, unpause it

2. **IP Allowlist**
   - Supabase: Settings → Database → IP Allowlist
   - Add `0.0.0.0/0` to allow all IPs (for testing)
   - Or add Vercel IP ranges

3. **Database Migrations**
   - Run migrations locally first:
     ```bash
     npx prisma db push
     ```
   - Then deploy to Vercel

4. **Vercel Logs**
   - Check runtime logs (not just build logs)
   - Go to **Deployments** → Click deployment → **Functions** tab
   - Look for runtime errors

---

## 💡 Best Practice: Two-Step Deployment

1. **First Deploy**: Without database operations
   - Comment out database calls temporarily
   - Deploy to verify basic app works
   - Check environment variables are loaded

2. **Second Deploy**: With database
   - Run `prisma db push` locally to create tables
   - Uncomment database calls
   - Deploy again

This helps isolate whether the issue is with environment variables or database connectivity.

---

## ⚠️ Common Error: Prepared Statement Conflicts

### Error Message:
```json
{
  "error": "Failed to fetch assets",
  "details": "Error occurred during query execution: ConnectorError(PostgresError { 
    code: \"42P05\", 
    message: \"prepared statement \\\"s4\\\" already exists\" 
  })"
}
```

### Root Cause:
This error occurs when using PgBouncer connection pooling with Prisma in serverless environments. Multiple concurrent requests reuse the same database connection and try to create prepared statements with the same name.

### Solution:

**1. Update your DATABASE_URL to include `connection_limit=1`:**

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

The `connection_limit=1` parameter ensures each Prisma client instance uses only one connection, preventing prepared statement name conflicts.

**2. Make sure your Prisma schema has both URLs configured:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")      // Pooled connection with pgbouncer=true&connection_limit=1
  directUrl = env("DIRECT_URL")        // Direct connection for migrations
}
```

**3. Redeploy your application** after updating the environment variables in Vercel.

**Why this works:**
- `pgbouncer=true`: Tells Prisma to use transaction pooling mode
- `connection_limit=1`: Limits each Prisma instance to one connection, preventing prepared statement conflicts
- Serverless functions create new Prisma instances per request, but each uses its own single connection

---

## 📞 Get Help

If none of these solutions work:

1. **Check Vercel Community:** https://github.com/vercel/vercel/discussions
2. **Check Supabase Community:** https://github.com/supabase/supabase/discussions
3. **Share your build logs** (remove sensitive info first)

---

**Remember**: Environment variables are case-sensitive and must match exactly!
