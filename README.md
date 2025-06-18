# SambaTV AI Prompt Library 🚀

> **Internal Platform**: A centralized AI prompt management and testing platform for SambaTV teams to discover, create, share, and optimize AI prompts across various models and use cases.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue?logo=tailwindcss)](https://tailwindcss.com/)

## 🎯 **Why This Exists at Samba**

As SambaTV expands its AI initiatives across teams (Data Science, Engineering, Product), we needed a centralized platform where:

- **Data Scientists** can share proven prompts for content analysis and recommendation systems
- **Engineers** can discover tested prompts for feature development
- **Product Teams** can prototype AI features with validated prompts
- **Leadership** can understand AI prompt usage patterns and ROI

This eliminates prompt silos, reduces AI experimentation time, and ensures consistent AI quality across Samba products.

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js 15    │    │   Supabase DB    │    │  AI Providers   │
│   (App Router)  │────│   (PostgreSQL)   │    │  Gemini/Claude  │
│                 │    │                  │    │   OpenRouter    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
    ┌────▼────┐              ┌────▼────┐              ┌────▼────┐
    │ shadcn/ │              │NextAuth │              │Playground│
    │ UI + TW │              │+ Google │              │Testing  │
    └─────────┘              │ OAuth   │              └─────────┘
                             └─────────┘
```

### **Key Components:**
- **Frontend**: Next.js 15 with App Router for optimal performance
- **Authentication**: NextAuth.js with Google OAuth (restricted to @samba.tv emails)  
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **AI Integration**: Multi-provider support (Gemini, Claude, OpenRouter)

---

## ✨ **Core Features**

### 🔐 **Enterprise Authentication**
- **Single Sign-On**: Google OAuth restricted to `@samba.tv` domains
- **Role-Based Access**: Admin panel for content management
- **Security**: Row-Level Security policies in Supabase

### 📝 **Prompt Management**
- **Create & Edit**: Rich markdown editor with template variables
- **Versioning**: Track prompt iterations and improvements
- **Forking**: Clone and modify existing prompts
- **Categories**: Organize by use case (Analysis, Content, Code, etc.)
- **Tagging**: Flexible labeling system for discoverability

### 🧪 **AI Playground** 
- **Multi-Model Testing**: Test prompts across Gemini, Claude, and OpenRouter models
- **Cost Tracking**: Real-time API cost estimation per request
- **Template Variables**: Dynamic prompt customization
- **Response Comparison**: Side-by-side model performance analysis

### 📊 **Analytics & Insights**
- **Usage Analytics**: Track prompt performance and adoption
- **User Profiles**: See contributions and favorites
- **Search & Discovery**: Advanced filtering and search capabilities

---

## 🚀 **Quick Start for Samba Developers**

### **Prerequisites**
```bash
# Required versions
Node.js >= 18.0.0
npm >= 8.0.0

# Recommended tools
pnpm (faster than npm)
VS Code + Tailwind CSS IntelliSense extension
```

### **1. Clone & Install**
   ```bash
git clone https://github.com/the-sid-dani/samba-prompt-lib.git
cd samba-prompt-lib
pnpm install  # or npm install
   ```

### **2. Environment Setup**
```bash
# Copy example environment file
cp .env.example .env.local

# Fill in the following required variables:
   ```

#### **Essential Environment Variables**
```bash
# === NextAuth Configuration ===
   NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-randomly-generated-secret-here

# === Google OAuth (Contact IT for Samba credentials) ===
GOOGLE_CLIENT_ID=your-samba-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-samba-google-oauth-client-secret

# === Supabase Database ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# === AI Provider API Keys (Optional for development) ===
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
ANTHROPIC_API_KEY=your-claude-api-key  
OPENROUTER_API_KEY=your-openrouter-api-key
```

### **3. Database Setup**
```bash
# Run Supabase migrations (if using local Supabase)
npx supabase db reset

# Or connect to existing Samba Supabase instance
# (Ask the team for production/staging database URLs)
```

### **4. Development Server**
```bash
pnpm dev  # or npm run dev

# Open http://localhost:3000
# Sign in with your @samba.tv Google account
```

---

## 📁 **Project Structure**

```
samba-prompt-lib/
├── app/                    # Next.js App Router pages
│   ├── (static)/          # Static pages (layout without nav)
│   ├── actions/           # Server actions (prompts, auth, etc.)
│   ├── admin/             # Admin panel pages  
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── categories/        # Category management
│   ├── playground/        # AI testing playground
│   ├── profile/           # User profiles
│   ├── prompt/[id]/       # Individual prompt pages
│   └── submit/            # Prompt creation form
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui base components
│   ├── navigation/       # Navigation components
│   ├── playground/       # Playground-specific components
│   └── prompt-explorer/  # Main prompt discovery interface
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── ai/              # AI provider integrations
│   ├── auth.ts          # NextAuth configuration
│   └── utils.ts         # General utilities
├── supabase/            # Database migrations and setup
├── types/               # TypeScript type definitions
└── utils/supabase/      # Supabase client configurations
```

---

## 🔧 **Development Guide**

### **Key Technologies & Decisions**

| Technology | Version | Why We Chose It |
|------------|---------|-----------------|
| **Next.js** | 15 | Latest features, App Router, excellent SEO for internal discovery |
| **TypeScript** | 5+ | Type safety, better developer experience, scales with team growth |
| **Supabase** | Latest | PostgreSQL with real-time features, built-in auth, perfect for rapid development |
| **shadcn/ui** | Latest | High-quality components, customizable, consistent with modern design systems |
| **Tailwind CSS** | 3+ | Utility-first CSS, rapid prototyping, excellent developer experience |
| **NextAuth.js** | 4+ | Industry standard auth, Google OAuth integration, session management |

### **Code Conventions**
```typescript
// ✅ Preferred patterns
// 1. Use Server Components by default, Client Components when needed
export default async function HomePage() {
  const prompts = await getPrompts(); // Server-side data fetching
  return <PromptExplorer prompts={prompts} />;
}

// 2. Co-locate related components
app/prompt/[id]/
├── page.tsx              # Main page
├── components/           # Page-specific components
│   └── EditPromptForm.tsx
└── edit/
    └── page.tsx         # Edit sub-page

// 3. Use TypeScript interfaces for all props
interface PromptCardProps {
  prompt: Prompt;
  onFavorite?: (id: string) => void;
  showAuthor?: boolean;
}
```

### **Performance Optimizations**
- **Image Optimization**: Next.js Image component with Supabase storage
- **Code Splitting**: Dynamic imports for AI playground components
- **Caching**: React Query for client-side caching, Next.js cache for API routes
- **Database**: Optimized queries with proper indexing and RLS policies

---

## 🚢 **Deployment**

### **Staging Environment**
```bash
# Staging is automatically deployed from `main` branch
# URL: https://samba-prompt-lib-staging.vercel.app
# Database: Staging Supabase instance
```

### **Production Environment**
```bash
# Production deployments require manual approval
# URL: https://prompts.samba.tv (internal domain)
# Database: Production Supabase instance with backups
```

### **Environment-Specific Configs**
```bash
# Staging
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
GOOGLE_CLIENT_ID=staging-oauth-client-id

# Production  
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
GOOGLE_CLIENT_ID=production-oauth-client-id
```

---

## 🧪 **Testing**

### **Running Tests**
```bash
# Unit tests (Vitest + React Testing Library)
pnpm test

# E2E tests (Playwright) 
pnpm test:e2e

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### **Test Coverage Areas**
- ✅ **Authentication**: Google OAuth flow, session management
- ✅ **Prompt CRUD**: Create, read, update, delete operations  
- ✅ **AI Integration**: Mock API responses, error handling
- ✅ **UI Components**: Component rendering, user interactions
- 🔄 **Performance**: Core Web Vitals, loading times (planned)

---

## 🔒 **Security Considerations**

### **Authentication & Authorization**
- **Domain Restriction**: Only `@samba.tv` email addresses can access
- **Row Level Security**: Supabase RLS policies protect data access
- **API Rate Limiting**: Prevent abuse of AI provider APIs
- **CSRF Protection**: NextAuth.js built-in CSRF protection

### **Data Protection**
- **Environment Variables**: Sensitive keys stored in Vercel environment
- **Database Encryption**: Supabase handles encryption at rest
- **API Key Management**: Separate keys for staging/production
- **Audit Logging**: User actions tracked for compliance

---

## 📊 **Monitoring & Analytics**

### **Performance Monitoring**
- **Core Web Vitals**: Monitored via Vercel Analytics
- **Database Performance**: Supabase dashboard metrics
- **AI API Costs**: Tracked per request and aggregated monthly

### **User Analytics**
- **Prompt Usage**: Most popular prompts and categories
- **User Engagement**: Active users, session duration  
- **Feature Adoption**: Playground usage, prompt creation rates

---

## 🤝 **Contributing**

### **Development Workflow**
1. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
2. **Make Changes**: Follow code conventions and add tests
3. **Test Locally**: Ensure all tests pass and app works correctly
4. **Submit PR**: Create pull request with detailed description
5. **Code Review**: At least one team member review required
6. **Deploy**: Merge to main triggers staging deployment

### **PR Template**
```markdown
## 🎯 Purpose
Brief description of what this PR accomplishes

## 🧪 Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Works on mobile devices

## 📸 Screenshots
Before/after screenshots for UI changes

## 🔗 Related Issues
Closes #123
```

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **"Authentication Error: Domain not allowed"**
```bash
# Solution: Ensure you're using @samba.tv email
# Check Google OAuth configuration in Supabase
```

#### **"Database Connection Failed"**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify Supabase project is active
```

#### **"AI API Rate Limit Exceeded"**  
```bash
# Check API key quotas in respective provider dashboards
# Consider implementing request queuing for high usage
```

#### **"Build Fails on Vercel"**
   ```bash
# Common cause: Missing environment variables
# Solution: Add all required env vars in Vercel dashboard
```

---

## 📞 **Support & Contact**

### **Team Contacts**
- **Tech Lead**: Sid Dani (@sid.dani)
- **Product Owner**: [Product Lead Name]
- **DevOps**: [DevOps Contact]

### **Resources**
- **Slack**: `#ai-prompt-library` channel
- **Confluence**: [Link to technical documentation]
- **Jira**: [Link to project board]
- **Design System**: [Link to Figma/design resources]

### **Emergency Contacts**
- **Production Issues**: `#platform-alerts` Slack channel
- **Security Concerns**: `#security-team` Slack channel

---

## 📋 **Roadmap**

### **Q1 2025**
- [ ] Advanced prompt analytics and A/B testing
- [ ] Integration with Samba's internal AI/ML pipeline
- [ ] Bulk prompt import/export functionality
- [ ] Advanced user roles and permissions

### **Q2 2025**  
- [ ] Real-time collaboration on prompts
- [ ] Integration with Samba's content recommendation engine
- [ ] API for external tool integrations
- [ ] Advanced search with semantic similarity

---

## 📄 **License**

This is a proprietary SambaTV internal project. All rights reserved.

**Not licensed for external use or distribution.**

---

*Built with ❤️ by the SambaTV Engineering Team*

---

## 🔧 **Technical Appendix**

### **Database Schema**
```sql
-- Key tables structure
prompts (
  id, title, content, category_id, user_id, 
  created_at, updated_at, is_public, fork_count
)

users (
  id, email, name, image, role, 
  created_at, last_sign_in_at
)

categories (
  id, name, description, color, icon
)

-- Full schema available in supabase/ directory
```

### **API Endpoints**
```typescript
// Core API routes
GET    /api/prompts              // List prompts with filters
POST   /api/prompts              // Create new prompt
GET    /api/prompts/[id]         // Get specific prompt
PATCH  /api/prompts/[id]         // Update prompt
DELETE /api/prompts/[id]         // Delete prompt

POST   /api/playground/generate  // Test prompt with AI
GET    /api/categories           // List categories
POST   /api/auth/check-admin     // Check admin status
```

### **Environment Variables Reference**
```bash
# === Core Application ===
NEXTAUTH_URL=                    # App URL
NEXTAUTH_SECRET=                 # Random 32+ char string

# === Database ===  
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Public anon key
SUPABASE_SERVICE_ROLE_KEY=       # Private service key

# === Authentication ===
GOOGLE_CLIENT_ID=                # Google OAuth client ID  
GOOGLE_CLIENT_SECRET=            # Google OAuth client secret

# === AI Providers (Optional) ===
GOOGLE_GEMINI_API_KEY=           # Google AI Studio key
ANTHROPIC_API_KEY=               # Anthropic API key
OPENROUTER_API_KEY=              # OpenRouter API key

# === Optional Integrations ===
LANGFUSE_PUBLIC_KEY=             # LLM observability (future)
LANGFUSE_SECRET_KEY=             # LLM observability (future)
```
