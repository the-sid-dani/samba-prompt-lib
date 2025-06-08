# AI Model Integration Setup

The playground now supports real AI model integrations! To use the AI features, you'll need to set up API keys for the providers you want to use.

## ✅ Supported Models

### 🔵 Google Gemini (Latest Flash & Pro Series)
- `gemini-1.5-flash` - Gemini 1.5 Flash (⚡ Fast & Efficient)
- `gemini-1.5-flash-latest` - Gemini 1.5 Flash (Latest)
- `gemini-1.5-flash-002` - Gemini 1.5 Flash-002
- `gemini-1.5-flash-8b` - Gemini 1.5 Flash-8B (Smallest)
- `gemini-1.5-pro` - Gemini 1.5 Pro (🎯 Most Capable)
- `gemini-1.5-pro-latest` - Gemini 1.5 Pro (Latest)
- `gemini-1.5-pro-002` - Gemini 1.5 Pro-002
- `gemini-pro` - Gemini Pro (Legacy)
- `gemini-pro-latest` - Gemini Pro (Legacy Latest)

### 🟣 Anthropic Claude (Latest 3.5 & 3.0 Series)
- `claude-3-5-sonnet-20241022` - Claude 3.5 Sonnet (✨ Latest & Best)
- `claude-3-5-sonnet-20240620` - Claude 3.5 Sonnet
- `claude-3-5-haiku-20241022` - Claude 3.5 Haiku (⚡ Fast)
- `claude-3-opus-20240229` - Claude 3 Opus (🎯 Most Capable)
- `claude-3-sonnet-20240229` - Claude 3 Sonnet
- `claude-3-haiku-20240307` - Claude 3 Haiku

### 🟠 OpenRouter (Multiple Providers)
- `gpt-4o` - GPT-4 Omni
- `gpt-4o-mini` - GPT-4 Omni Mini (⚡ Fast & Affordable)
- `gpt-4-turbo` - GPT-4 Turbo
- `gpt-3.5-turbo` - GPT-3.5 Turbo

## 🎯 Model Recommendations

### **For Speed & Efficiency**
- ⚡ **Gemini 1.5 Flash** - Perfect for fast responses and cost-effective usage
- ⚡ **Claude 3.5 Haiku** - Lightning fast for simple tasks
- ⚡ **GPT-4o Mini** - Affordable and quick

### **For Maximum Capability**
- 🎯 **Claude 3.5 Sonnet (Latest)** - Best overall performance and reasoning
- 🎯 **Gemini 1.5 Pro** - Excellent for complex tasks with huge context
- 🎯 **Claude 3 Opus** - Premier reasoning and analysis

### **For Different Use Cases**
- **Coding & Analysis:** Claude 3.5 Sonnet, Gemini 1.5 Pro
- **Creative Writing:** Claude 3.5 Sonnet, GPT-4o
- **Quick Q&A:** Gemini 1.5 Flash, Claude 3.5 Haiku
- **Long Documents:** Gemini 1.5 Pro (2M+ tokens), Claude 3.5 Sonnet

## 🔑 API Key Setup

### 1. Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com)
2. Create an API key for Gemini Pro
3. Add to your `.env.local` file:
```bash
GOOGLE_AI_API_KEY=your_gemini_api_key_here
```

### 2. Anthropic Claude API
1. Sign up at [Anthropic Console](https://console.anthropic.com)
2. Create an API key
3. Add to your `.env.local` file:
```bash
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### 3. OpenRouter API
1. Sign up at [OpenRouter](https://openrouter.ai)
2. Create an API key
3. Add to your `.env.local` file:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## 📝 Complete .env.local Example

Create a `.env.local` file in your project root:

```bash
# AI Model API Keys
GOOGLE_AI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_claude_api_key_here  
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Set app URL for OpenRouter
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 🚀 Usage

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the playground:**
   ```
   http://localhost:3001/playground
   ```

3. **Select your model** from the dropdown in the settings panel

4. **Start chatting!** The playground will route to the appropriate AI provider automatically.

## 🔧 Features

- **Smart Model Routing** - Automatically routes to the right provider
- **Error Handling** - Clear error messages for API issues
- **Parameter Controls** - Temperature, max tokens, top-p, etc.
- **Usage Tracking** - See token usage for cost monitoring
- **Template Variables** - Use `{{variable}}` syntax in prompts

## 🎯 Notes

- You only need API keys for the providers you want to use
- Models will be grayed out if their API key isn't configured  
- OpenRouter provides access to multiple model providers through one API
- The playground remembers your settings between sessions

## 🔄 Automatic Model Updates

Keep your model list up-to-date automatically:

```bash
# Update models from provider APIs
npm run update-models
```

This script will:
- 🔍 Fetch the latest models from each provider's API
- 📝 Update the `lib/ai/types.ts` file with new models
- 🧹 Handle errors gracefully with fallback lists
- 🚀 Ensure you always have the newest models available

**Recommended:** Run this weekly or when you notice new models from providers!

Enjoy testing prompts with real AI models! 🎉 