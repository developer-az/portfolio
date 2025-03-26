/**
 * Dependency Fixer for Next.js Portfolio
 * Run with: node fix-dependencies.js
 */

const fs = require('fs');
const { execSync } = require('child_process');

const requiredDependencies = {
  "framer-motion": "^10.18.0",
  "gsap": "^3.12.5", 
  "next": "^14.2.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "sass": "^1.72.0",
  "sharp": "^0.33.5",
  "three": "^0.156.1"
};

const devDependencies = {
  "eslint": "^8.56.0",
  "eslint-config-next": "^14.2.0",
  "prettier": "^3.2.5"
};

// Load current package.json
console.log('📦 Checking package.json...');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ package.json found');
} catch (error) {
  console.log('❌ package.json not found or invalid, creating new one...');
  packageJson = {
    "name": "anthony-zhou-portfolio",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    },
    "dependencies": {},
    "devDependencies": {},
    "engines": {
      "node": ">=18.17.0"
    }
  };
}

// Check and fix dependencies
console.log('\n🔍 Checking dependencies...');
const missingDeps = [];
const outdatedDeps = [];

packageJson.dependencies = packageJson.dependencies || {};
packageJson.devDependencies = packageJson.devDependencies || {};

// Check main dependencies
for (const [dep, version] of Object.entries(requiredDependencies)) {
  if (!packageJson.dependencies[dep]) {
    console.log(`❌ Missing dependency: ${dep}`);
    packageJson.dependencies[dep] = version;
    missingDeps.push(`${dep}@${version}`);
  } else if (packageJson.dependencies[dep] !== version) {
    console.log(`⚠️ Outdated dependency: ${dep} (${packageJson.dependencies[dep]} -> ${version})`);
    packageJson.dependencies[dep] = version;
    outdatedDeps.push(`${dep}@${version}`);
  } else {
    console.log(`✅ Dependency correct: ${dep}@${version}`);
  }
}

// Check dev dependencies
for (const [dep, version] of Object.entries(devDependencies)) {
  if (!packageJson.devDependencies[dep]) {
    console.log(`❌ Missing dev dependency: ${dep}`);
    packageJson.devDependencies[dep] = version;
    missingDeps.push(`${dep}@${version}`);
  } else if (packageJson.devDependencies[dep] !== version) {
    console.log(`⚠️ Outdated dev dependency: ${dep} (${packageJson.devDependencies[dep]} -> ${version})`);
    packageJson.devDependencies[dep] = version;
    outdatedDeps.push(`${dep}@${version}`);
  } else {
    console.log(`✅ Dev dependency correct: ${dep}@${version}`);
  }
}

// Save updated package.json
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('\n✅ Updated package.json saved');

// Install missing dependencies
if (missingDeps.length > 0 || outdatedDeps.length > 0) {
  console.log('\n📥 Installing missing/outdated dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    console.log('\nTry running manually:');
    console.log('npm install');
  }
} else {
  console.log('\n✅ All dependencies are correct');
}

// Final instructions
console.log('\n🚀 Next steps:');
console.log('1. Run npm run dev to start development server');
console.log('2. Check for any errors in the console');
console.log('3. Visit http://localhost:3000 in your browser');