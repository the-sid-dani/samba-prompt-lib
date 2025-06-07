#!/usr/bin/env node

/**
 * Accessibility Audit Script
 * Tests the application for WCAG 2.1 AA compliance using axe-core
 */

const puppeteer = require('puppeteer');
const AxePuppeteer = require('@axe-core/puppeteer').default;
const fs = require('fs').promises;
const path = require('path');

// Pages to audit
const pages = [
  { name: 'home', url: '/', description: 'Home page (PromptExplorer)' },
  { name: 'submit', url: '/submit', description: 'Submit prompt form' },
  { name: 'profile', url: '/profile', description: 'User profile page' },
  { name: 'prompt-detail', url: '/prompt/1', description: 'Prompt detail page' },
  { name: 'playground', url: '/playground', description: 'Prompt playground' },
  { name: 'leaderboard', url: '/leaderboard', description: 'Leaderboard page' }
];

// WCAG 2.1 AA rules to test
const wcagTags = [
  'wcag2a',
  'wcag2aa',
  'wcag21a', 
  'wcag21aa',
  'best-practice'
];

async function runAccessibilityAudit() {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      totalViolations: 0,
      totalPasses: 0,
      totalIncomplete: 0,
      totalInapplicable: 0,
      criticalIssues: 0,
      seriousIssues: 0,
      moderateIssues: 0,
      minorIssues: 0
    },
    pageResults: [],
    commonIssues: new Map()
  };

  console.log('🔍 Starting Accessibility Audit...\n');

  for (const pageInfo of pages) {
    console.log(`📄 Auditing ${pageInfo.description}...`);
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    try {
      const url = `http://localhost:3000${pageInfo.url}`;
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Run axe accessibility tests
      const axe = new AxePuppeteer(page);
      const axeResults = await axe
        .withTags(wcagTags)
        .analyze();
      
      // Process results
      const pageResult = {
        page: pageInfo.name,
        url: pageInfo.url,
        description: pageInfo.description,
        violations: axeResults.violations.length,
        passes: axeResults.passes.length,
        incomplete: axeResults.incomplete.length,
        inapplicable: axeResults.inapplicable.length,
        violationDetails: axeResults.violations.map(violation => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.length,
          targets: violation.nodes.map(node => node.target)
        }))
      };
      
      // Update summary
      results.summary.totalViolations += pageResult.violations;
      results.summary.totalPasses += pageResult.passes;
      results.summary.totalIncomplete += pageResult.incomplete;
      results.summary.totalInapplicable += pageResult.inapplicable;
      
      // Count issues by impact
      axeResults.violations.forEach(violation => {
        switch(violation.impact) {
          case 'critical':
            results.summary.criticalIssues++;
            break;
          case 'serious':
            results.summary.seriousIssues++;
            break;
          case 'moderate':
            results.summary.moderateIssues++;
            break;
          case 'minor':
            results.summary.minorIssues++;
            break;
        }
        
        // Track common issues
        const count = results.commonIssues.get(violation.id) || 0;
        results.commonIssues.set(violation.id, count + 1);
      });
      
      results.pageResults.push(pageResult);
      
      // Log immediate feedback
      if (pageResult.violations === 0) {
        console.log(`  ✅ No accessibility violations found!`);
      } else {
        console.log(`  ⚠️  Found ${pageResult.violations} violations`);
        pageResult.violationDetails.forEach(violation => {
          console.log(`    - ${violation.impact?.toUpperCase()}: ${violation.help}`);
        });
      }
      
    } catch (error) {
      console.error(`  ❌ Error auditing ${pageInfo.name}:`, error.message);
      results.pageResults.push({
        page: pageInfo.name,
        error: error.message
      });
    }
    
    await page.close();
  }
  
  await browser.close();
  
  // Convert Map to array for JSON serialization
  results.commonIssues = Array.from(results.commonIssues.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, count }));
  
  // Save results
  const reportPath = path.join(__dirname, 'accessibility-report.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  
  // Generate HTML report
  await generateHTMLReport(results);
  
  console.log('\n✨ Audit complete!');
  console.log(`📊 Results saved to: ${reportPath}`);
  console.log(`📄 HTML report saved to: ${path.join(__dirname, 'accessibility-report.html')}`);
  
  // Print summary
  console.log('\n📈 Summary:');
  console.log(`  Total violations: ${results.summary.totalViolations}`);
  console.log(`  - Critical: ${results.summary.criticalIssues}`);
  console.log(`  - Serious: ${results.summary.seriousIssues}`);
  console.log(`  - Moderate: ${results.summary.moderateIssues}`);
  console.log(`  - Minor: ${results.summary.minorIssues}`);
  console.log(`  Total passes: ${results.summary.totalPasses}`);
  
  return results;
}

async function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Audit Report - SambaTV Prompt Web App</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .header {
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
        }
        .summary-card .number {
            font-size: 36px;
            font-weight: bold;
            margin: 0;
        }
        .critical { color: #d32f2f; }
        .serious { color: #f57c00; }
        .moderate { color: #fbc02d; }
        .minor { color: #689f38; }
        .success { color: #388e3c; }
        .page-result {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .violation {
            margin: 15px 0;
            padding: 15px;
            background: #f5f5f5;
            border-left: 4px solid;
            border-radius: 4px;
        }
        .violation.critical { border-color: #d32f2f; }
        .violation.serious { border-color: #f57c00; }
        .violation.moderate { border-color: #fbc02d; }
        .violation.minor { border-color: #689f38; }
        .targets {
            margin-top: 10px;
            font-family: monospace;
            font-size: 12px;
            background: #e8e8e8;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
        .common-issues {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        a {
            color: #1976d2;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Accessibility Audit Report</h1>
        <p>SambaTV Prompt Web App - ${new Date(results.timestamp).toLocaleString()}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Total Violations</h3>
            <p class="number ${results.summary.totalViolations > 0 ? 'serious' : 'success'}">
                ${results.summary.totalViolations}
            </p>
        </div>
        <div class="summary-card">
            <h3>Critical Issues</h3>
            <p class="number critical">${results.summary.criticalIssues}</p>
        </div>
        <div class="summary-card">
            <h3>Serious Issues</h3>
            <p class="number serious">${results.summary.seriousIssues}</p>
        </div>
        <div class="summary-card">
            <h3>Moderate Issues</h3>
            <p class="number moderate">${results.summary.moderateIssues}</p>
        </div>
        <div class="summary-card">
            <h3>Minor Issues</h3>
            <p class="number minor">${results.summary.minorIssues}</p>
        </div>
        <div class="summary-card">
            <h3>Passed Tests</h3>
            <p class="number success">${results.summary.totalPasses}</p>
        </div>
    </div>

    ${results.commonIssues.length > 0 ? `
    <div class="common-issues">
        <h2>Most Common Issues</h2>
        <ol>
            ${results.commonIssues.slice(0, 5).map(issue => 
                `<li><strong>${issue.id}</strong> - Found on ${issue.count} page(s)</li>`
            ).join('')}
        </ol>
    </div>
    ` : ''}

    <h2>Page-by-Page Results</h2>
    ${results.pageResults.map(page => `
        <div class="page-result">
            <h3>${page.description}</h3>
            <p><strong>URL:</strong> ${page.url}</p>
            <p><strong>Violations:</strong> ${page.violations || 0} | 
               <strong>Passes:</strong> ${page.passes || 0}</p>
            
            ${page.violationDetails && page.violationDetails.length > 0 ? `
                <h4>Violations:</h4>
                ${page.violationDetails.map(violation => `
                    <div class="violation ${violation.impact}">
                        <strong>${violation.impact?.toUpperCase()}: ${violation.help}</strong>
                        <p>${violation.description}</p>
                        <p><a href="${violation.helpUrl}" target="_blank">Learn more →</a></p>
                        <div class="targets">
                            <strong>Affected elements (${violation.nodes}):</strong><br>
                            ${violation.targets.slice(0, 3).map(t => t.join(' > ')).join('<br>')}
                            ${violation.targets.length > 3 ? '<br>...' : ''}
                        </div>
                    </div>
                `).join('')}
            ` : '<p>✅ No violations found!</p>'}
        </div>
    `).join('')}
</body>
</html>
  `;
  
  const htmlPath = path.join(__dirname, 'accessibility-report.html');
  await fs.writeFile(htmlPath, html);
}

// Run the audit
runAccessibilityAudit().catch(console.error); 