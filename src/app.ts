/**
 * JFrame Application - TypeScript version
 * Main application logic for Jott generation and rendering
 */

import type {
  JottCard,
  JottRequest,
  RenderConfig,
  ConcisenessConfig,
  ExtensibilityConfig,
  JottType,
  CardElement,
  TextBlock
} from './types/index';
import type { AIProvider, GenerateRequest, CardStyle } from './types/api';

class JFrameApp {
  private promptInput: HTMLInputElement;
  private generateBtn: HTMLButtonElement;
  private messagesArea: HTMLElement;
  private cardContainer: HTMLElement;
  private isLoading: boolean = false;

  constructor() {
    // Get DOM elements with type assertions
    this.promptInput = document.getElementById('promptInput') as HTMLInputElement;
    this.generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
    this.messagesArea = document.getElementById('messagesArea') as HTMLElement;
    this.cardContainer = document.getElementById('cardContainer') as HTMLElement;

    this.validateElements();
    this.init();
  }

  /**
   * Validate that all required DOM elements exist
   */
  private validateElements(): void {
    if (!this.promptInput) throw new Error('Element with id "promptInput" not found');
    if (!this.generateBtn) throw new Error('Element with id "generateBtn" not found');
    if (!this.messagesArea) throw new Error('Element with id "messagesArea" not found');
    if (!this.cardContainer) throw new Error('Element with id "cardContainer" not found');
  }

  /**
   * Initialize event listeners
   */
  private init(): void {
    // Generate button click
    this.generateBtn.addEventListener('click', () => this.generateCard());

    // Enter key in prompt input
    this.promptInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.generateCard();
      }
    });

    // Example prompt buttons
    document.querySelectorAll<HTMLButtonElement>('.example-btn').forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLButtonElement;
        const prompt = target.dataset.prompt;
        if (prompt) {
          this.promptInput.value = prompt;
          this.generateCard();
        }
      });
    });
  }

  /**
   * Generate a Jott card from user prompt
   */
  private async generateCard(): Promise<void> {
    const prompt = this.promptInput.value.trim();

    if (!prompt) {
      this.showError('Please enter a prompt');
      return;
    }

    // Show user message
    this.addUserMessage(prompt);

    // Clear input
    this.promptInput.value = '';

    // Show loading
    this.setLoading(true);

    try {
      const cardJson = await this.getDemoCard(prompt);
      await this.renderAdaptiveCard(cardJson);
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get demo card based on prompt keywords
   */
  private async getDemoCard(prompt: string): Promise<JottCard> {
    // Simulate API delay for better UX
    await this.delay(800);

    const lowerPrompt = prompt.toLowerCase();
    let baseCard: any;

    // Enhanced keyword matching with multiple categories
    if (lowerPrompt.match(/\b(eiffel|tower|paris|monument|landmark|tourism|tourist)\b/)) {
      baseCard = this.getEiffelTowerCard();
    } else if (lowerPrompt.match(/\b(weather|forecast|temperature|climate|sunny|rain|cloud|storm)\b/)) {
      baseCard = this.getWeatherCard();
    } else if (lowerPrompt.match(/\b(product|laptop|computer|device|gadget|shopping|buy|purchase)\b/)) {
      baseCard = this.getProductCard();
    } else if (lowerPrompt.match(/\b(profile|contact|person|user|employee|team|member|bio)\b/)) {
      baseCard = this.getProfileCard();
    } else if (lowerPrompt.match(/\b(task|todo|checklist|project|sprint|work|assignment)\b/)) {
      baseCard = this.getTaskCard();
    } else if (lowerPrompt.match(/\b(event|meeting|calendar|appointment|schedule|conference)\b/)) {
      baseCard = this.getEventCard();
    } else if (lowerPrompt.match(/\b(form|input|survey|feedback|register|signup|login|submit)\b/)) {
      baseCard = this.getFormCard();
    } else if (lowerPrompt.match(/\b(chart|graph|analytics|statistics|data|metrics|dashboard|report)\b/)) {
      baseCard = this.getChartCard();
    } else if (lowerPrompt.match(/\b(gallery|photos|images|media|album|pictures|portfolio)\b/)) {
      baseCard = this.getGalleryCard();
    } else if (lowerPrompt.match(/\b(news|article|blog|post|story|headline|press|announcement)\b/)) {
      baseCard = this.getNewsCard();
    } else if (lowerPrompt.match(/\b(video|media|watch|play|stream|movie|clip)\b/)) {
      baseCard = this.getVideoCard();
    } else {
      baseCard = this.getDefaultCard(prompt);
    }

    // Convert to JottCard with metadata
    return this.enhanceWithJottMetadata(baseCard, prompt);
  }

  /**
   * Enhance a basic card with Jott metadata
   */
  private enhanceWithJottMetadata(card: any, prompt: string): JottCard {
    const now = new Date();

    // Extract key points from card content
    const keyPoints = this.extractKeyPoints(card);

    return {
      ...card,
      version: '1.5',
      jottMetadata: {
        id: this.generateId(),
        created: now,
        modified: now,
        conciseness: {
          headline: this.extractHeadline(card),
          keyPoints: keyPoints.slice(0, 3), // Max 3 points
          expandable: true,
          readTime: this.calculateReadTime(card),
          priority: 'medium'
        } as ConcisenessConfig,
        extensibility: {
          canExpand: true,
          canContinue: true,
          hasMore: keyPoints.length > 3,
          expansionType: 'detail'
        } as ExtensibilityConfig
      }
    } as JottCard;
  }

  /**
   * Extract headline from card
   */
  private extractHeadline(card: any): string {
    if (card.body && card.body.length > 0) {
      const firstElement = card.body[0];
      if (firstElement.type === 'TextBlock' && firstElement.text) {
        return firstElement.text;
      }
    }
    return 'Jott Card';
  }

  /**
   * Extract key points from card content
   */
  private extractKeyPoints(card: any): string[] {
    const points: string[] = [];

    if (card.body) {
      card.body.forEach((element: any) => {
        if (element.type === 'TextBlock' && element.text && !element.isSubtle) {
          points.push(element.text.substring(0, 100));
        }
        if (element.type === 'FactSet' && element.facts) {
          element.facts.forEach((fact: any) => {
            points.push(`${fact.title}: ${fact.value}`);
          });
        }
      });
    }

    return points;
  }

  /**
   * Calculate estimated read time in seconds
   */
  private calculateReadTime(card: any): number {
    let wordCount = 0;

    if (card.body) {
      card.body.forEach((element: any) => {
        if (element.type === 'TextBlock' && element.text) {
          wordCount += element.text.split(' ').length;
        }
      });
    }

    // Average reading speed: 200 words per minute
    return Math.ceil((wordCount / 200) * 60);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `jott-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Render Adaptive Card
   */
  private async renderAdaptiveCard(cardJson: JottCard): Promise<void> {
    // Wait for AdaptiveCards library to be available
    await this.waitForAdaptiveCards();

    try {
      // @ts-ignore - AdaptiveCards is loaded from CDN
      const adaptiveCard = new AdaptiveCards.AdaptiveCard();
      adaptiveCard.parse(cardJson);
      const renderedCard = adaptiveCard.render();

      // Create assistant message with card
      this.addAssistantMessage(renderedCard);

      // Add to card container as well
      this.cardContainer.innerHTML = '';
      this.cardContainer.appendChild(renderedCard.cloneNode(true));

      // Track analytics
      this.trackCardRender(cardJson);
    } catch (error) {
      console.error('Error rendering card:', error);
      this.showError('Failed to render card');
    }
  }

  /**
   * Wait for AdaptiveCards library to load
   */
  private async waitForAdaptiveCards(maxAttempts: number = 50): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      // @ts-ignore - Checking for global AdaptiveCards
      if (typeof window.AdaptiveCards !== 'undefined') {
        return;
      }
      await this.delay(100);
    }
    throw new Error('AdaptiveCards library failed to load');
  }

  /**
   * Add user message to chat
   */
  private addUserMessage(text: string): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
      <div class="message-content">
        <div class="message-text">${this.escapeHtml(text)}</div>
      </div>
    `;
    this.messagesArea.appendChild(messageDiv);
    this.scrollToBottom();
  }

  /**
   * Add assistant message with card
   */
  private addAssistantMessage(cardElement: HTMLElement): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant-message';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.appendChild(cardElement);
    messageDiv.appendChild(contentDiv);
    this.messagesArea.appendChild(messageDiv);
    this.scrollToBottom();
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error-message';
    errorDiv.textContent = message;
    this.messagesArea.appendChild(errorDiv);
    this.scrollToBottom();
  }

  /**
   * Set loading state
   */
  private setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.generateBtn.disabled = loading;
    this.generateBtn.textContent = loading ? 'Generating...' : 'Jott It';

    if (loading) {
      this.generateBtn.classList.add('loading');
    } else {
      this.generateBtn.classList.remove('loading');
    }
  }

  /**
   * Scroll chat to bottom
   */
  private scrollToBottom(): void {
    this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
  }

  /**
   * Escape HTML for safe display
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Track card render analytics
   */
  private trackCardRender(card: JottCard): void {
    // Future: Send analytics to backend
    console.log('Card rendered:', {
      id: card.jottMetadata.id,
      type: this.detectCardType(card),
      readTime: card.jottMetadata.conciseness.readTime
    });
  }

  /**
   * Detect card type from content
   */
  private detectCardType(card: JottCard): JottType {
    // Check for media elements
    for (const element of card.body) {
      if ('type' in element && element.type === 'Media') {
        return 'video';
      }
    }
    return 'text';
  }

  // Demo card generators (keeping existing ones, just with better typing)
  private getEiffelTowerCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Eiffel Tower",
          size: "large",
          weight: "bolder"
        },
        {
          type: "Image",
          url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400",
          size: "stretch",
          altText: "Eiffel Tower at sunset"
        },
        {
          type: "FactSet",
          facts: [
            { title: "Height", value: "330 meters" },
            { title: "Built", value: "1887-1889" },
            { title: "Visitors/year", value: "7 million" },
            { title: "Weight", value: "10,100 tons" }
          ]
        }
      ]
    };
  }

  private getWeatherCard(): any {
    return {
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
              text: "Today, " + new Date().toLocaleDateString(),
              isSubtle: true
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "☀️",
                      size: "extraLarge"
                    }
                  ]
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: "72°F",
                      size: "extraLarge",
                      weight: "bolder"
                    },
                    {
                      type: "TextBlock",
                      text: "Partly Cloudy",
                      isSubtle: true
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // Additional card generators...
  private getProductCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Premium Laptop",
          size: "large",
          weight: "bolder"
        },
        {
          type: "TextBlock",
          text: "$1,299.99",
          size: "medium",
          color: "accent",
          weight: "bolder"
        },
        {
          type: "TextBlock",
          text: "High-performance laptop with latest specs",
          wrap: true
        }
      ]
    };
  }

  private getProfileCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "John Doe",
          size: "large",
          weight: "bolder"
        },
        {
          type: "TextBlock",
          text: "Senior Developer",
          isSubtle: true
        }
      ]
    };
  }

  private getTaskCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Sprint Tasks",
          size: "large",
          weight: "bolder"
        },
        {
          type: "TextBlock",
          text: "✅ Complete API integration\n⏳ Review pull requests\n📋 Update documentation",
          wrap: true
        }
      ]
    };
  }

  private getEventCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Team Meeting",
          size: "large",
          weight: "bolder"
        },
        {
          type: "TextBlock",
          text: "Tomorrow at 2:00 PM",
          color: "accent"
        }
      ]
    };
  }

  private getFormCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Feedback Form",
          size: "large",
          weight: "bolder"
        },
        {
          type: "Input.Text",
          id: "feedback",
          placeholder: "Enter your feedback",
          isMultiline: true
        }
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Submit"
        }
      ]
    };
  }

  private getChartCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Q4 Performance",
          size: "large",
          weight: "bolder"
        },
        {
          type: "TextBlock",
          text: "📊 Revenue: ↑ 47%\n📈 Users: ↑ 23%\n💰 Profit: ↑ 31%",
          wrap: true
        }
      ]
    };
  }

  private getGalleryCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Photo Gallery",
          size: "large",
          weight: "bolder"
        },
        {
          type: "ImageSet",
          images: [
            { type: "Image", url: "https://via.placeholder.com/150" },
            { type: "Image", url: "https://via.placeholder.com/150" }
          ]
        }
      ]
    };
  }

  private getNewsCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Breaking News",
          size: "large",
          weight: "bolder",
          color: "accent"
        },
        {
          type: "TextBlock",
          text: "Major announcement coming soon...",
          wrap: true
        }
      ]
    };
  }

  private getVideoCard(): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Video Jott",
          size: "large",
          weight: "bolder"
        },
        {
          type: "Media",
          sources: [
            {
              mimeType: "video/mp4",
              url: "https://example.com/sample.mp4"
            }
          ]
        }
      ]
    };
  }

  private getDefaultCard(prompt: string): any {
    return {
      type: "AdaptiveCard",
      version: "1.5",
      body: [
        {
          type: "TextBlock",
          text: "Your Jott",
          size: "large",
          weight: "bolder"
        },
        {
          type: "TextBlock",
          text: prompt,
          wrap: true
        }
      ]
    };
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new JFrameApp();
  });
} else {
  new JFrameApp();
}

// Export for module usage
export default JFrameApp;