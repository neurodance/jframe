/**
 * Test Setup and Configuration
 * Provides utilities for testing JFrame with chrome-devtools-mcp
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

export class TestHelper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async setup() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();

    // Set viewport for consistent testing
    await this.page.setViewport({ width: 1280, height: 720 });

    // Enable console logging for debugging
    this.page.on('console', msg => {
      if (process.env.DEBUG) {
        console.log('Browser console:', msg.text());
      }
    });

    // Catch errors
    this.page.on('error', err => {
      console.error('Browser error:', err);
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async loadLocalFile(filepath) {
    const fullPath = join(ROOT_DIR, filepath);
    await this.page.goto(`file://${fullPath}`, {
      waitUntil: 'networkidle2'
    });
  }

  async renderAdaptiveCard(cardJson) {
    // Wait for AdaptiveCards library to load
    await this.page.waitForFunction(() => {
      return typeof window.AdaptiveCards !== 'undefined';
    }, { timeout: 5000 });

    // Render the card
    return await this.page.evaluate((json) => {
      try {
        const adaptiveCard = new window.AdaptiveCards.AdaptiveCard();
        adaptiveCard.parse(json);
        const renderedCard = adaptiveCard.render();

        // Add to page for testing
        document.getElementById('cardContainer').innerHTML = '';
        document.getElementById('cardContainer').appendChild(renderedCard);

        return { success: true, html: renderedCard.outerHTML };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }, cardJson);
  }

  async captureScreenshot(name) {
    const screenshotPath = join(__dirname, 'snapshots', `${name}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  async measurePerformance() {
    return await this.page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        renderTime: perfData.loadEventEnd - perfData.fetchStart
      };
    });
  }

  async checkAccessibility() {
    // Basic accessibility checks
    return await this.page.evaluate(() => {
      const issues = [];

      // Check for alt text on images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.alt) {
          issues.push(`Image missing alt text: ${img.src}`);
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach(h => {
        const level = parseInt(h.tagName[1]);
        if (level - lastLevel > 1) {
          issues.push(`Heading hierarchy skip: ${h.tagName} after H${lastLevel}`);
        }
        lastLevel = level;
      });

      // Check for form labels
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        if (!input.labels || input.labels.length === 0) {
          issues.push(`Input missing label: ${input.name || input.id}`);
        }
      });

      return issues;
    });
  }

  async testMobileView() {
    const devices = [
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'Galaxy S21', width: 384, height: 854 }
    ];

    const results = [];
    for (const device of devices) {
      await this.page.setViewport({
        width: device.width,
        height: device.height
      });

      const screenshot = await this.captureScreenshot(`mobile-${device.name}`);
      results.push({
        device: device.name,
        screenshot,
        viewport: { width: device.width, height: device.height }
      });
    }

    return results;
  }
}

// Sample card fixtures for testing
export const testCards = {
  simple: {
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "TextBlock",
        text: "Test Card",
        size: "large",
        weight: "bolder"
      }
    ]
  },

  weather: {
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "Seattle Weather",
            size: "large",
            weight: "bolder"
          },
          {
            type: "TextBlock",
            text: "72°F Partly Cloudy",
            size: "medium"
          }
        ]
      }
    ]
  },

  videoJott: {
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "Media",
        sources: [
          {
            mimeType: "video/mp4",
            url: "https://example.com/video.mp4"
          }
        ]
      },
      {
        type: "TextBlock",
        text: "10-second Jott",
        wrap: true
      }
    ]
  }
};

export default TestHelper;