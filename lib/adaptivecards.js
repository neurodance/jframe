// Minimal Adaptive Cards fallback implementation
window.AdaptiveCards = {
    AdaptiveCard: function() {
        let cardData = null;
        
        return {
            parse: function(json) {
                cardData = json;
            },
            
            render: function() {
                if (!cardData) {
                    return document.createElement('div');
                }
                
                const container = document.createElement('div');
                container.className = 'ac-adaptiveCard';
                
                if (cardData.body && Array.isArray(cardData.body)) {
                    cardData.body.forEach(element => {
                        const renderedElement = this.renderElement(element);
                        if (renderedElement) {
                            container.appendChild(renderedElement);
                        }
                    });
                }
                
                return container;
            },
            
            renderElement: function(element) {
                if (!element || !element.type) return null;
                
                switch (element.type) {
                    case 'TextBlock':
                        return this.renderTextBlock(element);
                    case 'Image':
                        return this.renderImage(element);
                    case 'Container':
                        return this.renderContainer(element);
                    case 'ColumnSet':
                        return this.renderColumnSet(element);
                    case 'FactSet':
                        return this.renderFactSet(element);
                    default:
                        const div = document.createElement('div');
                        div.innerHTML = `<em>[${element.type} not supported in fallback mode]</em>`;
                        return div;
                }
            },
            
            renderTextBlock: function(element) {
                const textBlock = document.createElement('div');
                textBlock.className = 'ac-textBlock';
                textBlock.textContent = element.text || '';
                
                if (element.weight === 'bolder') {
                    textBlock.style.fontWeight = 'bold';
                }
                if (element.size === 'large') {
                    textBlock.style.fontSize = '1.2em';
                } else if (element.size === 'medium') {
                    textBlock.style.fontSize = '1.1em';
                }
                if (element.color === 'accent') {
                    textBlock.style.color = '#0078d4';
                }
                
                return textBlock;
            },
            
            renderImage: function(element) {
                const img = document.createElement('img');
                img.className = 'ac-image';
                img.src = element.url || '';
                img.alt = element.altText || '';
                
                if (element.size === 'small') {
                    img.style.maxWidth = '80px';
                } else if (element.size === 'medium') {
                    img.style.maxWidth = '120px';
                }
                
                return img;
            },
            
            renderContainer: function(element) {
                const container = document.createElement('div');
                container.className = 'ac-container';
                
                if (element.items && Array.isArray(element.items)) {
                    element.items.forEach(item => {
                        const renderedItem = this.renderElement(item);
                        if (renderedItem) {
                            container.appendChild(renderedItem);
                        }
                    });
                }
                
                return container;
            },
            
            renderColumnSet: function(element) {
                const columnSet = document.createElement('div');
                columnSet.className = 'ac-columnSet';
                
                if (element.columns && Array.isArray(element.columns)) {
                    element.columns.forEach(column => {
                        const columnDiv = document.createElement('div');
                        columnDiv.className = 'ac-column';
                        
                        if (column.items && Array.isArray(column.items)) {
                            column.items.forEach(item => {
                                const renderedItem = this.renderElement(item);
                                if (renderedItem) {
                                    columnDiv.appendChild(renderedItem);
                                }
                            });
                        }
                        
                        columnSet.appendChild(columnDiv);
                    });
                }
                
                return columnSet;
            },
            
            renderFactSet: function(element) {
                const factSet = document.createElement('div');
                factSet.className = 'ac-factSet';
                
                if (element.facts && Array.isArray(element.facts)) {
                    element.facts.forEach(fact => {
                        const factDiv = document.createElement('div');
                        factDiv.className = 'ac-fact';
                        
                        const titleSpan = document.createElement('span');
                        titleSpan.className = 'ac-fact-title';
                        titleSpan.textContent = fact.title || '';
                        
                        const valueSpan = document.createElement('span');
                        valueSpan.textContent = fact.value || '';
                        
                        factDiv.appendChild(titleSpan);
                        factDiv.appendChild(valueSpan);
                        factSet.appendChild(factDiv);
                    });
                }
                
                return factSet;
            }
        };
    }
};