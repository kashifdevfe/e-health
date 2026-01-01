# Production Database Seeding Script
# This script seeds the production database using Vercel environment variables

Write-Host "Seeding Production Database..." -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "Pulling environment variables from Vercel..." -ForegroundColor Yellow
    vercel env pull .env.local
}

# Load environment variables from .env.local
if (Test-Path .env.local) {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim() -replace '^["\']|["\']$', ''
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
    Write-Host "Environment variables loaded from .env.local" -ForegroundColor Green
} else {
    Write-Host "ERROR: .env.local not found. Please run: vercel env pull .env.local" -ForegroundColor Red
    exit 1
}

# Run seed script
Write-Host "Running seed script..." -ForegroundColor Yellow
cd prisma
npx tsx seed_resources.ts

Write-Host "Seeding completed!" -ForegroundColor Green

