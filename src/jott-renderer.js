/**
 * JottRenderer - Intelligent extension of Adaptive Cards
 * Adds progressive layers, context adaptation, and embedded intelligence
 */

class JottRenderer {
    constructor(jottDefinition, container, options = {}) {
        this.definition = jottDefinition;
        this.container = container;
        this.options = {
            startLayer: 'glance',
            autoProgress: true,
            progressionDelay: 3000,
            enableAnalytics: true,
            ...options
        };

        this.currentLayer = this.options.startLayer;
        this.context = this.captureContext();
        this.interactionHistory = [];
        this.startTime = Date.now();
        this.adaptiveCard = null;
        this.layerTimings = {};
    }

    /**
     * Capture current context for adaptation
     */
    captureContext() {
        const now = new Date();
        const hours = now.getHours();

        return {
            timestamp: now.toISOString(),
            device: this.detectDevice(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
            },
            timeContext: {
                hour: hours,
                period: this.getTimePeriod(hours),
                dayOfWeek: now.getDay(),
                isWeekend: now.getDay() === 0 || now.getDay() === 6
            },
            userPreferences: {
                theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                highContrast: window.matchMedia('(prefers-contrast: high)').matches
            },
            network: this.getNetworkInfo(),
            location: this.getLocationContext()
        };
    }

    detectDevice() {
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
        return 'desktop';
    }

    getTimePeriod(hour) {
        if (hour < 6) return 'night';
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        if (hour < 21) return 'evening';
        return 'night';
    }

    getNetworkInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                type: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return { type: 'unknown' };
    }

    getLocationContext() {
        // This would integrate with geolocation in production
        return {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: navigator.language
        };
    }

    /**
     * Main render method
     */
    render() {
        this.container.innerHTML = '';

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'jott-wrapper';
        wrapper.setAttribute('data-layer', this.currentLayer);

        // Add layer indicator
        if (this.definition.jott?.showLayerIndicator !== false) {
            const indicator = this.createLayerIndicator();
            wrapper.appendChild(indicator);
        }

        // Create card container
        const cardContainer = document.createElement('div');
        cardContainer.className = 'jott-card-container';

        // Get adapted content for current layer
        const adaptedContent = this.adaptContentForLayer();

        // Render with Adaptive Cards
        try {
            this.adaptiveCard = new AdaptiveCards.AdaptiveCard();

            // Configure card
            this.configureAdaptiveCard();

            // Parse and render
            this.adaptiveCard.parse(adaptedContent);
            const renderedCard = this.adaptiveCard.render();

            // Apply Jott enhancements
            this.enhanceRenderedCard(renderedCard);

            cardContainer.appendChild(renderedCard);
            wrapper.appendChild(cardContainer);

            // Add interaction handlers
            this.attachInteractionHandlers(wrapper);

            // Start auto-progression if enabled
            if (this.options.autoProgress) {
                this.startAutoProgression();
            }

            // Track analytics
            this.trackLayerView();

        } catch (error) {
            console.error('Jott rendering error:', error);
            wrapper.appendChild(this.createErrorCard(error));
        }

        this.container.appendChild(wrapper);

        // Trigger rendered event
        this.dispatchEvent('rendered', {
            layer: this.currentLayer,
            context: this.context
        });

        return wrapper;
    }

    /**
     * Create layer indicator UI
     */
    createLayerIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'jott-layer-indicator';

        const layers = ['glance', 'scan', 'read', 'interact'];
        layers.forEach(layer => {
            const dot = document.createElement('span');
            dot.className = 'layer-dot';
            if (layer === this.currentLayer) {
                dot.classList.add('active');
            }
            if (this.definition.jott?.layers?.[layer]) {
                dot.classList.add('available');
                dot.addEventListener('click', () => this.switchToLayer(layer));
                dot.title = `Switch to ${layer} view`;
            }
            indicator.appendChild(dot);
        });

        return indicator;
    }

    /**
     * Adapt content based on current layer and context
     */
    adaptContentForLayer() {
        const baseCard = {
            type: "AdaptiveCard",
            version: "1.5",
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json"
        };

        // Get layer-specific content
        const layerContent = this.definition.jott?.layers?.[this.currentLayer] ||
                            this.definition.fallback ||
                            this.createDefaultLayer();

        // Apply context adaptations
        const adapted = this.applyContextAdaptations(layerContent);

        // Merge with base card structure
        return {
            ...baseCard,
            ...adapted,
            body: this.processBody(adapted.body || []),
            actions: this.processActions(adapted.actions || [])
        };
    }

    /**
     * Apply context-based adaptations to content
     */
    applyContextAdaptations(content) {
        const adapted = JSON.parse(JSON.stringify(content)); // Deep clone

        // Time-based adaptations
        if (this.context.timeContext.period === 'morning') {
            // Emphasize productivity features in morning
            if (adapted.emphasis === 'adaptive') {
                adapted.body = this.prioritizeProductivity(adapted.body);
            }
        } else if (this.context.timeContext.period === 'evening') {
            // More relaxed tone in evening
            if (adapted.tone === 'adaptive') {
                adapted.body = this.applyRelaxedTone(adapted.body);
            }
        }

        // Device adaptations
        if (this.context.device === 'mobile') {
            // Simplify for mobile
            adapted.body = this.optimizeForMobile(adapted.body);
            adapted.actions = this.simplifyActions(adapted.actions);
        }

        // Network adaptations
        if (this.context.network.type === 'slow-2g' || this.context.network.saveData) {
            // Reduce media for slow connections
            adapted.body = this.reduceMediaContent(adapted.body);
        }

        // Accessibility adaptations
        if (this.context.userPreferences.highContrast) {
            adapted.body = this.enhanceContrast(adapted.body);
        }

        return adapted;
    }

    /**
     * Process body elements with Jott enhancements
     */
    processBody(body) {
        return body.map(element => {
            // Add progressive disclosure markers
            if (element.jottLayer && element.jottLayer !== this.currentLayer) {
                element.isVisible = false;
            }

            // Add semantic density indicators
            if (element.semanticWeight) {
                element.size = this.mapSemanticWeight(element.semanticWeight);
            }

            // Process nested containers
            if (element.items) {
                element.items = this.processBody(element.items);
            }

            return element;
        });
    }

    /**
     * Process actions with Jott intelligence
     */
    processActions(actions) {
        return actions.map(action => {
            // Add analytics tracking
            const originalAction = { ...action };
            action.data = {
                ...action.data,
                jottAnalytics: {
                    layer: this.currentLayer,
                    timestamp: Date.now(),
                    context: this.context.device
                }
            };

            // Add progressive hints
            if (this.currentLayer === 'glance' && action.jottHint) {
                action.title = action.jottHint.glance || action.title;
            }

            return action;
        });
    }

    /**
     * Configure Adaptive Cards instance with Jott handlers
     */
    configureAdaptiveCard() {
        // Action execution handler
        this.adaptiveCard.onExecuteAction = (action) => {
            this.handleAction(action);
        };

        // Element selection handler
        this.adaptiveCard.onElementVisibilityChanged = (element) => {
            this.trackElementVisibility(element);
        };

        // Custom rendering for Jott elements
        this.adaptiveCard.onRenderElement = (element, renderedElement) => {
            if (element.jottType) {
                this.enhanceJottElement(element, renderedElement);
            }
        };
    }

    /**
     * Enhance rendered card with Jott features
     */
    enhanceRenderedCard(cardElement) {
        // Add Jott-specific classes
        cardElement.classList.add('jott-enhanced');
        cardElement.setAttribute('data-layer', this.currentLayer);
        cardElement.setAttribute('data-device', this.context.device);

        // Add intersection observer for engagement tracking
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackEngagement('viewed', entry.intersectionRatio);
                    }
                });
            }, { threshold: [0.25, 0.5, 0.75, 1.0] });

            observer.observe(cardElement);
        }

        // Add hover detection for desktop
        if (this.context.device === 'desktop') {
            cardElement.addEventListener('mouseenter', () => {
                this.trackEngagement('hover', 1);
                this.considerProgression();
            });
        }

        // Add touch detection for mobile
        if (this.context.device === 'mobile') {
            let touchStart = 0;
            cardElement.addEventListener('touchstart', () => {
                touchStart = Date.now();
            });
            cardElement.addEventListener('touchend', () => {
                const duration = Date.now() - touchStart;
                if (duration > 500) {
                    this.considerProgression();
                }
            });
        }
    }

    /**
     * Attach interaction handlers
     */
    attachInteractionHandlers(wrapper) {
        // Keyboard navigation
        wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.progressToNextLayer();
            } else if (e.key === 'ArrowLeft') {
                this.progressToPreviousLayer();
            }
        });

        // Swipe gestures for mobile
        if (this.context.device === 'mobile') {
            this.attachSwipeHandlers(wrapper);
        }

        // Idle detection
        this.setupIdleDetection();
    }

    /**
     * Switch to specific layer
     */
    switchToLayer(layer) {
        if (this.currentLayer === layer) return;

        const previousLayer = this.currentLayer;
        this.currentLayer = layer;

        // Track timing
        if (!this.layerTimings[previousLayer]) {
            this.layerTimings[previousLayer] = {
                entered: this.startTime,
                duration: Date.now() - this.startTime
            };
        }

        // Re-render with new layer
        this.render();

        // Dispatch layer change event
        this.dispatchEvent('layerChanged', {
            from: previousLayer,
            to: layer,
            duration: this.layerTimings[previousLayer]?.duration
        });
    }

    /**
     * Progress to next layer
     */
    progressToNextLayer() {
        const layers = ['glance', 'scan', 'read', 'interact'];
        const currentIndex = layers.indexOf(this.currentLayer);

        if (currentIndex < layers.length - 1) {
            const nextLayer = layers[currentIndex + 1];
            if (this.definition.jott?.layers?.[nextLayer]) {
                this.switchToLayer(nextLayer);
            }
        }
    }

    /**
     * Progress to previous layer
     */
    progressToPreviousLayer() {
        const layers = ['glance', 'scan', 'read', 'interact'];
        const currentIndex = layers.indexOf(this.currentLayer);

        if (currentIndex > 0) {
            const previousLayer = layers[currentIndex - 1];
            if (this.definition.jott?.layers?.[previousLayer]) {
                this.switchToLayer(previousLayer);
            }
        }
    }

    /**
     * Auto-progression logic
     */
    startAutoProgression() {
        if (this.progressionTimer) {
            clearTimeout(this.progressionTimer);
        }

        const delays = {
            glance: 3000,
            scan: 10000,
            read: 30000
        };

        const delay = delays[this.currentLayer] || this.options.progressionDelay;

        this.progressionTimer = setTimeout(() => {
            if (this.shouldAutoProgress()) {
                this.progressToNextLayer();
            }
        }, delay);
    }

    shouldAutoProgress() {
        // Don't auto-progress if user has interacted
        if (this.interactionHistory.length > 0) {
            const lastInteraction = this.interactionHistory[this.interactionHistory.length - 1];
            const timeSinceInteraction = Date.now() - lastInteraction.timestamp;
            if (timeSinceInteraction < 5000) {
                return false;
            }
        }

        // Don't progress past 'read' automatically
        return this.currentLayer !== 'interact' && this.currentLayer !== 'read';
    }

    /**
     * Consider if we should progress based on engagement
     */
    considerProgression() {
        const engagementDuration = Date.now() - this.startTime;

        if (this.currentLayer === 'glance' && engagementDuration > 3000) {
            this.progressToNextLayer();
        } else if (this.currentLayer === 'scan' && engagementDuration > 10000) {
            this.progressToNextLayer();
        }
    }

    /**
     * Handle user actions
     */
    handleAction(action) {
        // Track interaction
        this.interactionHistory.push({
            type: 'action',
            action: action.title,
            layer: this.currentLayer,
            timestamp: Date.now()
        });

        // Cancel auto-progression
        if (this.progressionTimer) {
            clearTimeout(this.progressionTimer);
        }

        // Process based on action type
        if (action.data?.jottAction === 'progressLayer') {
            this.progressToNextLayer();
        } else if (action.data?.jottAction === 'switchLayer') {
            this.switchToLayer(action.data.targetLayer);
        } else {
            // Let Adaptive Cards handle standard actions
            this.dispatchEvent('action', {
                action: action,
                layer: this.currentLayer
            });
        }
    }

    /**
     * Analytics tracking
     */
    trackLayerView() {
        if (!this.options.enableAnalytics) return;

        this.dispatchEvent('analytics', {
            event: 'layer_view',
            layer: this.currentLayer,
            context: this.context,
            timestamp: Date.now()
        });
    }

    trackEngagement(type, value) {
        if (!this.options.enableAnalytics) return;

        this.dispatchEvent('analytics', {
            event: 'engagement',
            type: type,
            value: value,
            layer: this.currentLayer,
            duration: Date.now() - this.startTime
        });
    }

    trackElementVisibility(element) {
        if (!this.options.enableAnalytics) return;

        this.dispatchEvent('analytics', {
            event: 'element_visible',
            element: element.id,
            layer: this.currentLayer
        });
    }

    /**
     * Event dispatching
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`jott:${eventName}`, {
            detail: detail,
            bubbles: true
        });
        this.container.dispatchEvent(event);
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.progressionTimer) {
            clearTimeout(this.progressionTimer);
        }
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }
        this.container.innerHTML = '';
    }

    // Helper methods for adaptations
    prioritizeProductivity(body) {
        // Move action-oriented content to top
        return body.sort((a, b) => {
            const aWeight = a.productivityWeight || 0;
            const bWeight = b.productivityWeight || 0;
            return bWeight - aWeight;
        });
    }

    applyRelaxedTone(body) {
        // Soften language in text blocks
        return body.map(element => {
            if (element.type === 'TextBlock' && element.text) {
                // This would use AI in production
                element.text = element.text.replace(/must/gi, 'can')
                                         .replace(/urgent/gi, 'when you\'re ready');
            }
            return element;
        });
    }

    optimizeForMobile(body) {
        // Simplify for mobile viewing
        return body.map(element => {
            if (element.type === 'ColumnSet') {
                // Stack columns on mobile
                element.columns = element.columns.map(col => ({
                    ...col,
                    width: 'stretch'
                }));
            }
            if (element.type === 'TextBlock') {
                // Reduce font sizes
                if (element.size === 'ExtraLarge') element.size = 'Large';
                if (element.size === 'Large') element.size = 'Medium';
            }
            return element;
        });
    }

    simplifyActions(actions) {
        // Limit to 3 most important actions on mobile
        if (actions.length > 3) {
            return actions.slice(0, 3);
        }
        return actions;
    }

    reduceMediaContent(body) {
        // Remove or reduce images for slow connections
        return body.filter(element => {
            if (element.type === 'Image' && !element.essential) {
                return false;
            }
            return true;
        });
    }

    enhanceContrast(body) {
        // Enhance colors for high contrast mode
        return body.map(element => {
            if (element.type === 'TextBlock') {
                element.color = 'Default'; // Let system handle contrast
            }
            return element;
        });
    }

    mapSemanticWeight(weight) {
        // Map semantic weight to AC sizes
        const mapping = {
            'critical': 'ExtraLarge',
            'important': 'Large',
            'normal': 'Medium',
            'supporting': 'Small'
        };
        return mapping[weight] || 'Medium';
    }

    createDefaultLayer() {
        // Fallback if no layers defined
        return {
            body: [{
                type: "TextBlock",
                text: "Jott Content",
                wrap: true
            }]
        };
    }

    createErrorCard(error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'jott-error';
        errorDiv.textContent = `Failed to render Jott: ${error.message}`;
        return errorDiv;
    }

    attachSwipeHandlers(element) {
        let touchStartX = 0;
        let touchEndX = 0;

        element.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        element.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    this.progressToPreviousLayer();
                } else {
                    this.progressToNextLayer();
                }
            }
        });
    }

    setupIdleDetection() {
        let idleTime = 0;

        const resetIdle = () => {
            idleTime = 0;
            if (this.idleTimer) clearInterval(this.idleTimer);

            this.idleTimer = setInterval(() => {
                idleTime++;
                if (idleTime > 30 && this.shouldAutoProgress()) {
                    this.progressToNextLayer();
                    clearInterval(this.idleTimer);
                }
            }, 1000);
        };

        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetIdle, true);
        });

        resetIdle();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JottRenderer;
}