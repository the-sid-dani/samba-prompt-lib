#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.blue}🖼️  Image Optimization Audit for SambaTV Prompt Web App${colors.reset}\n`);

// Search for image usage patterns
const searchPatterns = [
  { pattern: '<img\\s+[^>]*src=', description: 'HTML img tags (needs optimization)' },
  { pattern: 'Image\\s+from\\s+["\']next/image["\']', description: 'Next.js Image imports (optimized)' },
  { pattern: 'src=["\'][^"\']*\\.(jpg|jpeg|png|gif|webp|avif)["\']', description: 'Image file references' },
  { pattern: 'OptimizedImage', description: 'Custom OptimizedImage usage (optimized)' }
];

const auditResults = {
  optimized: [],
  needsOptimization: [],
  imageFiles: [],
  recommendations: []
};

// Function to search files for patterns
function searchInFiles(directory, patterns) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && 
        !['node_modules', 'dist', 'build', '.next'].includes(file.name)) {
      searchInFiles(filePath, patterns);
    } else if (file.isFile() && /\.(tsx?|jsx?|js|ts)$/.test(file.name)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      patterns.forEach(({ pattern, description }) => {
        const regex = new RegExp(pattern, 'gi');
        const matches = content.match(regex);
        
        if (matches) {
          const lineNumbers = content.split('\n').map((line, index) => 
            regex.test(line) ? index + 1 : null
          ).filter(Boolean);
          
          if (description.includes('needs optimization')) {
            auditResults.needsOptimization.push({
              file: relativePath,
              pattern: description,
              matches: matches.length,
              lines: lineNumbers
            });
          } else if (description.includes('optimized')) {
            auditResults.optimized.push({
              file: relativePath,
              pattern: description,
              matches: matches.length,
              lines: lineNumbers
            });
          }
        }
      });
    }
  }
}

// Function to find image files
function findImageFiles(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.')) {
      findImageFiles(filePath);
    } else if (file.isFile() && /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(file.name)) {
      const stats = fs.statSync(filePath);
      const relativePath = path.relative(process.cwd(), filePath);
      auditResults.imageFiles.push({
        path: relativePath,
        size: Math.round(stats.size / 1024) + 'KB',
        extension: path.extname(file.name).toLowerCase()
      });
    }
  }
}

// Run the audit
console.log(`${colors.yellow}📊 Scanning codebase for image usage...${colors.reset}\n`);

// Search for image patterns in source files
searchInFiles('./app', searchPatterns);
searchInFiles('./components', searchPatterns);

// Find all image files
findImageFiles('./public');

// Generate recommendations
if (auditResults.needsOptimization.length > 0) {
  auditResults.recommendations.push(
    `🔧 ${auditResults.needsOptimization.length} files contain img tags that should be replaced with Next.js Image components`
  );
}

const largeImages = auditResults.imageFiles.filter(img => 
  parseInt(img.size) > 100 && !img.extension.includes('svg')
);
if (largeImages.length > 0) {
  auditResults.recommendations.push(
    `⚡ ${largeImages.length} images are larger than 100KB and could be optimized`
  );
}

const nonWebPImages = auditResults.imageFiles.filter(img => 
  !['.webp', '.avif'].includes(img.extension) && img.extension !== '.svg'
);
if (nonWebPImages.length > 0) {
  auditResults.recommendations.push(
    `🎨 ${nonWebPImages.length} images could benefit from modern formats (WebP/AVIF)`
  );
}

// Display results
console.log(`${colors.bold}${colors.green}✅ OPTIMIZED IMAGES:${colors.reset}`);
if (auditResults.optimized.length > 0) {
  auditResults.optimized.forEach(item => {
    console.log(`   📁 ${item.file} (${item.matches} occurrences)`);
    console.log(`      ${colors.blue}${item.pattern}${colors.reset}`);
  });
} else {
  console.log(`   ${colors.yellow}No optimized Next.js Image components found${colors.reset}`);
}

console.log(`\n${colors.bold}${colors.red}❌ NEEDS OPTIMIZATION:${colors.reset}`);
if (auditResults.needsOptimization.length > 0) {
  auditResults.needsOptimization.forEach(item => {
    console.log(`   📁 ${item.file}:${item.lines.join(',')} (${item.matches} img tags)`);
    console.log(`      ${colors.red}Replace with Next.js Image component${colors.reset}`);
  });
} else {
  console.log(`   ${colors.green}All img tags have been optimized!${colors.reset}`);
}

console.log(`\n${colors.bold}${colors.blue}📊 IMAGE FILES SUMMARY:${colors.reset}`);
console.log(`   Total images: ${auditResults.imageFiles.length}`);
const totalSize = auditResults.imageFiles.reduce((sum, img) => sum + parseInt(img.size), 0);
console.log(`   Total size: ${Math.round(totalSize / 1024)}MB`);

// Show large images
const veryLargeImages = auditResults.imageFiles.filter(img => parseInt(img.size) > 200);
if (veryLargeImages.length > 0) {
  console.log(`\n   ${colors.yellow}⚠️  Large images (>200KB):${colors.reset}`);
  veryLargeImages.forEach(img => {
    console.log(`      📄 ${img.path} (${img.size})`);
  });
}

console.log(`\n${colors.bold}${colors.blue}🎯 RECOMMENDATIONS:${colors.reset}`);
if (auditResults.recommendations.length > 0) {
  auditResults.recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });
} else {
  console.log(`   ${colors.green}🎉 All images are well optimized!${colors.reset}`);
}

console.log(`\n${colors.bold}${colors.green}✅ PERFORMANCE IMPACT:${colors.reset}`);
console.log(`   • Next.js Image automatically provides WebP/AVIF conversion`);
console.log(`   • Lazy loading reduces initial bundle size`);
console.log(`   • Blur placeholders improve perceived performance`);
console.log(`   • Responsive sizing reduces bandwidth usage`);

console.log(`\n${colors.bold}${colors.blue}🚀 Next Steps:${colors.reset}`);
console.log(`   1. Replace remaining img tags with OptimizedImage component`);
console.log(`   2. Add appropriate sizes prop for responsive images`);
console.log(`   3. Use priority=true for above-the-fold images`);
console.log(`   4. Consider converting large PNGs to WebP format`);
console.log(`   5. Test performance improvements with Lighthouse`);

console.log(`\n${colors.bold}${colors.green}Audit completed! 🎉${colors.reset}\n`); 