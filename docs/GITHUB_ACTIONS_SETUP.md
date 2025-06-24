# GitHub Actions Setup Guide

This guide explains how to fix the "Refresh AI models" GitHub Action failure by properly configuring API key secrets.

## 🔍 The Problem

The GitHub Action fails with an error like:
```
TypeError: Headers.append: "***"
```

This happens because the required API key secrets aren't configured in your GitHub repository settings.

## 🛠️ Solution: Configure GitHub Secrets

### Step 1: Get Your API Keys

You need API keys from these providers:

1. **Anthropic (Claude)**: https://console.anthropic.com/
2. **Google AI Studio (Gemini)**: https://aistudio.google.com/app/apikey  
3. **OpenRouter**: https://openrouter.ai/keys

### Step 2: Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Click **Settings** (in the top repository menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret:

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | [Anthropic Console](https://console.anthropic.com/) |
| `GOOGLE_AI_API_KEY` | `AIza...` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `OPENROUTER_API_KEY` | `sk-or-...` | [OpenRouter Keys](https://openrouter.ai/keys) |

### Step 3: Test Locally (Optional but Recommended)

Before pushing to GitHub, test your API keys locally:

```bash
# Set your API keys in .env.local
cp .env.example .env.local
# Edit .env.local with your actual API keys

# Test the keys
pnpm test:api-keys

# If successful, test the full refresh
pnpm refresh:models
```

### Step 4: Trigger the Action

After adding the secrets:

1. Go to **Actions** tab in your GitHub repo
2. Find the "refresh-models" workflow
3. Click **Run workflow** to test it manually
4. Or push any commit to trigger it automatically

## 🔧 Troubleshooting

### "API key not set or invalid"
- Double-check the secret name matches exactly
- Ensure there are no extra spaces in the API key
- Verify the API key is valid by testing locally first

### "HTTP 401: Unauthorized"
- Your API key might be expired or revoked
- Regenerate the API key from the provider's dashboard
- Update the GitHub secret with the new key

### "HTTP 429: Rate Limit Exceeded"
- The workflow runs daily at 08:08 UTC
- Consider reducing frequency if you hit rate limits
- Some providers have free tier limits

### Still not working?
Run the test script locally to debug:

```bash
# This will show you exactly which API keys are failing
pnpm test:api-keys
```

## 📋 Workflow Details

The `refresh-models.yml` workflow:
- Runs daily at 08:08 UTC (midnight PT)
- Can be triggered manually
- Fetches latest models from AI providers
- Updates `lib/ai/generated-models.ts`
- Commits changes back to the repo

### Environment Variables Used

```yaml
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  GEMINI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}
  OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
```

## 🔒 Security Notes

- GitHub automatically masks secret values in logs
- Secrets are only accessible to repository collaborators
- Use separate API keys for production vs development
- Consider rotating API keys periodically

## 📞 Need Help?

If you're still having issues:
1. Check the Actions logs for detailed error messages
2. Test your API keys locally with `pnpm test:api-keys`
3. Verify your GitHub repository permissions
4. Make sure you have admin access to add secrets 