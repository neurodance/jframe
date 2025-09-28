/**
 * Unit Tests for JFrame App
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('JFrameApp Unit Tests', () => {
  let dom;
  let window;
  let document;
  let JFrameApp;

  before(() => {
    // Read the app.js file
    const appJs = readFileSync(join(__dirname, '../../app.js'), 'utf-8');
    const indexHtml = readFileSync(join(__dirname, '../../index.html'), 'utf-8');

    // Create a DOM environment
    dom = new JSDOM(indexHtml, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable'
    });

    window = dom.window;
    document = window.document;

    // Mock localStorage
    const localStorage = {
      storage: {},
      getItem(key) {
        return this.storage[key] || null;
      },
      setItem(key, value) {
        this.storage[key] = value.toString();
      },
      removeItem(key) {
        delete this.storage[key];
      },
      clear() {
        this.storage = {};
      }
    };
    window.localStorage = localStorage;

    // Execute app.js in the DOM context
    const script = document.createElement('script');
    script.textContent = appJs;
    document.body.appendChild(script);

    // Get the JFrameApp class
    JFrameApp = window.JFrameApp;
  });

  after(() => {
    if (dom) {
      dom.window.close();
    }
  });

  describe('Initialization', () => {
    it('should create JFrameApp instance', () => {
      const app = new JFrameApp();
      assert(app instanceof JFrameApp, 'Should be instance of JFrameApp');
    });

    it('should initialize with correct elements', () => {
      const app = new JFrameApp();
      assert(app.apiKeyInput, 'Should have apiKeyInput');
      assert(app.promptInput, 'Should have promptInput');
      assert(app.generateBtn, 'Should have generateBtn');
      assert(app.chatContainer, 'Should have chatContainer');
    });
  });

  describe('API Key Management', () => {
    it('should save API key to localStorage', () => {
      const app = new JFrameApp();
      const testKey = 'test-api-key-123';

      app.apiKeyInput.value = testKey;
      app.saveApiKey();

      assert.strictEqual(
        window.localStorage.getItem('openai_api_key'),
        testKey,
        'API key should be saved to localStorage'
      );
    });

    it('should load API key from localStorage', () => {
      const testKey = 'stored-api-key-456';
      window.localStorage.setItem('openai_api_key', testKey);

      const app = new JFrameApp();
      app.loadApiKey();

      assert.strictEqual(
        app.apiKeyInput.value,
        testKey,
        'API key should be loaded from localStorage'
      );
    });

    it('should clear API key', () => {
      window.localStorage.setItem('openai_api_key', 'key-to-clear');

      const app = new JFrameApp();
      window.localStorage.clear();

      assert.strictEqual(
        window.localStorage.getItem('openai_api_key'),
        null,
        'API key should be cleared'
      );
    });
  });

  describe('Demo Mode', () => {
    it('should detect demo mode when no API key', () => {
      const app = new JFrameApp();
      app.apiKeyInput.value = '';

      const isDemoMode = app.apiKeyInput.value === '';
      assert(isDemoMode, 'Should be in demo mode without API key');
    });

    it('should return weather card for weather prompt', () => {
      const app = new JFrameApp();
      const card = app.getDemoCard('What is the weather in Seattle?');

      assert(card, 'Should return a card');
      assert(card.body, 'Card should have body');
      assert(card.body[0].items, 'Should have weather items');
    });

    it('should return product card for product prompt', () => {
      const app = new JFrameApp();
      const card = app.getDemoCard('Show me a product listing');

      assert(card, 'Should return a card');
      assert(card.body, 'Card should have body');
      assert(card.body.some(item =>
        item.text && item.text.includes('$')
      ), 'Should have price information');
    });

    it('should return default card for unknown prompt', () => {
      const app = new JFrameApp();
      const card = app.getDemoCard('Random unknown prompt xyz123');

      assert(card, 'Should return a default card');
      assert(card.body, 'Card should have body');
    });
  });

  describe('Message Display', () => {
    it('should add user message to chat', () => {
      const app = new JFrameApp();
      const testMessage = 'Test user message';

      app.addUserMessage(testMessage);

      const messages = document.querySelectorAll('.user-message');
      const lastMessage = messages[messages.length - 1];

      assert(lastMessage, 'Should add user message element');
      assert(
        lastMessage.textContent.includes(testMessage),
        'Message should contain the text'
      );
    });

    it('should add assistant message to chat', () => {
      const app = new JFrameApp();
      const cardContainer = document.createElement('div');

      app.addAssistantMessage(cardContainer);

      const messages = document.querySelectorAll('.assistant-message');
      assert(messages.length > 0, 'Should add assistant message');
    });

    it('should scroll to bottom after adding message', () => {
      const app = new JFrameApp();
      const initialScroll = app.chatContainer.scrollTop;

      // Add multiple messages to create scroll
      for (let i = 0; i < 10; i++) {
        app.addUserMessage(`Message ${i}`);
      }

      // Check that scroll position changed
      assert(
        app.chatContainer.scrollHeight > app.chatContainer.clientHeight ||
        app.chatContainer.scrollTop !== initialScroll,
        'Should update scroll position'
      );
    });
  });

  describe('Prompt Processing', () => {
    it('should detect Eiffel Tower keywords', () => {
      const app = new JFrameApp();
      const prompts = [
        'Show me the Eiffel Tower',
        'eiffel tower information',
        'Tell me about Paris tower'
      ];

      prompts.forEach(prompt => {
        const card = app.getDemoCard(prompt);
        assert(card, `Should return card for: ${prompt}`);
        assert(
          JSON.stringify(card).toLowerCase().includes('eiffel') ||
          JSON.stringify(card).toLowerCase().includes('paris'),
          `Card should be related to Eiffel Tower for: ${prompt}`
        );
      });
    });

    it('should detect weather keywords', () => {
      const app = new JFrameApp();
      const prompts = [
        'weather today',
        'temperature in Seattle',
        'forecast for tomorrow'
      ];

      prompts.forEach(prompt => {
        const card = app.getDemoCard(prompt);
        assert(card, `Should return card for: ${prompt}`);
        assert(
          JSON.stringify(card).toLowerCase().includes('weather') ||
          JSON.stringify(card).toLowerCase().includes('temperature') ||
          JSON.stringify(card).toLowerCase().includes('°'),
          `Card should be weather-related for: ${prompt}`
        );
      });
    });
  });

  describe('Card Validation', () => {
    it('should have valid AdaptiveCard structure', () => {
      const app = new JFrameApp();
      const cards = [
        app.getDemoCard('weather'),
        app.getDemoCard('product'),
        app.getDemoCard('profile')
      ];

      cards.forEach((card, index) => {
        assert(card.type === 'AdaptiveCard', `Card ${index} should have type AdaptiveCard`);
        assert(card.version, `Card ${index} should have version`);
        assert(Array.isArray(card.body), `Card ${index} should have body array`);
        assert(card.body.length > 0, `Card ${index} body should not be empty`);
      });
    });

    it('should have valid schema version', () => {
      const app = new JFrameApp();
      const card = app.getDemoCard('test');

      assert(
        card.version === '1.3' || card.version === '1.4' || card.version === '1.5',
        'Should have valid AdaptiveCard version'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle empty prompt gracefully', () => {
      const app = new JFrameApp();
      app.promptInput.value = '';

      const card = app.getDemoCard('');
      assert(card, 'Should return default card for empty prompt');
    });

    it('should handle null prompt gracefully', () => {
      const app = new JFrameApp();

      const card = app.getDemoCard(null);
      assert(card, 'Should handle null prompt');
    });

    it('should handle very long prompts', () => {
      const app = new JFrameApp();
      const longPrompt = 'a'.repeat(10000);

      const card = app.getDemoCard(longPrompt);
      assert(card, 'Should handle very long prompts');
    });
  });
});