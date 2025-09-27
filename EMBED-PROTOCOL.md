# JFrame Embedding Protocol (JEP) Specification

## Overview
JEP is a proprietary embedding system that allows JFrames to be seamlessly integrated into any web platform while maintaining interactivity, analytics, and responsive design.

## Core Components

### 1. Embed Container
```html
<!-- Minimal embed -->
<script src="https://cdn.jframe.ai/embed.js"></script>
<jframe id="abc123"></jframe>

<!-- Full configuration -->
<jframe
  id="abc123"
  width="100%"
  height="auto"
  theme="auto"
  lang="en"
  loading="lazy"
></jframe>
```

### 2. JavaScript SDK
```javascript
// Programmatic embedding
JFrame.embed({
  id: 'abc123',
  container: '#my-container',
  options: {
    theme: 'dark',
    interactive: true,
    analytics: true,
    sandbox: 'strict'
  },
  callbacks: {
    onReady: (frame) => console.log('Frame loaded'),
    onInteract: (event) => trackEvent(event),
    onError: (error) => handleError(error)
  }
});
```

### 3. Platform Adapters

#### WordPress Shortcode
```php
[jframe id="abc123" width="full" theme="auto"]
```

#### React Component
```jsx
import { JFrameEmbed } from '@jframe/react';

<JFrameEmbed
  id="abc123"
  responsive
  onInteraction={handleInteraction}
/>
```

#### Vue Component
```vue
<jframe-embed
  :id="frameId"
  :config="embedConfig"
  @loaded="onFrameLoad"
/>
```

### 4. Responsive Modes

#### Fluid Mode
- Adapts to container width
- Maintains aspect ratio
- Reflows content for mobile

#### Fixed Mode
- Specific dimensions
- Scrollable if needed
- Best for dashboards

#### Compact Mode
- Minimal UI
- Expandable on interaction
- Ideal for sidebars

### 5. Security Features

#### Content Security Policy
```javascript
{
  sandbox: {
    allow: ['forms', 'scripts', 'same-origin'],
    deny: ['top-navigation', 'popups']
  },
  csp: {
    'default-src': "'self'",
    'img-src': "'self' https:",
    'script-src': "'self' 'unsafe-inline'"
  }
}
```

#### Origin Validation
- Whitelist allowed domains
- CORS enforcement
- Referrer checking
- Token-based auth for premium

### 6. Performance Optimization

#### Lazy Loading
```javascript
// Intersection Observer API
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      JFrame.load(entry.target.id);
    }
  });
});
```

#### Progressive Enhancement
1. Server-side render static version
2. Hydrate with interactivity
3. Load additional features on demand
4. Cache aggressively

### 7. Analytics Integration

#### Built-in Metrics
- View count
- Interaction rate
- Time on card
- Scroll depth
- Click heatmap

#### Custom Events
```javascript
JFrame.track('custom_event', {
  action: 'button_click',
  label: 'subscribe',
  value: 9.99
});
```

### 8. Theming System

#### Automatic Theme Detection
```javascript
const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';
```

#### Custom Themes
```css
.jframe-embed {
  --jf-primary: #6366f1;
  --jf-background: #ffffff;
  --jf-text: #1f2937;
  --jf-border-radius: 8px;
}
```

### 9. Communication Protocol

#### PostMessage API
```javascript
// Parent to embed
embedWindow.postMessage({
  type: 'jframe:command',
  action: 'updateTheme',
  data: { theme: 'dark' }
}, 'https://jframe.ai');

// Embed to parent
window.parent.postMessage({
  type: 'jframe:event',
  action: 'heightChanged',
  data: { height: 420 }
}, '*');
```

### 10. Fallback Strategies

#### No JavaScript
```html
<noscript>
  <img src="https://jframe.ai/static/abc123.png"
       alt="JFrame content" />
  <p><a href="https://jframe.ai/view/abc123">View on JFrame</a></p>
</noscript>
```

#### Offline Support
- Cache static version
- Queue interactions
- Sync when online
- Show offline indicator

## Implementation Examples

### 1. News Website
```html
<!-- Article with embedded JFrame infographic -->
<article>
  <h1>Market Analysis Q4 2024</h1>
  <p>The markets showed strong growth...</p>

  <jframe
    id="market-chart-q4"
    type="chart"
    responsive="true"
    caption="S&P 500 Performance"
  ></jframe>

  <p>As shown in the chart above...</p>
</article>
```

### 2. Email Newsletter
```html
<!-- Graceful degradation for email -->
<div>
  <a href="https://jframe.ai/view/abc123">
    <img src="https://jframe.ai/preview/abc123.png"
         alt="Interactive chart - click to view"
         width="600" />
  </a>
</div>
```

### 3. Mobile App WebView
```swift
// iOS Swift
let config = WKWebViewConfiguration()
config.allowsInlineMediaPlayback = true
config.mediaTypesRequiringUserActionForPlayback = []

webView.loadHTMLString("""
  <jframe id="\(frameId)"
          mobile="true"
          gestures="enabled">
  </jframe>
""", baseURL: URL(string: "https://jframe.ai"))
```

### 4. Slack App
```javascript
// Slack Block Kit with JFrame
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "Check out this week's metrics:"
  },
  "accessory": {
    "type": "button",
    "text": {
      "type": "plain_text",
      "text": "View Dashboard"
    },
    "url": "https://jframe.ai/slack/abc123",
    "action_id": "view_jframe"
  }
}
```

## Platform-Specific Optimizations

### WordPress
- Gutenberg block
- Classic editor button
- Widget support
- AMP compatibility

### Notion
- Embed block type
- Synced blocks
- Database integration
- Template gallery

### Medium
- Embed via Embedly
- Custom preview cards
- Reading time calculation
- Claps integration

### Ghost
- Native card support
- Member-only content
- Newsletter integration
- Theme compatibility

## Monetization Hooks

### Premium Features
- No watermark (paid)
- Advanced analytics (paid)
- Custom domains (paid)
- White-label option (enterprise)

### Usage Limits
- Free: 1,000 views/month
- Pro: 50,000 views/month
- Team: 500,000 views/month
- Enterprise: Unlimited

## Success Metrics

### Adoption
- Embeds per day
- Unique domains
- Platform diversity
- Developer signups

### Engagement
- Interaction rate
- View duration
- Return visits
- Sharing rate

### Performance
- Load time (target: <200ms)
- Time to interactive (<500ms)
- Lighthouse score (>95)
- Error rate (<0.1%)