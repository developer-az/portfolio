/**
 * Debug helper script for Next.js application
 * Run with: node debug.js
 */

const fs = require('fs');
const path = require('path');

// Directories to check
const requiredDirs = [
  'src',
  'src/app',
  'src/components',
  'src/context',
  'public',
  'public/fonts',
  'public/images'
];

// Critical files to check
const criticalFiles = [
  'src/app/layout.js',
  'src/app/page.js',
  'src/app/globals.css',
  'src/app/theme-variables.scss',
  'src/components/Preloader/index.jsx',
  'src/components/Preloader/anim.js',
  'src/components/Preloader/style.module.scss',
  'src/components/FloatingNav/index.jsx',
  'src/components/FloatingNav/FloatingNav.module.scss',
  'src/components/EnhancedBackground/index.jsx',
  'next.config.js',
  'package.json'
];

// Required npm packages
const requiredPackages = [
  'next',
  'react',
  'react-dom',
  'framer-motion',
  'gsap',
  'sass',
  'three'
];

console.log('🔍 Starting Next.js portfolio diagnostic check...\n');

// Check directories
console.log('📁 Checking directory structure...');
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`  ${exists ? '✅' : '❌'} ${dir}`);
  
  if (!exists) {
    console.log(`  Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Check critical files
console.log('\n📄 Checking critical files...');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check package.json
console.log('\n📦 Checking package.json dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  requiredPackages.forEach(pkg => {
    const exists = !!dependencies[pkg];
    console.log(`  ${exists ? '✅' : '❌'} ${pkg}`);
  });
} catch (error) {
  console.log('  ❌ Error reading package.json:', error.message);
}

// Check Next.js config
console.log('\n⚙️ Checking Next.js configuration...');
try {
  if (fs.existsSync('next.config.js')) {
    const configFile = fs.readFileSync('next.config.js', 'utf8');
    console.log('  ✅ next.config.js exists');
    
    const hasExperimental = configFile.includes('experimental');
    console.log(`  ${hasExperimental ? '✅' : '⚠️'} experimental settings ${hasExperimental ? 'found' : 'not found'}`);
    
    const hasOptimizations = configFile.includes('optimizeCss') || configFile.includes('optimizePackageImports');
    console.log(`  ${hasOptimizations ? '✅' : '⚠️'} optimizations ${hasOptimizations ? 'found' : 'not found'}`);
  } else {
    console.log('  ❌ next.config.js not found');
  }
} catch (error) {
  console.log('  ❌ Error checking Next.js configuration:', error.message);
}

console.log('\n✨ Diagnostic check complete!');
console.log('\nTo fix issues:');
console.log('1. Ensure all directories and files are present');
console.log('2. Install missing dependencies with: npm install');
console.log('3. Restart the development server with: npm run dev');
console.log('\nFor more help, check the Next.js documentation: https://nextjs.org/docs\n');