/**
 * Unit tests for cold-start context detection
 * User Story 1: Detect time/timezone/language without user history
 */

import assert from 'assert';
import { describe, it, beforeEach } from 'node:test';

// Import the module we're testing
import ColdStartContext from '../../src/context/cold-start-context.js';

describe('ColdStartContext', () => {
  let context;
  let mockEnvironment;

  beforeEach(() => {
    // Create mock environment for testing
    mockEnvironment = {
      navigator: {
        language: 'en-US',
        languages: ['en-US', 'en'],
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        platform: 'Win32',
        onLine: true
      },
      Intl: {
        DateTimeFormat: function() {
          return {
            resolvedOptions: () => ({
              timeZone: 'America/New_York',
              locale: 'en-US'
            })
          };
        }
      },
      window: {
        matchMedia: (query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query
        }),
        innerWidth: 1920
      }
    };

    // Create context with mocked environment
    context = new ColdStartContext(mockEnvironment);
  });

  describe('Basic Context Detection', () => {
    it('should detect current time', () => {
      const result = context.detect();
      assert(result.temporal.currentTime instanceof Date);
      assert(result.temporal.currentTime.getTime() <= Date.now());
    });

    it('should detect timezone', () => {
      const result = context.detect();
      assert.strictEqual(result.temporal.timezone, 'America/New_York');
    });

    it('should detect language', () => {
      const result = context.detect();
      assert.strictEqual(result.environmental.language, 'en-US');
      assert.deepStrictEqual(result.environmental.languages, ['en-US', 'en']);
    });

    it('should detect platform', () => {
      const result = context.detect();
      assert.strictEqual(result.environmental.platform, 'Win32');
    });
  });

  describe('Temporal Context', () => {
    it('should determine time of day', () => {
      const result = context.detect();
      const hour = result.temporal.currentTime.getHours();
      const timeOfDay = result.temporal.timeOfDay;

      if (hour >= 5 && hour < 12) {
        assert.strictEqual(timeOfDay, 'morning');
      } else if (hour >= 12 && hour < 17) {
        assert.strictEqual(timeOfDay, 'afternoon');
      } else if (hour >= 17 && hour < 21) {
        assert.strictEqual(timeOfDay, 'evening');
      } else {
        assert.strictEqual(timeOfDay, 'night');
      }
    });

    it('should detect day of week', () => {
      const result = context.detect();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      assert(days.includes(result.temporal.dayOfWeek));
    });

    it('should detect if weekend', () => {
      const result = context.detect();
      const dayOfWeek = result.temporal.dayOfWeek;
      const isWeekend = result.temporal.isWeekend;

      if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
        assert.strictEqual(isWeekend, true);
      } else {
        assert.strictEqual(isWeekend, false);
      }
    });
  });

  describe('Environmental Context', () => {
    it('should detect device type from user agent', () => {
      const result = context.detect();
      assert.strictEqual(result.environmental.deviceType, 'desktop');
    });

    it('should detect dark mode preference if available', () => {
      const result = context.detect();
      assert.strictEqual(result.environmental.prefersDarkMode, true);
    });
  });

  describe('Context Confidence', () => {
    it('should include confidence scores', () => {
      const result = context.detect();
      assert(result.confidence);
      assert(result.confidence.temporal >= 0 && result.confidence.temporal <= 1);
      assert(result.confidence.environmental >= 0 && result.confidence.environmental <= 1);
    });
  });
});