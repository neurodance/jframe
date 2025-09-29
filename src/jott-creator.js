/**
 * JottCreator - AI-Assisted Jott Creation Workflow
 * Transforms user intent into optimized, multi-layered Jotts
 */

class JottCreator {
    constructor(options = {}) {
        this.options = {
            apiKey: options.apiKey || localStorage.getItem('openai_api_key'),
            model: options.model || 'gpt-4',
            temperature: options.temperature || 0.7,
            maxTokens: options.maxTokens || 2000,
            ...options
        };

        this.templates = this.loadTemplates();
        this.patterns = this.loadCognitivePatterns();
    }

    /**
     * Main creation method - transforms intent into Jott
     */
    async createJott(userInput) {
        try {
            // Step 1: Parse user intent
            const intent = await this.parseIntent(userInput);

            // Step 2: Generate layer structure
            const layers = await this.generateLayers(intent);

            // Step 3: Optimize for cognition
            const optimized = this.optimizeForCognition(layers, intent);

            // Step 4: Add intelligence metadata
            const intelligent = this.addIntelligence(optimized, intent);

            // Step 5: Validate and refine
            const validated = this.validateJott(intelligent);

            return {
                success: true,
                jott: validated,
                metadata: {
                    intent: intent,
                    timestamp: new Date().toISOString(),
                    version: '1.0'
                }
            };
        } catch (error) {
            console.error('Jott creation error:', error);
            return {
                success: false,
                error: error.message,
                fallback: this.createFallbackJott(userInput)
            };
        }
    }

    /**
     * Parse user intent using AI or pattern matching
     */
    async parseIntent(userInput) {
        // For demo mode (no API key), use pattern matching
        if (!this.options.apiKey || this.options.apiKey === 'demo') {
            return this.parseIntentLocal(userInput);
        }

        // Use AI for intent parsing
        const prompt = `Analyze this communication request and extract the intent:

Input: "${userInput}"

Respond with a JSON object containing:
{
    "type": "product|article|profile|announcement|data|form|media",
    "purpose": "inform|persuade|engage|collect|analyze",
    "audience": "general|professional|technical|casual",
    "urgency": "low|medium|high",
    "complexity": "simple|moderate|complex",
    "tone": "formal|casual|enthusiastic|serious",
    "key_points": ["point1", "point2", ...],
    "desired_outcome": "what the user wants to achieve"
}`;

        try {
            const response = await this.callAI(prompt);
            return JSON.parse(response);
        } catch (error) {
            // Fallback to local parsing
            return this.parseIntentLocal(userInput);
        }
    }

    /**
     * Local intent parsing without AI
     */
    parseIntentLocal(userInput) {
        const lower = userInput.toLowerCase();

        // Detect type
        let type = 'general';
        if (lower.includes('product') || lower.includes('sell') || lower.includes('buy')) {
            type = 'product';
        } else if (lower.includes('article') || lower.includes('news') || lower.includes('blog')) {
            type = 'article';
        } else if (lower.includes('profile') || lower.includes('person') || lower.includes('about')) {
            type = 'profile';
        } else if (lower.includes('announce') || lower.includes('update') || lower.includes('release')) {
            type = 'announcement';
        } else if (lower.includes('data') || lower.includes('chart') || lower.includes('metrics')) {
            type = 'data';
        } else if (lower.includes('form') || lower.includes('input') || lower.includes('collect')) {
            type = 'form';
        }

        // Detect purpose
        let purpose = 'inform';
        if (lower.includes('buy') || lower.includes('convince') || lower.includes('sell')) {
            purpose = 'persuade';
        } else if (lower.includes('interact') || lower.includes('engage') || lower.includes('play')) {
            purpose = 'engage';
        } else if (lower.includes('collect') || lower.includes('gather') || lower.includes('survey')) {
            purpose = 'collect';
        }

        // Extract key points (simple word extraction)
        const words = userInput.split(' ');
        const keyWords = words.filter(w => w.length > 4 && !this.isCommonWord(w));

        return {
            type: type,
            purpose: purpose,
            audience: 'general',
            urgency: lower.includes('urgent') || lower.includes('asap') ? 'high' : 'medium',
            complexity: keyWords.length > 10 ? 'complex' : keyWords.length > 5 ? 'moderate' : 'simple',
            tone: lower.includes('fun') || lower.includes('excited') ? 'enthusiastic' : 'casual',
            key_points: keyWords.slice(0, 5),
            desired_outcome: `Communicate about ${keyWords.join(', ')}`,
            original_input: userInput
        };
    }

    /**
     * Generate layer structure based on intent
     */
    async generateLayers(intent) {
        const template = this.selectTemplate(intent);

        // For demo mode, use template-based generation
        if (!this.options.apiKey || this.options.apiKey === 'demo') {
            return this.generateLayersFromTemplate(intent, template);
        }

        // Use AI for layer generation
        const prompt = `Create a 4-layer progressive disclosure structure for this Jott:

Intent: ${JSON.stringify(intent, null, 2)}

Create content for each layer:
1. Glance (3 seconds): Hook and core value
2. Scan (10 seconds): Key benefits/points
3. Read (30 seconds): Full details
4. Interact: Actions and engagement

Return as JSON with Adaptive Cards structure for each layer.`;

        try {
            const response = await this.callAI(prompt);
            return JSON.parse(response);
        } catch (error) {
            return this.generateLayersFromTemplate(intent, template);
        }
    }

    /**
     * Generate layers from template
     */
    generateLayersFromTemplate(intent, template) {
        const layers = {
            glance: this.createGlanceLayer(intent, template),
            scan: this.createScanLayer(intent, template),
            read: this.createReadLayer(intent, template),
            interact: this.createInteractLayer(intent, template)
        };

        return layers;
    }

    /**
     * Create glance layer - 3 second hook
     */
    createGlanceLayer(intent, template) {
        const emoji = this.selectEmoji(intent.type);
        const headline = this.generateHeadline(intent);

        return {
            body: [
                {
                    type: "ColumnSet",
                    columns: [
                        {
                            type: "Column",
                            width: "auto",
                            items: [{
                                type: "TextBlock",
                                text: emoji,
                                size: "ExtraLarge"
                            }]
                        },
                        {
                            type: "Column",
                            width: "stretch",
                            items: [
                                {
                                    type: "TextBlock",
                                    text: headline,
                                    size: "Large",
                                    weight: "Bolder",
                                    wrap: true
                                },
                                {
                                    type: "TextBlock",
                                    text: intent.desired_outcome,
                                    size: "Small",
                                    isSubtle: true,
                                    wrap: true
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Create scan layer - 10 second overview
     */
    createScanLayer(intent, template) {
        const bullets = intent.key_points.map(point => ({
            type: "TextBlock",
            text: `• ${this.capitalizeFirst(point)}`,
            wrap: true
        }));

        return {
            body: [
                {
                    type: "TextBlock",
                    text: this.generateHeadline(intent),
                    size: "Large",
                    weight: "Bolder",
                    wrap: true
                },
                {
                    type: "Container",
                    separator: true,
                    spacing: "Medium",
                    items: bullets.length > 0 ? bullets : [
                        { type: "TextBlock", text: "• Key information", wrap: true },
                        { type: "TextBlock", text: "• Important details", wrap: true },
                        { type: "TextBlock", text: "• Main benefits", wrap: true }
                    ]
                }
            ],
            actions: this.generateQuickActions(intent)
        };
    }

    /**
     * Create read layer - 30 second detail
     */
    createReadLayer(intent, template) {
        return {
            body: [
                {
                    type: "TextBlock",
                    text: this.generateHeadline(intent),
                    size: "ExtraLarge",
                    weight: "Bolder",
                    wrap: true
                },
                {
                    type: "TextBlock",
                    text: this.generateDetailedDescription(intent),
                    wrap: true,
                    spacing: "Medium"
                },
                {
                    type: "FactSet",
                    separator: true,
                    spacing: "Large",
                    facts: this.generateFacts(intent)
                }
            ],
            actions: this.generateDetailedActions(intent)
        };
    }

    /**
     * Create interact layer - Deep engagement
     */
    createInteractLayer(intent, template) {
        const inputs = this.generateInputs(intent);

        return {
            body: [
                {
                    type: "TextBlock",
                    text: "Customize Your Experience",
                    size: "Large",
                    weight: "Bolder"
                },
                ...inputs
            ],
            actions: [
                {
                    type: "Action.Submit",
                    title: "Submit",
                    style: "positive",
                    data: { action: "submit" }
                }
            ]
        };
    }

    /**
     * Optimize layers for cognitive processing
     */
    optimizeForCognition(layers, intent) {
        const pattern = this.selectCognitivePattern(intent);

        // Apply cognitive optimizations
        Object.keys(layers).forEach(layerName => {
            const layer = layers[layerName];

            // Apply chunking (7±2 rule)
            if (layer.body && layer.body.length > 9) {
                layer.body = this.chunkContent(layer.body);
            }

            // Apply visual hierarchy
            layer.body = this.applyVisualHierarchy(layer.body, pattern);

            // Optimize for scan patterns
            if (pattern === 'f-pattern' || pattern === 'z-pattern') {
                layer.body = this.optimizeForScanPattern(layer.body, pattern);
            }
        });

        return layers;
    }

    /**
     * Add intelligence metadata
     */
    addIntelligence(layers, intent) {
        return {
            jott: {
                version: "1.0",
                showLayerIndicator: true,
                agent: {
                    model: "context-aware",
                    intent: intent.desired_outcome,
                    personality: this.selectPersonality(intent.tone),
                    adaptations: ["time-aware", "device-aware", "progressive"]
                },
                layers: layers,
                cognition: {
                    attentionPattern: this.selectCognitivePattern(intent),
                    semanticDensity: this.calculateSemanticDensity(layers),
                    cognitiveLoad: intent.complexity
                }
            }
        };
    }

    /**
     * Validate and refine the Jott
     */
    validateJott(jott) {
        // Ensure all required fields exist
        if (!jott.jott.layers.glance) {
            jott.jott.layers.glance = this.createMinimalGlance();
        }

        // Ensure body arrays exist
        Object.keys(jott.jott.layers).forEach(layerName => {
            const layer = jott.jott.layers[layerName];
            if (!layer.body) {
                layer.body = [];
            }
        });

        // Add fallback content if empty
        if (jott.jott.layers.glance.body.length === 0) {
            jott.jott.layers.glance.body.push({
                type: "TextBlock",
                text: "Jott Content",
                size: "Large",
                weight: "Bolder"
            });
        }

        return jott;
    }

    /**
     * Create fallback Jott if creation fails
     */
    createFallbackJott(userInput) {
        return {
            jott: {
                version: "1.0",
                showLayerIndicator: true,
                layers: {
                    glance: {
                        body: [
                            {
                                type: "TextBlock",
                                text: "📄 " + (userInput.substring(0, 50) || "Jott"),
                                size: "Large",
                                weight: "Bolder",
                                wrap: true
                            }
                        ]
                    },
                    scan: {
                        body: [
                            {
                                type: "TextBlock",
                                text: userInput || "Your content here",
                                wrap: true
                            }
                        ]
                    }
                }
            }
        };
    }

    /**
     * AI API call (when API key is available)
     */
    async callAI(prompt) {
        if (!this.options.apiKey || this.options.apiKey === 'demo') {
            throw new Error('AI not available in demo mode');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.options.apiKey}`
            },
            body: JSON.stringify({
                model: this.options.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a Jott creation assistant. Create structured, cognitive-optimized content.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: this.options.temperature,
                max_tokens: this.options.maxTokens
            })
        });

        if (!response.ok) {
            throw new Error('AI API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Helper methods

    loadTemplates() {
        return {
            product: { emoji: '🛍️', pattern: 'z-pattern', personality: 'sales' },
            article: { emoji: '📰', pattern: 'f-pattern', personality: 'informative' },
            profile: { emoji: '👤', pattern: 'center-out', personality: 'friendly' },
            announcement: { emoji: '📢', pattern: 'top-down', personality: 'authoritative' },
            data: { emoji: '📊', pattern: 'grid', personality: 'analytical' },
            form: { emoji: '📝', pattern: 'linear', personality: 'helpful' },
            media: { emoji: '🎬', pattern: 'visual-first', personality: 'engaging' }
        };
    }

    loadCognitivePatterns() {
        return {
            'z-pattern': { priority: ['top-left', 'top-right', 'bottom-left', 'bottom-right'] },
            'f-pattern': { priority: ['top', 'left-scan', 'left-scan', 'left-scan'] },
            'center-out': { priority: ['center', 'surrounding'] },
            'top-down': { priority: ['header', 'body', 'footer'] },
            'grid': { priority: ['equal-weight'] },
            'linear': { priority: ['sequential'] },
            'visual-first': { priority: ['image', 'caption', 'details'] }
        };
    }

    selectTemplate(intent) {
        return this.templates[intent.type] || this.templates.product;
    }

    selectEmoji(type) {
        const template = this.templates[type];
        return template ? template.emoji : '📄';
    }

    selectPersonality(tone) {
        const personalities = {
            formal: 'professional',
            casual: 'friendly',
            enthusiastic: 'energetic',
            serious: 'authoritative'
        };
        return personalities[tone] || 'balanced';
    }

    selectCognitivePattern(intent) {
        const template = this.templates[intent.type];
        return template ? template.pattern : 'z-pattern';
    }

    generateHeadline(intent) {
        const words = intent.key_points.filter(p => p && p.length > 0);
        if (words.length > 0) {
            return words.map(w => this.capitalizeFirst(w)).join(' ');
        }
        return "Your " + this.capitalizeFirst(intent.type);
    }

    generateDetailedDescription(intent) {
        return `This ${intent.type} is designed to ${intent.purpose} your ${intent.audience} audience. ` +
               `${intent.desired_outcome}. ` +
               `Key focus areas include: ${intent.key_points.join(', ')}.`;
    }

    generateFacts(intent) {
        const facts = [];
        if (intent.type) facts.push({ title: "Type:", value: this.capitalizeFirst(intent.type) });
        if (intent.purpose) facts.push({ title: "Purpose:", value: this.capitalizeFirst(intent.purpose) });
        if (intent.audience) facts.push({ title: "Audience:", value: this.capitalizeFirst(intent.audience) });
        if (intent.urgency) facts.push({ title: "Priority:", value: this.capitalizeFirst(intent.urgency) });
        return facts;
    }

    generateQuickActions(intent) {
        const actions = [];

        if (intent.purpose === 'persuade' || intent.type === 'product') {
            actions.push({
                type: "Action.Submit",
                title: "Learn More",
                data: { jottAction: "progressLayer" }
            });
        }

        if (intent.purpose === 'engage') {
            actions.push({
                type: "Action.Submit",
                title: "Get Started",
                data: { action: "start" }
            });
        }

        if (actions.length === 0) {
            actions.push({
                type: "Action.Submit",
                title: "View Details",
                data: { jottAction: "progressLayer" }
            });
        }

        return actions;
    }

    generateDetailedActions(intent) {
        const actions = [];

        actions.push({
            type: "Action.Submit",
            title: "Primary Action",
            style: "positive",
            data: { action: "primary" }
        });

        if (intent.complexity !== 'simple') {
            actions.push({
                type: "Action.Submit",
                title: "Secondary Option",
                data: { action: "secondary" }
            });
        }

        return actions;
    }

    generateInputs(intent) {
        const inputs = [];

        if (intent.purpose === 'collect' || intent.type === 'form') {
            inputs.push({
                type: "Input.Text",
                id: "input1",
                label: "Your Input",
                placeholder: "Enter information..."
            });
        }

        inputs.push({
            type: "Input.ChoiceSet",
            id: "choice1",
            label: "Select Option",
            choices: [
                { title: "Option A", value: "a" },
                { title: "Option B", value: "b" },
                { title: "Option C", value: "c" }
            ],
            value: "a"
        });

        return inputs;
    }

    chunkContent(content) {
        // Implement 7±2 rule
        const chunks = [];
        const chunkSize = 7;

        for (let i = 0; i < content.length; i += chunkSize) {
            if (i === 0 || content[i].separator) {
                chunks.push(...content.slice(i, Math.min(i + chunkSize, content.length)));
            } else {
                // Add separator between chunks
                chunks.push({ type: "Container", separator: true, spacing: "Medium", items: [] });
                chunks.push(...content.slice(i, Math.min(i + chunkSize, content.length)));
            }
        }

        return chunks;
    }

    applyVisualHierarchy(content, pattern) {
        // Apply size and weight based on position
        content.forEach((element, index) => {
            if (element.type === "TextBlock") {
                if (index === 0) {
                    element.size = element.size || "Large";
                    element.weight = element.weight || "Bolder";
                } else if (index < 3) {
                    element.size = element.size || "Medium";
                }
            }
        });

        return content;
    }

    optimizeForScanPattern(content, pattern) {
        // Rearrange content based on scan pattern
        if (pattern === 'z-pattern' && content.length >= 4) {
            // Ensure important content is at Z-pattern points
            const optimized = [];
            optimized.push(content[0]); // Top-left
            optimized.push(content[1]); // Top-right
            optimized.push(...content.slice(2, -1)); // Middle
            optimized.push(content[content.length - 1]); // Bottom-right
            return optimized;
        }

        return content;
    }

    calculateSemanticDensity(layers) {
        let totalElements = 0;
        let totalContent = 0;

        Object.values(layers).forEach(layer => {
            if (layer.body) {
                totalElements += layer.body.length;
                layer.body.forEach(element => {
                    if (element.type === "TextBlock" && element.text) {
                        totalContent += element.text.length;
                    }
                });
            }
        });

        // Simple density calculation (content per element)
        const density = totalContent / Math.max(totalElements, 1);

        if (density > 100) return 0.9;
        if (density > 50) return 0.7;
        if (density > 25) return 0.5;
        return 0.3;
    }

    createMinimalGlance() {
        return {
            body: [
                {
                    type: "TextBlock",
                    text: "Jott",
                    size: "Large",
                    weight: "Bolder"
                }
            ]
        };
    }

    isCommonWord(word) {
        const common = ['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'will', 'about'];
        return common.includes(word.toLowerCase());
    }

    capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JottCreator;
}