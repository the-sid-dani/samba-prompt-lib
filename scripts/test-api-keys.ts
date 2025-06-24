#!/usr/bin/env tsx
/**
 * Test API Keys Script
 * Run this locally to verify your API keys work before GitHub Actions deployment
 * Usage: npx tsx scripts/test-api-keys.ts
 */

interface ApiTest {
  provider: string;
  envVar: string;
  testUrl: string;
  testRequest: () => Promise<{ ok: boolean; message: string }>;
}

const tests: ApiTest[] = [
  {
    provider: 'Anthropic',
    envVar: 'ANTHROPIC_API_KEY',
    testUrl: 'https://api.anthropic.com/v1/models',
    testRequest: async () => {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key || key === '***' || key === 'undefined') {
        return { ok: false, message: 'API key not set or invalid' };
      }

      try {
        const response = await fetch('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          return { ok: true, message: `Found ${data.data?.length || 0} models` };
        } else {
          return { ok: false, message: `HTTP ${response.status}: ${response.statusText}` };
        }
      } catch (error) {
        return { ok: false, message: `Request failed: ${error}` };
      }
    }
  },
  {
    provider: 'Google Gemini',
    envVar: 'GEMINI_API_KEY',
    testUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    testRequest: async () => {
      const key = process.env.GEMINI_API_KEY;
      if (!key || key === '***' || key === 'undefined') {
        return { ok: false, message: 'API key not set or invalid' };
      }

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        
        if (response.ok) {
          const data = await response.json();
          return { ok: true, message: `Found ${data.models?.length || 0} models` };
        } else {
          return { ok: false, message: `HTTP ${response.status}: ${response.statusText}` };
        }
      } catch (error) {
        return { ok: false, message: `Request failed: ${error}` };
      }
    }
  },
  {
    provider: 'OpenRouter',
    envVar: 'OPENROUTER_API_KEY',
    testUrl: 'https://openrouter.ai/api/v1/models',
    testRequest: async () => {
      const key = process.env.OPENROUTER_API_KEY;
      if (!key || key === '***' || key === 'undefined') {
        return { ok: false, message: 'API key not set or invalid' };
      }

      try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          return { ok: true, message: `Found ${data.data?.length || 0} models` };
        } else {
          return { ok: false, message: `HTTP ${response.status}: ${response.statusText}` };
        }
      } catch (error) {
        return { ok: false, message: `Request failed: ${error}` };
      }
    }
  }
];

async function testApiKeys() {
  console.log('🔍 Testing API Keys...\n');
  
  let allPassed = true;
  
  for (const test of tests) {
    process.stdout.write(`${test.provider.padEnd(15)} `);
    
    const result = await test.testRequest();
    
    if (result.ok) {
      console.log(`✅ ${result.message}`);
    } else {
      console.log(`❌ ${result.message}`);
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 All API keys are working! Your GitHub Action should succeed.');
  } else {
    console.log('⚠️  Some API keys failed. Check your environment variables:');
    console.log('\nRequired environment variables:');
    tests.forEach(test => {
      const key = process.env[test.envVar];
      const status = key && key !== '***' && key !== 'undefined' ? '🔑' : '❌';
      console.log(`  ${status} ${test.envVar}`);
    });
    
    console.log('\n💡 To fix:');
    console.log('  1. Copy .env.example to .env.local');
    console.log('  2. Add your API keys to .env.local');
    console.log('  3. For GitHub Actions: Add secrets in repo Settings → Secrets and variables → Actions');
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Run the test
testApiKeys().catch(console.error); 