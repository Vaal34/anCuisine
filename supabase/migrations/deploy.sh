#!/bin/bash

# ============================================
# Deployment Script for Cooking Methods Migration
# ============================================
# This script helps deploy the cooking_methods migration safely
# Run from project root: bash supabase/migrations/deploy.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Migration file
MIGRATION_FILE="/home/val34/anCuisine/supabase/migrations/20260102_add_cooking_methods.sql"
VERIFICATION_FILE="/home/val34/anCuisine/supabase/migrations/QUICK_VERIFICATION.sql"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Cooking Methods Migration Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}ERROR: Migration file not found at $MIGRATION_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}Pre-deployment checklist:${NC}"
echo "1. Have you backed up your database? (y/n)"
read -r backup_done
if [ "$backup_done" != "y" ]; then
    echo -e "${RED}Please backup your database before proceeding${NC}"
    exit 1
fi

echo "2. Have you tested this migration in dev/staging? (y/n)"
read -r tested
if [ "$tested" != "y" ]; then
    echo -e "${YELLOW}WARNING: It's recommended to test in dev/staging first${NC}"
    echo "Continue anyway? (y/n)"
    read -r continue
    if [ "$continue" != "y" ]; then
        exit 0
    fi
fi

echo ""
echo -e "${BLUE}Deployment options:${NC}"
echo "1. Apply via Supabase Dashboard (manual)"
echo "2. Apply via Supabase CLI (automatic)"
echo "3. Show SQL to copy/paste"
echo "4. Cancel"
echo ""
echo "Select option (1-4):"
read -r option

case $option in
    1)
        echo ""
        echo -e "${BLUE}Manual deployment via Supabase Dashboard:${NC}"
        echo "1. Go to your Supabase project dashboard"
        echo "2. Navigate to SQL Editor"
        echo "3. Copy the content from: $MIGRATION_FILE"
        echo "4. Paste and run in SQL Editor"
        echo "5. Verify with: $VERIFICATION_FILE"
        echo ""
        echo -e "${GREEN}Press Enter when done to run verification script...${NC}"
        read -r
        ;;

    2)
        echo ""
        echo -e "${BLUE}Applying migration via Supabase CLI...${NC}"

        # Check if supabase CLI is installed
        if ! command -v supabase &> /dev/null; then
            echo -e "${RED}ERROR: Supabase CLI not found${NC}"
            echo "Install with: npm install -g supabase"
            exit 1
        fi

        # Check if in Supabase project
        if [ ! -f "supabase/config.toml" ]; then
            echo -e "${RED}ERROR: Not in a Supabase project directory${NC}"
            echo "Run from project root: /home/val34/anCuisine"
            exit 1
        fi

        echo "Pushing migration to database..."
        supabase db push

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Migration applied successfully!${NC}"
        else
            echo -e "${RED}Migration failed. Check error messages above.${NC}"
            exit 1
        fi
        ;;

    3)
        echo ""
        echo -e "${BLUE}SQL to copy/paste:${NC}"
        echo -e "${YELLOW}========================================${NC}"
        cat "$MIGRATION_FILE"
        echo -e "${YELLOW}========================================${NC}"
        echo ""
        echo -e "${GREEN}Copy the SQL above and run it in your Supabase SQL Editor${NC}"
        exit 0
        ;;

    4)
        echo "Deployment cancelled."
        exit 0
        ;;

    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

# Run verification if we got here
if [ -f "$VERIFICATION_FILE" ]; then
    echo ""
    echo -e "${BLUE}Running verification checks...${NC}"
    echo "Please run the following SQL in your Supabase SQL Editor:"
    echo ""
    echo -e "${YELLOW}========================================${NC}"
    cat "$VERIFICATION_FILE"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    echo -e "${GREEN}Verification SQL displayed above.${NC}"
    echo "All checks should show '✓ PASS'"
else
    echo -e "${YELLOW}WARNING: Verification file not found at $VERIFICATION_FILE${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Deployment process complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify all checks passed (should show ✓ PASS)"
echo "2. Update frontend code with new cooking_methods field"
echo "3. Deploy frontend changes"
echo "4. Run E2E tests"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "- Migration guide: supabase/migrations/MIGRATION_GUIDE.md"
echo "- Architecture: supabase/migrations/ARCHITECTURE_COOKING_METHODS.md"
echo "- Tests: supabase/migrations/TEST_COOKING_METHODS.sql"
echo ""
echo -e "${GREEN}Happy cooking! 🍳${NC}"
