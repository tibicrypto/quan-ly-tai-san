#!/bin/bash

# Setup script for Quan Ly Tai San
echo "🚀 Setup Quan Ly Tai San Application"
echo "======================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your Supabase credentials"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Supabase credentials"
echo "2. Run: npx prisma db push (to create database tables)"
echo "3. Run: npm run dev (to start development server)"
echo ""
echo "For production deployment, see VERCEL_DEPLOYMENT.md"
echo ""
