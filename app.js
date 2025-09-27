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

        // Enhanced keyword matching with multiple categories
        const lowerPrompt = prompt.toLowerCase();

        // Tourism & Landmarks
        if (lowerPrompt.match(/\b(eiffel|tower|paris|monument|landmark|tourism|tourist)\b/)) {
            return this.getEiffelTowerCard();
        }
        // Weather & Climate
        else if (lowerPrompt.match(/\b(weather|forecast|temperature|climate|sunny|rain|cloud|storm)\b/)) {
            return this.getWeatherCard();
        }
        // Products & Shopping
        else if (lowerPrompt.match(/\b(product|laptop|computer|device|gadget|shopping|buy|purchase)\b/)) {
            return this.getProductCard();
        }
        // People & Contacts
        else if (lowerPrompt.match(/\b(profile|contact|person|user|employee|team|member|bio)\b/)) {
            return this.getProfileCard();
        }
        // Tasks & Projects
        else if (lowerPrompt.match(/\b(task|todo|checklist|project|sprint|work|assignment)\b/)) {
            return this.getTaskCard();
        }
        // Events & Calendar
        else if (lowerPrompt.match(/\b(event|meeting|calendar|appointment|schedule|conference)\b/)) {
            return this.getEventCard();
        }
        // Forms & Input
        else if (lowerPrompt.match(/\b(form|input|survey|feedback|register|signup|login|submit)\b/)) {
            return this.getFormCard();
        }
        // Charts & Analytics
        else if (lowerPrompt.match(/\b(chart|graph|analytics|statistics|data|metrics|dashboard|report)\b/)) {
            return this.getChartCard();
        }
        // Media & Gallery
        else if (lowerPrompt.match(/\b(gallery|photos|images|media|album|pictures|portfolio)\b/)) {
            return this.getGalleryCard();
        }
        // News & Articles
        else if (lowerPrompt.match(/\b(news|article|blog|post|story|headline|press|announcement)\b/)) {
            return this.getNewsCard();
        }
        // Restaurant & Food
        else if (lowerPrompt.match(/\b(restaurant|food|menu|dining|cuisine|meal|recipe|dish)\b/)) {
            return this.getRestaurantCard();
        }
        // Invoice & Billing
        else if (lowerPrompt.match(/\b(invoice|bill|payment|receipt|order|transaction|purchase)\b/)) {
            return this.getInvoiceCard();
        }
        else {
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

    getFormCard() {
        return {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "User Registration",
                    "size": "large",
                    "weight": "bolder"
                },
                {
                    "type": "TextBlock",
                    "text": "Please fill out the form below to create your account",
                    "wrap": true,
                    "isSubtle": true
                },
                {
                    "type": "Input.Text",
                    "id": "firstName",
                    "label": "First Name",
                    "placeholder": "Enter your first name",
                    "isRequired": true,
                    "errorMessage": "First name is required"
                },
                {
                    "type": "Input.Text",
                    "id": "lastName",
                    "label": "Last Name",
                    "placeholder": "Enter your last name",
                    "isRequired": true,
                    "errorMessage": "Last name is required"
                },
                {
                    "type": "Input.Text",
                    "id": "email",
                    "label": "Email Address",
                    "placeholder": "name@example.com",
                    "style": "email",
                    "isRequired": true,
                    "errorMessage": "Valid email is required"
                },
                {
                    "type": "Input.Text",
                    "id": "password",
                    "label": "Password",
                    "placeholder": "Create a strong password",
                    "style": "password",
                    "isRequired": true,
                    "errorMessage": "Password is required"
                },
                {
                    "type": "Input.Date",
                    "id": "birthDate",
                    "label": "Date of Birth",
                    "isRequired": false
                },
                {
                    "type": "Input.ChoiceSet",
                    "id": "country",
                    "label": "Country",
                    "style": "compact",
                    "isMultiSelect": false,
                    "value": "usa",
                    "choices": [
                        { "title": "United States", "value": "usa" },
                        { "title": "Canada", "value": "ca" },
                        { "title": "United Kingdom", "value": "uk" },
                        { "title": "Australia", "value": "au" },
                        { "title": "Other", "value": "other" }
                    ]
                },
                {
                    "type": "Input.Toggle",
                    "id": "acceptTerms",
                    "title": "I accept the terms and conditions",
                    "value": "false",
                    "valueOn": "true",
                    "valueOff": "false"
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Create Account",
                    "style": "positive"
                },
                {
                    "type": "Action.Submit",
                    "title": "Cancel"
                }
            ]
        };
    }

    getChartCard() {
        return {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Sales Dashboard Q1 2024",
                    "size": "large",
                    "weight": "bolder"
                },
                {
                    "type": "TextBlock",
                    "text": "Performance Metrics",
                    "weight": "bolder",
                    "spacing": "medium"
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Total Revenue",
                                    "isSubtle": true,
                                    "spacing": "none"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "$2.4M",
                                    "size": "extraLarge",
                                    "weight": "bolder",
                                    "color": "good"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "↑ 12% from last quarter",
                                    "size": "small",
                                    "color": "good"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "New Customers",
                                    "isSubtle": true,
                                    "spacing": "none"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "847",
                                    "size": "extraLarge",
                                    "weight": "bolder",
                                    "color": "accent"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "↑ 23% from last quarter",
                                    "size": "small",
                                    "color": "good"
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
                            "text": "Monthly Breakdown",
                            "weight": "bolder"
                        },
                        {
                            "type": "FactSet",
                            "facts": [
                                { "title": "January", "value": "████████░░ $750K" },
                                { "title": "February", "value": "██████████ $850K" },
                                { "title": "March", "value": "████████░░ $800K" }
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
                            "text": "Top Products",
                            "weight": "bolder"
                        },
                        {
                            "type": "FactSet",
                            "facts": [
                                { "title": "1. Premium Plan", "value": "$980K (41%)" },
                                { "title": "2. Standard Plan", "value": "$720K (30%)" },
                                { "title": "3. Basic Plan", "value": "$480K (20%)" },
                                { "title": "4. Add-ons", "value": "$220K (9%)" }
                            ]
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.OpenUrl",
                    "title": "View Full Report",
                    "url": "https://example.com/reports"
                },
                {
                    "type": "Action.OpenUrl",
                    "title": "Export Data",
                    "url": "https://example.com/export"
                }
            ]
        };
    }

    getGalleryCard() {
        return {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Photo Gallery",
                    "size": "large",
                    "weight": "bolder"
                },
                {
                    "type": "TextBlock",
                    "text": "Latest uploads from our community",
                    "isSubtle": true
                },
                {
                    "type": "ImageSet",
                    "imageSize": "medium",
                    "images": [
                        {
                            "type": "Image",
                            "url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
                            "altText": "Mountain landscape"
                        },
                        {
                            "type": "Image",
                            "url": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&h=200&fit=crop",
                            "altText": "Ocean sunset"
                        },
                        {
                            "type": "Image",
                            "url": "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=200&h=200&fit=crop",
                            "altText": "Forest path"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "separator": true,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Featured Photo",
                            "weight": "bolder",
                            "size": "medium"
                        },
                        {
                            "type": "Image",
                            "url": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=300&fit=crop",
                            "altText": "Featured landscape",
                            "size": "stretch"
                        },
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Sunset Valley",
                                            "weight": "bolder"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "by Sarah Johnson",
                                            "size": "small",
                                            "isSubtle": true
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "❤️ 1.2K",
                                            "horizontalAlignment": "right"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "💬 48",
                                            "size": "small",
                                            "horizontalAlignment": "right"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.OpenUrl",
                    "title": "View All Photos",
                    "url": "https://example.com/gallery"
                },
                {
                    "type": "Action.OpenUrl",
                    "title": "Upload Photo",
                    "url": "https://example.com/upload"
                }
            ]
        };
    }

    getNewsCard() {
        const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        return {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Breaking News",
                    "size": "large",
                    "weight": "bolder"
                },
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=TECH",
                                            "size": "small"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Major Tech Company Announces Revolutionary AI Breakthrough",
                                            "weight": "bolder",
                                            "wrap": true
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": today + " • Technology",
                                            "size": "small",
                                            "isSubtle": true,
                                            "spacing": "none"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "Scientists have developed a new artificial intelligence system that can understand and respond to complex human emotions...",
                                            "wrap": true,
                                            "maxLines": 2,
                                            "size": "small"
                                        }
                                    ]
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
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=ENV",
                                            "size": "small"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Global Climate Summit Reaches Historic Agreement",
                                            "weight": "bolder",
                                            "wrap": true
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": today + " • Environment",
                                            "size": "small",
                                            "isSubtle": true,
                                            "spacing": "none"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "World leaders commit to ambitious new targets for reducing carbon emissions by 2030...",
                                            "wrap": true,
                                            "maxLines": 2,
                                            "size": "small"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.OpenUrl",
                    "title": "Read More",
                    "url": "https://example.com/news"
                }
            ]
        };
    }

    getRestaurantCard() {
        return {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "Image",
                    "url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=200&fit=crop",
                    "size": "stretch",
                    "altText": "Restaurant interior"
                },
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "The Garden Bistro",
                            "size": "large",
                            "weight": "bolder"
                        },
                        {
                            "type": "TextBlock",
                            "text": "⭐⭐⭐⭐⭐ (4.7) • Italian Cuisine • $$$",
                            "spacing": "none"
                        },
                        {
                            "type": "TextBlock",
                            "text": "📍 123 Main Street, Downtown • Open until 10 PM",
                            "size": "small",
                            "isSubtle": true
                        }
                    ]
                },
                {
                    "type": "Container",
                    "separator": true,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Today's Specials",
                            "weight": "bolder"
                        },
                        {
                            "type": "FactSet",
                            "facts": [
                                { "title": "🍝 Truffle Pasta", "value": "$28" },
                                { "title": "🥩 Ribeye Steak", "value": "$45" },
                                { "title": "🐟 Grilled Salmon", "value": "$32" },
                                { "title": "🥗 Caesar Salad", "value": "$12" }
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
                            "text": "Make a Reservation",
                            "weight": "bolder"
                        },
                        {
                            "type": "Input.Date",
                            "id": "reservationDate",
                            "label": "Date"
                        },
                        {
                            "type": "Input.Time",
                            "id": "reservationTime",
                            "label": "Time"
                        },
                        {
                            "type": "Input.Number",
                            "id": "partySize",
                            "label": "Party Size",
                            "min": 1,
                            "max": 10,
                            "value": 2
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Reserve Table",
                    "style": "positive"
                },
                {
                    "type": "Action.OpenUrl",
                    "title": "View Menu",
                    "url": "https://example.com/menu"
                }
            ]
        };
    }

    getInvoiceCard() {
        const invoiceNumber = Math.floor(Math.random() * 9000) + 1000;
        const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

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
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "INVOICE",
                                    "size": "extraLarge",
                                    "weight": "bolder"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": `#INV-${invoiceNumber}`,
                                    "isSubtle": true
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Status",
                                    "isSubtle": true,
                                    "horizontalAlignment": "right"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": "PENDING",
                                    "color": "attention",
                                    "weight": "bolder",
                                    "horizontalAlignment": "right"
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
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Bill To:",
                                            "weight": "bolder",
                                            "size": "small"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "Acme Corporation",
                                            "spacing": "none"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "123 Business Ave\nNew York, NY 10001",
                                            "size": "small",
                                            "isSubtle": true,
                                            "wrap": true,
                                            "spacing": "none"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Invoice Date:",
                                            "weight": "bolder",
                                            "size": "small"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": today,
                                            "spacing": "none"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "Due Date:",
                                            "weight": "bolder",
                                            "size": "small"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "April 15, 2024",
                                            "spacing": "none"
                                        }
                                    ]
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
                            "text": "Items",
                            "weight": "bolder"
                        },
                        {
                            "type": "FactSet",
                            "facts": [
                                { "title": "Consulting Services (40 hrs)", "value": "$4,000.00" },
                                { "title": "Software License (Annual)", "value": "$1,200.00" },
                                { "title": "Support Package", "value": "$800.00" }
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
                                { "title": "Subtotal:", "value": "$6,000.00" },
                                { "title": "Tax (10%):", "value": "$600.00" },
                                { "title": "**Total Due:**", "value": "**$6,600.00**" }
                            ]
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "type": "Action.OpenUrl",
                    "title": "Pay Invoice",
                    "url": "https://example.com/pay",
                    "style": "positive"
                },
                {
                    "type": "Action.OpenUrl",
                    "title": "Download PDF",
                    "url": "https://example.com/download"
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
                                    "text": "• Eiffel Tower - Tourist attraction\n• Weather forecast - 5-day display\n• Product laptop - Product showcase\n• Profile contact - Business card\n• Task list - Project tracking\n• Event meeting - Calendar event\n• Form registration - Input forms\n• Chart dashboard - Analytics\n• Gallery photos - Media display\n• News article - Breaking stories\n• Restaurant menu - Dining info\n• Invoice billing - Payment details",
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