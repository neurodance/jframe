/**
 * Browser Integration Tests using chrome-devtools-mcp
 */

import TestHelper, { testCards } from '../setup.js';

async function runBrowserTests() {
  const helper = new TestHelper();
  let testsPassed = 0;
  let testsFailed = 0;

  console.log('🧪 Starting Browser Integration Tests...\n');

  try {
    await helper.setup();

    // Test 1: Load the main page
    console.log('Test 1: Loading index.html...');
    await helper.loadLocalFile('index.html');
    const title = await helper.page.title();
    if (title.includes('JFrame')) {
      console.log('✅ Page loaded successfully');
      testsPassed++;
    } else {
      console.log('❌ Page title incorrect:', title);
      testsFailed++;
    }

    // Test 2: Render simple card
    console.log('\nTest 2: Rendering simple Adaptive Card...');
    const simpleResult = await helper.renderAdaptiveCard(testCards.simple);
    if (simpleResult.success) {
      console.log('✅ Simple card rendered');
      testsPassed++;
    } else {
      console.log('❌ Simple card failed:', simpleResult.error);
      testsFailed++;
    }

    // Test 3: Render weather card
    console.log('\nTest 3: Rendering weather card...');
    const weatherResult = await helper.renderAdaptiveCard(testCards.weather);
    if (weatherResult.success) {
      console.log('✅ Weather card rendered');
      testsPassed++;
    } else {
      console.log('❌ Weather card failed:', weatherResult.error);
      testsFailed++;
    }

    // Test 4: Performance metrics
    console.log('\nTest 4: Measuring performance...');
    const perf = await helper.measurePerformance();
    console.log(`  DOM Content Loaded: ${perf.domContentLoaded}ms`);
    console.log(`  Page Load Complete: ${perf.loadComplete}ms`);
    console.log(`  Total Render Time: ${perf.renderTime}ms`);

    if (perf.renderTime < 1000) {
      console.log('✅ Performance within target (<1000ms)');
      testsPassed++;
    } else {
      console.log('❌ Performance too slow (>1000ms)');
      testsFailed++;
    }

    // Test 5: Accessibility checks
    console.log('\nTest 5: Running accessibility checks...');
    const a11yIssues = await helper.checkAccessibility();
    if (a11yIssues.length === 0) {
      console.log('✅ No accessibility issues found');
      testsPassed++;
    } else {
      console.log(`⚠️ Found ${a11yIssues.length} accessibility issues:`);
      a11yIssues.forEach(issue => console.log(`  - ${issue}`));
      testsFailed++;
    }

    // Test 6: Mobile responsiveness
    console.log('\nTest 6: Testing mobile views...');
    const mobileResults = await helper.testMobileView();
    console.log(`✅ Tested ${mobileResults.length} mobile viewports:`);
    mobileResults.forEach(result => {
      console.log(`  - ${result.device}: ${result.viewport.width}x${result.viewport.height}`);
    });
    testsPassed++;

    // Test 7: Demo mode functionality
    console.log('\nTest 7: Testing demo mode...');
    await helper.page.evaluate(() => {
      // Clear API key to trigger demo mode
      document.getElementById('apiKeyInput').value = '';
      document.getElementById('promptInput').value = 'Show me weather';
      document.getElementById('generateBtn').click();
    });

    // Wait for card to render
    await helper.page.waitForTimeout(1000);

    const hasCard = await helper.page.evaluate(() => {
      const container = document.getElementById('cardContainer');
      return container && container.children.length > 0;
    });

    if (hasCard) {
      console.log('✅ Demo mode working');
      testsPassed++;
    } else {
      console.log('❌ Demo mode failed to generate card');
      testsFailed++;
    }

    // Test 8: Screenshot capture
    console.log('\nTest 8: Capturing screenshots...');
    const screenshotPath = await helper.captureScreenshot('integration-test');
    console.log(`✅ Screenshot saved to: ${screenshotPath}`);
    testsPassed++;

    // Test 9: Console errors check
    console.log('\nTest 9: Checking for console errors...');
    const errors = await helper.page.evaluate(() => {
      return window.__errors || [];
    });

    if (errors.length === 0) {
      console.log('✅ No console errors detected');
      testsPassed++;
    } else {
      console.log(`❌ Found ${errors.length} console errors`);
      errors.forEach(err => console.log(`  - ${err}`));
      testsFailed++;
    }

    // Test 10: Local storage functionality
    console.log('\nTest 10: Testing localStorage...');
    const storageTest = await helper.page.evaluate(() => {
      const testKey = 'test_key';
      const testValue = 'test_value';

      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      return retrieved === testValue;
    });

    if (storageTest) {
      console.log('✅ localStorage working correctly');
      testsPassed++;
    } else {
      console.log('❌ localStorage test failed');
      testsFailed++;
    }

  } catch (error) {
    console.error('❌ Test suite error:', error);
    testsFailed++;
  } finally {
    await helper.cleanup();
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));

  // Exit with appropriate code
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run the tests
runBrowserTests();