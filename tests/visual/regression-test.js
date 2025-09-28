/**
 * Visual Regression Tests
 * Compares screenshots against baseline images
 */

import TestHelper from '../setup.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASELINE_DIR = join(__dirname, '../snapshots/baseline');
const CURRENT_DIR = join(__dirname, '../snapshots/current');
const DIFF_DIR = join(__dirname, '../snapshots/diff');

// Ensure directories exist
[BASELINE_DIR, CURRENT_DIR, DIFF_DIR].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

/**
 * Visual test scenarios
 */
const scenarios = [
  {
    name: 'homepage',
    url: 'index.html',
    viewport: { width: 1280, height: 720 }
  },
  {
    name: 'weather-card',
    url: 'index.html',
    viewport: { width: 1280, height: 720 },
    actions: async (page) => {
      await page.evaluate(() => {
        document.getElementById('promptInput').value = 'Show weather in Seattle';
        document.getElementById('generateBtn').click();
      });
      await page.waitForTimeout(1000);
    }
  },
  {
    name: 'product-card',
    url: 'index.html',
    viewport: { width: 1280, height: 720 },
    actions: async (page) => {
      await page.evaluate(() => {
        document.getElementById('promptInput').value = 'Show product listing';
        document.getElementById('generateBtn').click();
      });
      await page.waitForTimeout(1000);
    }
  },
  {
    name: 'mobile-homepage',
    url: 'index.html',
    viewport: { width: 390, height: 844 } // iPhone 12
  },
  {
    name: 'tablet-homepage',
    url: 'index.html',
    viewport: { width: 768, height: 1024 } // iPad
  },
  {
    name: 'dark-theme',
    url: 'index.html',
    viewport: { width: 1280, height: 720 },
    actions: async (page) => {
      await page.evaluate(() => {
        // Apply dark theme if available
        document.documentElement.classList.add('dark');
      });
    }
  }
];

/**
 * Simple image comparison
 * In production, you'd use a library like pixelmatch or resemble.js
 */
async function compareImages(baseline, current) {
  if (!existsSync(baseline)) {
    console.log('  ⚠️ No baseline image, creating new baseline');
    const currentData = readFileSync(current);
    writeFileSync(baseline, currentData);
    return { match: true, firstRun: true };
  }

  // For now, just check file sizes as a simple comparison
  // In production, use proper image diff library
  const baselineStats = readFileSync(baseline);
  const currentStats = readFileSync(current);

  const sizeDiff = Math.abs(baselineStats.length - currentStats.length);
  const threshold = baselineStats.length * 0.01; // 1% threshold

  return {
    match: sizeDiff < threshold,
    sizeDiff,
    message: sizeDiff < threshold
      ? 'Images appear similar (size check)'
      : `Images differ by ${sizeDiff} bytes`
  };
}

/**
 * Run visual regression tests
 */
async function runVisualTests() {
  const helper = new TestHelper();
  const results = [];

  console.log('📸 Starting Visual Regression Tests...\n');

  try {
    await helper.setup();

    for (const scenario of scenarios) {
      console.log(`Testing: ${scenario.name}`);

      // Set viewport
      await helper.page.setViewport(scenario.viewport);

      // Load page
      await helper.loadLocalFile(scenario.url);

      // Perform any scenario-specific actions
      if (scenario.actions) {
        await scenario.actions(helper.page);
      }

      // Capture screenshot
      const currentPath = join(CURRENT_DIR, `${scenario.name}.png`);
      await helper.page.screenshot({
        path: currentPath,
        fullPage: false
      });

      // Compare with baseline
      const baselinePath = join(BASELINE_DIR, `${scenario.name}.png`);
      const comparison = await compareImages(baselinePath, currentPath);

      results.push({
        scenario: scenario.name,
        viewport: scenario.viewport,
        ...comparison
      });

      if (comparison.firstRun) {
        console.log(`  ✅ Baseline created`);
      } else if (comparison.match) {
        console.log(`  ✅ Visual match (${comparison.message})`);
      } else {
        console.log(`  ❌ Visual difference detected: ${comparison.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Visual test error:', error);
    process.exit(1);
  } finally {
    await helper.cleanup();
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Visual Test Summary:');

  const passed = results.filter(r => r.match).length;
  const failed = results.filter(r => !r.match).length;
  const newBaselines = results.filter(r => r.firstRun).length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🆕 New baselines: ${newBaselines}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    const icon = result.match ? '✅' : '❌';
    const status = result.firstRun ? 'NEW' : (result.match ? 'PASS' : 'FAIL');
    console.log(`  ${icon} ${result.scenario} (${result.viewport.width}x${result.viewport.height}): ${status}`);
  });

  console.log('='.repeat(50));

  // Update baselines command
  if (failed > 0) {
    console.log('\n💡 To update baselines, run:');
    console.log('   npm run test:visual -- --update-baselines');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Check for update baselines flag
const updateBaselines = process.argv.includes('--update-baselines');

if (updateBaselines) {
  console.log('🔄 Updating baseline images...');
  // Copy current to baseline
  const files = require('fs').readdirSync(CURRENT_DIR);
  files.forEach(file => {
    const currentPath = join(CURRENT_DIR, file);
    const baselinePath = join(BASELINE_DIR, file);
    require('fs').copyFileSync(currentPath, baselinePath);
    console.log(`  Updated: ${file}`);
  });
  console.log('✅ Baselines updated');
  process.exit(0);
}

// Run the tests
runVisualTests();