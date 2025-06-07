#!/usr/bin/env node

/**
 * Responsive Testing Script
 * Automatically tests the application at different viewport sizes
 * and captures screenshots for visual inspection
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Define viewport sizes to test
const viewports = {
  'mobile-small': { width: 320, height: 568, deviceScaleFactor: 2 },
  'mobile-medium': { width: 375, height: 667, deviceScaleFactor: 2 },
  'mobile-large': { width: 414, height: 896, deviceScaleFactor: 3 },
  'tablet-portrait': { width: 768, height: 1024, deviceScaleFactor: 2 },
  'tablet-landscape': { width: 1024, height: 768, deviceScaleFactor: 2 },
  'desktop': { width: 1280, height: 800, deviceScaleFactor: 1 },
  'desktop-large': { width: 1920, height: 1080, deviceScaleFactor: 1 }
};

// Pages to test
const pages = [
  { name: 'home', url: '/' },
  { name: 'submit', url: '/submit' },
  { name: 'profile', url: '/profile' },
  { name: 'prompt-detail', url: '/prompt/1' }, // Adjust ID as needed
  { name: 'playground', url: '/playground' },
  { name: 'leaderboard', url: '/leaderboard' }
];

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
}

async function testResponsive() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for automated testing
    defaultViewport: null
  });

  const screenshotDir = path.join(__dirname, '..', 'responsive-screenshots');
  await ensureDir(screenshotDir);

  console.log('🚀 Starting responsive testing...\n');

  for (const [viewportName, viewport] of Object.entries(viewports)) {
    console.log(`📱 Testing ${viewportName} (${viewport.width}x${viewport.height})`);
    
    const viewportDir = path.join(screenshotDir, viewportName);
    await ensureDir(viewportDir);

    const page = await browser.newPage();
    await page.setViewport(viewport);

    for (const pageInfo of pages) {
      try {
        const url = `http://localhost:3000${pageInfo.url}`;
        console.log(`  📄 Testing ${pageInfo.name}...`);
        
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Wait a bit for any animations to complete
        await page.waitForTimeout(1000);

        // Take screenshot
        const screenshotPath = path.join(viewportDir, `${pageInfo.name}.png`);
        await page.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });

        // Check for common responsive issues
        const issues = await page.evaluate(() => {
          const issues = [];
          
          // Check for horizontal overflow
          if (document.documentElement.scrollWidth > window.innerWidth) {
            issues.push('Horizontal scroll detected');
          }

          // Check for elements that might be too small on mobile
          const buttons = document.querySelectorAll('button, a');
          buttons.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
              issues.push(`Small touch target: ${el.textContent || el.className}`);
            }
          });

          // Check for text that might be too small
          const textElements = document.querySelectorAll('p, span, div');
          textElements.forEach(el => {
            const fontSize = window.getComputedStyle(el).fontSize;
            if (parseInt(fontSize) < 12) {
              issues.push(`Small text detected: ${fontSize}`);
            }
          });

          return issues;
        });

        if (issues.length > 0) {
          console.log(`    ⚠️  Issues found:`);
          issues.forEach(issue => console.log(`      - ${issue}`));
        } else {
          console.log(`    ✅ No issues detected`);
        }

      } catch (error) {
        console.error(`    ❌ Error testing ${pageInfo.name}:`, error.message);
      }
    }

    await page.close();
    console.log('');
  }

  await browser.close();
  console.log(`✨ Testing complete! Screenshots saved to: ${screenshotDir}`);
}

// Run the test
testResponsive().catch(console.error); 