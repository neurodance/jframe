/**
 * Unit tests for location detection
 * Tests IP-based and browser-based geolocation
 */

import assert from 'assert';
import { describe, it, beforeEach } from 'node:test';
import ColdStartContext from '../../src/context/cold-start-context.js';

describe('Location Context Detection', () => {
  let context;
  let mockEnvironment;

  beforeEach(() => {
    // Create mock environment with fetch support
    mockEnvironment = {
      navigator: {
        language: 'en-US',
        languages: ['en-US'],
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
        matchMedia: () => ({ matches: false }),
        innerWidth: 1920,
        // Mock geolocation API
        navigator: {
          geolocation: {
            getCurrentPosition: (success, error, options) => {
              // Simulate successful GPS location
              success({
                coords: {
                  latitude: 40.7128,
                  longitude: -74.0060,
                  accuracy: 50,
                  altitude: null,
                  altitudeAccuracy: null,
                  heading: null,
                  speed: null
                },
                timestamp: Date.now()
              });
            }
          }
        }
      }
    };

    context = new ColdStartContext(mockEnvironment);
  });

  describe('Async Location Detection', () => {
    it('should return location context structure', async () => {
      const result = await context.detect();
      assert(result.location);
      assert(typeof result.location.timezone === 'string');
      assert(typeof result.location.locale === 'string');
      assert('source' in result.location);
    });

    it('should detect timezone from Intl', async () => {
      const result = await context.detect();
      assert.strictEqual(result.location.timezone, 'America/New_York');
    });

    it('should detect locale', async () => {
      const result = await context.detect();
      assert.strictEqual(result.location.locale, 'en-US');
    });

    it('should have location confidence score', async () => {
      const result = await context.detect();
      assert(typeof result.confidence.location === 'number');
      assert(result.confidence.location >= 0);
      assert(result.confidence.location <= 1);
    });
  });

  describe('Location Methods', () => {
    it('should detect locale from Intl', () => {
      const locale = context.detectLocale();
      assert.strictEqual(locale, 'en-US');
    });

    it('should fallback to navigator language if Intl fails', () => {
      const contextNoIntl = new ColdStartContext({
        ...mockEnvironment,
        Intl: null
      });
      const locale = contextNoIntl.detectLocale();
      assert.strictEqual(locale, 'en-US');
    });

    it('should handle missing browser geolocation gracefully', async () => {
      const contextNoGeo = new ColdStartContext({
        ...mockEnvironment,
        window: { ...mockEnvironment.window, navigator: {} }
      });

      // Enable precise location request to test the error path
      contextNoGeo.requestPreciseLocation = true;
      const location = await contextNoGeo.detectLocationContext();

      // Should still have basic location info from timezone
      assert(location);
      assert(location.timezone);
      // In real environment, IP detection will work, so source will be 'ip' or 'none'
      assert(['none', 'ip'].includes(location.source), `Expected source to be 'none' or 'ip', got '${location.source}'`);
    });
  });

  describe('Contextual Suggestions with Location', () => {
    it('should generate location-aware suggestions', async () => {
      const suggestions = await context.getContextualSuggestions();
      assert(Array.isArray(suggestions));
      assert(suggestions.length > 0);

      // Check suggestion structure
      const firstSuggestion = suggestions[0];
      assert(firstSuggestion.type);
      assert(firstSuggestion.text);
      assert(typeof firstSuggestion.confidence === 'number');
    });

    it('should include icons in suggestions', async () => {
      const suggestions = await context.getContextualSuggestions();
      const hasIcons = suggestions.some(s => s.icon);
      assert(hasIcons, 'At least some suggestions should have icons');
    });

    it('should sort suggestions by confidence', async () => {
      const suggestions = await context.getContextualSuggestions();
      if (suggestions.length > 1) {
        for (let i = 1; i < suggestions.length; i++) {
          assert(
            suggestions[i - 1].confidence >= suggestions[i].confidence,
            'Suggestions should be sorted by confidence descending'
          );
        }
      }
    });

    it('should limit suggestions to maximum of 5', async () => {
      const suggestions = await context.getContextualSuggestions();
      assert(suggestions.length <= 5, 'Should return at most 5 suggestions');
    });
  });
});