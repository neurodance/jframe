class JFrameApp {
    constructor() {
        this.promptInput = document.getElementById('promptInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.messagesArea = document.getElementById('messagesArea');
        
        this.init();
    }
    
    init() {
        // Load API key from localStorage
        const savedApiKey = localStorage.getItem('openai_api_key');
        if (savedApiKey) {
            this.apiKeyInput.value = savedApiKey;
        }
        
        // Event listeners
        this.generateBtn.addEventListener('click', () => this.generateCard());
        this.promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.generateCard();
            }
        });
        
        this.apiKeyInput.addEventListener('change', () => {
            localStorage.setItem('openai_api_key', this.apiKeyInput.value);
        });
    }
    
    async generateCard() {
        const prompt = this.promptInput.value.trim();
        const apiKey = this.apiKeyInput.value.trim();
        
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
            let cardJson;
            
            // Demo mode if no API key provided
            if (!apiKey) {
                cardJson = await this.getDemoCard(prompt);
            } else {
                cardJson = await this.callGPT(prompt, apiKey);
            }
            
            this.renderAdaptiveCard(cardJson);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }
    
    async getDemoCard(prompt) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Return a demo card based on common prompt patterns
        if (prompt.toLowerCase().includes('eiffel tower') || prompt.toLowerCase().includes('paris')) {
            return {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.5",
                "body": [
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Eiffel Tower",
                                "size": "large",
                                "weight": "bolder"
                            },
                            {
                                "type": "Image",
                                "url": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop",
                                "altText": "Eiffel Tower in Paris"
                            },
                            {
                                "type": "TextBlock",
                                "text": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. Standing at 330 meters tall, it was the world's tallest man-made structure from 1889 to 1930.",
                                "wrap": true
                            },
                            {
                                "type": "FactSet",
                                "facts": [
                                    {
                                        "title": "Height:",
                                        "value": "330 meters (1,083 ft)"
                                    },
                                    {
                                        "title": "Built:",
                                        "value": "1887-1889"
                                    },
                                    {
                                        "title": "Location:",
                                        "value": "Paris, France"
                                    },
                                    {
                                        "title": "Visitors:",
                                        "value": "~7 million annually"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.OpenUrl",
                        "title": "Learn More",
                        "url": "https://www.toureiffel.paris/en"
                    }
                ]
            };
        } else {
            // Generic demo card
            return {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.5",
                "body": [
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Demo Mode",
                                "size": "large",
                                "weight": "bolder",
                                "color": "accent"
                            },
                            {
                                "type": "TextBlock",
                                "text": `You asked: "${prompt}"`,
                                "wrap": true,
                                "isSubtle": true
                            },
                            {
                                "type": "TextBlock",
                                "text": "This is a demo card generated without using the OpenAI API. To get AI-generated cards tailored to your specific prompts, please enter your OpenAI API key above.",
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": "💡 Try asking about the Eiffel Tower to see a more detailed demo!",
                                "wrap": true,
                                "size": "small"
                            }
                        ]
                    }
                ]
            };
        }
    }
    
    async callGPT(prompt, apiKey) {
        const systemPrompt = `You are a helpful assistant that creates Adaptive Card JSON based on user prompts. 

Adaptive Cards are a platform-agnostic UI framework. They are defined using JSON and can contain various elements like TextBlock, Image, ColumnSet, FactSet, Container, and more.

Here are the key rules:
1. Always return valid Adaptive Card JSON
2. Include the required "$schema", "type": "AdaptiveCard", and "version" fields
3. Use "body" array for the main content elements
4. For images, use placeholder URLs like "https://via.placeholder.com/300x200" or real URLs when appropriate
5. Make the cards visually appealing with good use of TextBlocks, Images, and layout elements
6. Include relevant actions when appropriate (Action.OpenUrl, Action.Submit, etc.)

Common elements:
- TextBlock: For text content with properties like size, weight, color, wrap
- Image: For images with url, altText, size properties  
- Container: Groups elements together
- ColumnSet/Column: Creates columns for layout
- FactSet: For key-value pairs
- Input elements: For forms (Input.Text, Input.Date, etc.)

Example structure:
{
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard", 
    "version": "1.5",
    "body": [
        // elements here
    ],
    "actions": [
        // optional actions
    ]
}

Respond ONLY with the JSON, no explanations or markdown formatting.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o', // Using GPT-4o as GPT-5 might not be available yet
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // Try to parse JSON from the response
        try {
            return JSON.parse(content);
        } catch (parseError) {
            // If direct parsing fails, try to extract JSON from markdown code blocks
            const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
            }
            throw new Error('Could not parse valid JSON from GPT response');
        }
    }
    
    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.escapeHtml(message)}
            </div>
        `;
        
        // Remove welcome message if it exists
        const welcomeMessage = this.messagesArea.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        this.messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    renderAdaptiveCard(cardJson) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const cardContainer = document.createElement('div');
        cardContainer.className = 'adaptive-card-container';
        
        try {
            // Create adaptive card
            const adaptiveCard = new AdaptiveCards.AdaptiveCard();
            adaptiveCard.parse(cardJson);
            
            // Render the card
            const renderedCard = adaptiveCard.render();
            cardContainer.appendChild(renderedCard);
            
            contentDiv.appendChild(cardContainer);
            
            // Also show the JSON for reference (collapsible)
            const jsonToggle = document.createElement('details');
            jsonToggle.className = 'json-details';
            jsonToggle.innerHTML = `
                <summary>View JSON</summary>
                <pre><code>${JSON.stringify(cardJson, null, 2)}</code></pre>
            `;
            contentDiv.appendChild(jsonToggle);
            
        } catch (error) {
            contentDiv.innerHTML = `
                <div class="error-message">
                    <strong>Error rendering card:</strong> ${error.message}
                    <details style="margin-top: 10px;">
                        <summary>View JSON</summary>
                        <pre><code>${JSON.stringify(cardJson, null, 2)}</code></pre>
                    </details>
                </div>
            `;
        }
        
        messageDiv.appendChild(contentDiv);
        this.messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showError(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="error-message">
                    ${this.escapeHtml(message)}
                </div>
            </div>
        `;
        this.messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    setLoading(loading) {
        if (loading) {
            this.generateBtn.disabled = true;
            this.generateBtn.innerHTML = '<span class="loading"></span> Generating...';
        } else {
            this.generateBtn.disabled = false;
            this.generateBtn.innerHTML = 'Generate';
        }
    }
    
    scrollToBottom() {
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JFrameApp();
});