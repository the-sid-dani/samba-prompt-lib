#!/bin/bash

# Langfuse Setup Script
# This script helps you set up Langfuse for the SambaTV Prompt Library

set -e

echo "🚀 Langfuse Setup for SambaTV Prompt Library"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo "Creating .env.local from template..."
    cp .env.local.example .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
fi

# Check if Langfuse keys are configured
if grep -q "LANGFUSE_PUBLIC_KEY=pk-lf-your-public-key" .env.local || ! grep -q "LANGFUSE_PUBLIC_KEY=" .env.local; then
    echo ""
    echo -e "${YELLOW}⚠️  Langfuse API keys not configured${NC}"
    echo ""
    echo "Please follow these steps:"
    echo ""
    echo -e "${BLUE}1. Create a Langfuse account:${NC}"
    echo "   → Open: https://cloud.langfuse.com/signup"
    echo ""
    echo -e "${BLUE}2. Create a new project:${NC}"
    echo "   → Name it: 'SambaTV Prompt Library'"
    echo ""
    echo -e "${BLUE}3. Get your API keys:${NC}"
    echo "   → Go to Settings → API Keys"
    echo "   → Create a new key pair"
    echo "   → Copy the Public Key and Secret Key"
    echo ""
    echo -e "${BLUE}4. Add keys to .env.local:${NC}"
    echo "   LANGFUSE_PUBLIC_KEY=pk-lf-..."
    echo "   LANGFUSE_SECRET_KEY=sk-lf-..."
    echo ""
    read -p "Press Enter once you've added your API keys to .env.local..."
fi

# Enable Langfuse
echo ""
echo "Enabling Langfuse integration..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/NEXT_PUBLIC_LANGFUSE_ENABLED=false/NEXT_PUBLIC_LANGFUSE_ENABLED=true/" .env.local
else
    # Linux
    sed -i "s/NEXT_PUBLIC_LANGFUSE_ENABLED=false/NEXT_PUBLIC_LANGFUSE_ENABLED=true/" .env.local
fi
echo -e "${GREEN}✓ Langfuse enabled${NC}"

# Check if packages are installed
if ! npm list langfuse >/dev/null 2>&1; then
    echo ""
    echo "Installing Langfuse packages..."
    npm install langfuse langfuse-node
    echo -e "${GREEN}✓ Langfuse packages installed${NC}"
else
    echo -e "${GREEN}✓ Langfuse packages already installed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Langfuse setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start your development server: npm run dev"
echo "2. Use the playground to generate a response"
echo "3. View traces at: https://cloud.langfuse.com"
echo ""
echo "Langfuse features now available:"
echo "  ✓ Trace all LLM calls"
echo "  ✓ Track token usage and costs"
echo "  ✓ Monitor latency and errors"
echo "  ✓ View beautiful analytics"
echo ""
echo "To view your traces:"
echo "  → Open: https://cloud.langfuse.com"
echo "  → Select your project"
echo "  → Go to 'Traces' tab"
echo ""