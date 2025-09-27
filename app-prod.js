class JFrameApp {
    constructor() {
        this.promptInput = document.getElementById('promptInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.messagesArea = document.getElementById('messagesArea');

        this.init();
    }

    init() {
        // Event listeners
        this.generateBtn.addEventListener('click', () => this.generateCard());
        this.promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.generateCard();
            }
        });

        // Example prompt buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.promptInput.value = e.target.dataset.prompt;
                this.generateCard();
            });
        });
    }

    async generateCard() {
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
            this.renderAdaptiveCard(cardJson);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    async getDemoCard(prompt) {
        // Simulate API delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        // Return demo cards based on prompt keywords
        const lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.includes('eiffel') || lowerPrompt.includes('tower') || lowerPrompt.includes('paris')) {
            return this.getEiffelTowerCard();
        } else if (lowerPrompt.includes('weather') || lowerPrompt.includes('forecast') || lowerPrompt.includes('temperature')) {
            return this.getWeatherCard();
        } else if (lowerPrompt.includes('product') || lowerPrompt.includes('laptop') || lowerPrompt.includes('computer')) {
            return this.getProductCard();
        } else if (lowerPrompt.includes('profile') || lowerPrompt.includes('contact') || lowerPrompt.includes('person')) {
            return this.getProfileCard();
        } else if (lowerPrompt.includes('task') || lowerPrompt.includes('todo') || lowerPrompt.includes('checklist')) {
            return this.getTaskCard();
        } else if (lowerPrompt.includes('event') || lowerPrompt.includes('meeting') || lowerPrompt.includes('calendar')) {
            return this.getEventCard();
        } else {
            return this.getGenericDemoCard(prompt);
        }
    }

    getEiffelTowerCard() {
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
                            "altText": "Eiffel Tower in Paris",
                            "size": "stretch"
                        },
                        {
                            "type": "TextBlock",
                            "text": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. Standing at 330 meters tall, it was the world's tallest structure from 1889 to 1930.",
                            "wrap": true
                        },
                        {
                            "type": "FactSet",
                            "facts": [
                                { "title": "Height:", "value": "330 meters (1,083 ft)" },
                                { "title": "Built:", "value": "1887-1889" },
                                { "title": "Designer:", "value": "Gustave Eiffel" },
                                { "title": "Visitors:", "value": "~7 million/year" }
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
    }

    getWeatherCard() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const conditions = ['☀️ Sunny', '⛅ Partly Cloudy', '☁️ Cloudy', '🌤️ Mostly Sunny'];
        const temps = [72, 75, 68, 70, 73];

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
                            "text": "Weather Forecast",
                            "size": "large",
                            "weight": "bolder"
                        },
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "☀️",
                                            "size": "extraLarge"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Today",
                                            "weight": "bolder"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "75°F - Sunny",
                                            "size": "medium"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "Container",
                            "separator": true,
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "5-Day Forecast",
                                    "weight": "bolder",
                                    "size": "medium"
                                }
                            ]
                        },
                        ...days.map((day, i) => ({
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": day,
                                            "weight": "bolder"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": conditions[i % conditions.length]
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": `${temps[i]}°F`
                                        }
                                    ]
                                }
                            ]
                        }))
                    ]
                }
            ]
        };
    }

    getProductCard() {
        return {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Premium Laptop",
                    "size": "large",
                    "weight": "bolder"
                },
                {
                    "type": "Image",
                    "url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=250&fit=crop",
                    "size": "stretch",
                    "altText": "Laptop computer"
                },
                {
                    "type": "TextBlock",
                    "text": "⭐⭐⭐⭐⭐ (4.8/5)",
                    "spacing": "none"
                },
                {
                    "type": "TextBlock",
                    "text": "High-performance laptop with cutting-edge specifications for professionals and creators.",
                    "wrap": true,
                    "spacing": "small"
                },
                {
                    "type": "FactSet",
                    "facts": [
                        { "title": "Processor:", "value": "Intel Core i9 13th Gen" },
                        { "title": "Memory:", "value": "32GB DDR5 RAM" },
                        { "title": "Storage:", "value": "1TB NVMe SSD" },
                        { "title": "Display:", "value": "15.6\" 4K OLED" },
                        { "title": "Graphics:", "value": "NVIDIA RTX 4070" },
                        { "title": "Battery:", "value": "Up to 12 hours" }
                    ]
                },
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "$2,499",
                            "size": "extraLarge",
                            "weight": "bolder",
                            "color": "accent"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Free shipping • 2-year warranty",
                            "size": "small",
                            "isSubtle": true
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.OpenUrl",
                    "title": "Buy Now",
                    "url": "https://example.com",
                    "style": "positive"
                }
            ]
        };
    }

    getProfileCard() {
        return {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": [
                                {
                                    "type": "Image",
                                    "url": "https://ui-avatars.com/api/?name=Alex+Johnson&size=100&background=667eea&color=fff",
                                    "size": "medium",
                                    "style": "person"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Alex Johnson",
                                    "size": "large",
                                    "weight": "bolder"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "Senior Software Engineer",
                                    "spacing": "none"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "Tech Innovations Inc.",
                                    "isSubtle": true,
                                    "spacing": "none"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "Container",
                    "separator": true,
                    "items": [
                        {
                            "type": "FactSet",
                            "facts": [
                                { "title": "📧 Email:", "value": "alex.johnson@techinnovations.com" },
                                { "title": "📱 Mobile:", "value": "+1 (555) 123-4567" },
                                { "title": "🏢 Office:", "value": "+1 (555) 987-6543" },
                                { "title": "📍 Location:", "value": "San Francisco, CA" },
                                { "title": "🔗 LinkedIn:", "value": "linkedin.com/in/alexjohnson" }
                            ]
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.OpenUrl",
                    "title": "Send Email",
                    "url": "mailto:alex.johnson@techinnovations.com"
                },
                {
                    "type": "Action.OpenUrl",
                    "title": "Connect on LinkedIn",
                    "url": "https://linkedin.com"
                }
            ]
        };
    }

    getTaskCard() {
        return {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Project Tasks",
                    "size": "large",
                    "weight": "bolder"
                },
                {
                    "type": "TextBlock",
                    "text": "Sprint 2024-Q1",
                    "isSubtle": true
                },
                {
                    "type": "Container",
                    "separator": true,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "✅ Complete UI mockups",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "✅ Set up development environment",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "⏳ Implement authentication",
                            "wrap": true,
                            "weight": "bolder",
                            "color": "attention"
                        },
                        {
                            "type": "TextBlock",
                            "text": "⏳ Create API endpoints",
                            "wrap": true,
                            "weight": "bolder",
                            "color": "attention"
                        },
                        {
                            "type": "TextBlock",
                            "text": "📋 Write unit tests",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "📋 Deploy to staging",
                            "wrap": true
                        }
                    ]
                },
                {
                    "type": "Container",
                    "separator": true,
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Progress",
                                            "weight": "bolder"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "33% Complete",
                                            "color": "accent"
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

    getEventCard() {
        return {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Team Meeting",
                    "size": "large",
                    "weight": "bolder"
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "📅",
                                    "size": "large"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Thursday, March 14, 2024",
                                    "weight": "bolder"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "2:00 PM - 3:00 PM EST",
                                    "spacing": "none"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "Container",
                    "separator": true,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "📍 Conference Room A / Virtual",
                            "spacing": "small"
                        },
                        {
                            "type": "TextBlock",
                            "text": "👥 12 attendees",
                            "spacing": "small"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "separator": true,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Agenda",
                            "weight": "bolder"
                        },
                        {
                            "type": "TextBlock",
                            "text": "• Q1 Progress Review\n• Product Roadmap Updates\n• Resource Allocation\n• Open Discussion",
                            "wrap": true
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.OpenUrl",
                    "title": "Join Meeting",
                    "url": "https://example.com/meeting",
                    "style": "positive"
                },
                {
                    "type": "Action.OpenUrl",
                    "title": "View Calendar",
                    "url": "https://example.com/calendar"
                }
            ]
        };
    }

    getGenericDemoCard(prompt) {
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
                            "text": "AI Generation Coming Soon!",
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
                            "text": "We're working on bringing you full AI-powered card generation. In the meantime, enjoy our curated demo cards!",
                            "wrap": true
                        },
                        {
                            "type": "Container",
                            "separator": true,
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Try these examples:",
                                    "weight": "bolder"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "• Eiffel Tower - Tourist attraction card\n• Weather forecast - 5-day weather display\n• Product laptop - Product showcase\n• Profile contact - Business card\n• Task list - Project tasks\n• Event meeting - Calendar event",
                                    "wrap": true,
                                    "size": "small"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
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