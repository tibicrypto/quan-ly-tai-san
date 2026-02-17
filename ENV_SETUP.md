# Environment Setup Guide

## Quick Start for Development

### 1. Create `.env` file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 2. Configure Database

You have two options:

#### Option A: Use Supabase (Recommended for Production)

1. Create a Supabase project at https://supabase.com
2. Get your connection string from Settings > Database
3. Update `.env` with your Supabase credentials:

```env
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
```

#### Option B: Use Local PostgreSQL (For Development)

1. Install PostgreSQL locally
2. Create a database:
```bash
createdb quan_ly_tai_san
```

3. Update `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/quan_ly_tai_san?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/quan_ly_tai_san?schema=public"
```

### 3. Run Database Migrations

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

## Common Issues

### "Environment variable not found: DATABASE_URL"

**Solution**: Make sure you have a `.env` file in the root directory with DATABASE_URL set.

### "Can't reach database server"

**Solution**: 
- Check if PostgreSQL is running
- Verify connection string in `.env`
- For Supabase: Check if your IP is allowed in database settings

### PNJ Gold Price Fetch Fails

**Solution**: 
- The app will use mock data if PNJ website is unreachable
- Check internet connection
- PNJ website structure may have changed (update scraping logic if needed)

## Environment Variables Reference

### Required
- `DATABASE_URL` - PostgreSQL connection string (with pooling)
- `DIRECT_URL` - Direct PostgreSQL connection (for migrations)

### Optional (for full features)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

## Development vs Production

### Development (`.env.local` or `.env`)
```env
DATABASE_URL="postgresql://localhost:5432/dev"
```

### Production (Set in Vercel/hosting platform)
```env
DATABASE_URL="postgresql://supabase.co:6543/postgres?pgbouncer=true"
```

Never commit `.env` files to git!
