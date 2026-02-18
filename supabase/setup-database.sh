#!/bin/bash

# Supabase Import Script
# This script helps you import the database schema to Supabase

set -e

echo "================================================"
echo "Supabase Database Import Script"
echo "================================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found!"
    echo "Please create .env.local from .env.example and configure your Supabase credentials."
    echo ""
    echo "Run: cp .env.example .env.local"
    echo "Then edit .env.local with your Supabase project details."
    exit 1
fi

# Source environment variables safely
set -a
source .env.local
set +a

# Check if required variables are set
if [ -z "$DIRECT_URL" ]; then
    echo "❌ DIRECT_URL not set in .env.local"
    exit 1
fi

echo "✓ Environment variables loaded"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  psql is not installed. Trying alternative method with Prisma..."
    echo ""
    
    # Use Prisma to push schema
    if [ -f "prisma/schema.prisma" ]; then
        echo "Running prisma db push..."
        npx prisma db push --skip-generate
        echo ""
        echo "✓ Schema pushed successfully!"
        echo ""
        echo "Generating Prisma Client..."
        npx prisma generate
        echo ""
        echo "✅ Database setup complete!"
    else
        echo "❌ prisma/schema.prisma not found"
        exit 1
    fi
else
    echo "Would you like to import the SQL schema? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Importing schema from supabase/migrations/20260216_init_schema.sql..."
        psql "$DIRECT_URL" -f supabase/migrations/20260216_init_schema.sql
        echo ""
        echo "✅ Schema imported successfully!"
    else
        echo "Skipping SQL import. You can run it manually later."
    fi
fi

echo ""
echo "================================================"
echo "Next Steps:"
echo "================================================"
echo "1. Verify tables in Supabase Dashboard → Table Editor"
echo "2. Run: npm run dev (to start development server)"
echo "3. Open: http://localhost:3000"
echo ""
echo "For more details, see: supabase/README.md"
echo ""
