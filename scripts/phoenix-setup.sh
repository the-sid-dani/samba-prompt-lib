#!/bin/bash

# Phoenix Setup Script
# This script helps you set up and manage Phoenix for the SambaTV Prompt Library

set -e

echo "🚀 Phoenix Setup for SambaTV Prompt Library"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

# Function to generate a secure key
generate_key() {
    openssl rand -base64 32 2>/dev/null || echo "$(date +%s | sha256sum | base64 | head -c 32)"
}

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo "Creating .env.local from template..."
    cp .env.local.example .env.local
    
    # Generate Phoenix secret key
    PHOENIX_KEY=$(generate_key)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your-phoenix-secret-key/$PHOENIX_KEY/" .env.local
    else
        # Linux
        sed -i "s/your-phoenix-secret-key/$PHOENIX_KEY/" .env.local
    fi
    
    echo -e "${GREEN}✓ Created .env.local with generated Phoenix secret key${NC}"
    echo -e "${YELLOW}⚠️  Please update other environment variables in .env.local${NC}"
fi

# Check if Phoenix environment variables are set
if ! grep -q "PHOENIX_SECRET_KEY=" .env.local || grep -q "PHOENIX_SECRET_KEY=your-phoenix-secret-key" .env.local; then
    echo -e "${YELLOW}⚠️  Phoenix secret key not configured${NC}"
    echo "Generating new Phoenix secret key..."
    PHOENIX_KEY=$(generate_key)
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/PHOENIX_SECRET_KEY=.*/PHOENIX_SECRET_KEY=$PHOENIX_KEY/" .env.local
    else
        # Linux
        sed -i "s/PHOENIX_SECRET_KEY=.*/PHOENIX_SECRET_KEY=$PHOENIX_KEY/" .env.local
    fi
    
    echo -e "${GREEN}✓ Updated Phoenix secret key${NC}"
fi

# Start Phoenix services
echo ""
echo "Starting Phoenix services..."
docker-compose up -d

# Wait for services to be ready
echo ""
echo "Waiting for services to start..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "phoenix.*Up"; then
    echo -e "${GREEN}✓ Phoenix is running${NC}"
else
    echo -e "${RED}❌ Phoenix failed to start${NC}"
    echo "Check logs with: docker-compose logs phoenix"
    exit 1
fi

if docker-compose ps | grep -q "phoenix-postgres.*Up"; then
    echo -e "${GREEN}✓ Phoenix PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ Phoenix PostgreSQL failed to start${NC}"
    echo "Check logs with: docker-compose logs phoenix-postgres"
    exit 1
fi

if docker-compose ps | grep -q "redis.*Up"; then
    echo -e "${GREEN}✓ Redis is running${NC}"
else
    echo -e "${RED}❌ Redis failed to start${NC}"
    echo "Check logs with: docker-compose logs redis"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Phoenix setup complete!${NC}"
echo ""
echo "Phoenix is now available at: http://localhost:6006"
echo ""
echo "Useful commands:"
echo "  View logs:     docker-compose logs -f phoenix"
echo "  Stop Phoenix:  docker-compose stop"
echo "  Start Phoenix: docker-compose start"
echo "  Reset Phoenix: docker-compose down -v && docker-compose up -d"
echo ""
echo "Next steps:"
echo "1. Verify Phoenix is accessible at http://localhost:6006"
echo "2. Continue with Task 33: Create the authentication bridge"
echo ""