# Product Backlog & Roadmap

## Executive Summary

Based on our research and strategic planning, this document organizes our backlog into prioritized epics and sprints.

**MAJOR UPDATE**: We now have **neurodance** forks of key repositories:
- ✅ **AdaptiveCards** (Microsoft) - Core rendering engine
- ✅ **daisyui** - Component library
- ✅ **FigmaToCode** - Design-to-code pipeline
- ✅ **chrome-devtools-mcp** - Browser automation & testing

**Revised Strategy**: With chrome-devtools-mcp, we CAN implement MCP sooner for **testing & debugging** purposes, not for design integration.

## Mobile Capture Innovation 🎥📱

### Core Concept: "Micro-Video Jotts"
**Vision**: Enable Jotters to create rich content using their phone's camera and microphone with AI assistance.

### Key Features:
1. **Video Bullets** (<10 seconds)
   - Quick video snippets as bullet points
   - AI-powered auto-transcription
   - Visual summarization (key frames extraction)

2. **Voice-to-Jott**
   - Audio narration converted to structured Jotts
   - AI-powered formatting and structure
   - Automatic headline generation

3. **Smart Camera Capture**
   - Document scanning → Instant Jott
   - Whiteboard capture → Structured points
   - Screenshot annotation → Interactive cards

### Technical Implementation:
```javascript
// Mobile Capture API Design
interface MobileCapture {
  video: {
    maxDuration: 10, // seconds
    autoTranscribe: true,
    extractKeyFrames: true,
    aiSummarize: true
  },
  audio: {
    voiceToText: true,
    structureContent: true,
    generateHeadlines: true
  },
  camera: {
    documentMode: true,
    whiteboardMode: true,
    annotationTools: true
  }
}
```

## REVISED: Blue Ocean Prioritized Epics

### Epic 0: Mind-Reading MVP (Sprint 1-2) 🧠 NEW TOP PRIORITY

**Sprint 1: Context Engine**
- [ ] Build browser history analyzer
- [ ] Integrate calendar API (Google/Outlook)
- [ ] Create email thread analyzer
- [ ] Implement time/location awareness
- [ ] Design intent inference system

**Sprint 2: Voice-First Experience**
- [ ] Implement "Jott now" wake word detection
- [ ] Build natural language command parser
- [ ] Create conversational flow engine
- [ ] Add voice-to-Jott generation
- [ ] Implement recipient targeting ("to Jane")

### Epic 1: Foundation (Sprint 3-4) ⚡ REVISED PRIORITY

**Sprint 1: Core Infrastructure**
- [x] ~~Fork microsoft/AdaptiveCards repository~~ **DONE - neurodance/AdaptiveCards**
- [ ] Customize AdaptiveCards fork for Jott extensions
- [ ] Set up JFrame rendering engine using local AdaptiveCards
- [ ] Implement basic Jott schema extensions
- [ ] Create 10 demo templates using **local daisyui fork**
- [ ] Integrate chrome-devtools-mcp for automated testing
- [ ] Deploy to GitHub Pages

**Sprint 2: Creative Studio MVP**
- [ ] Set up Jottr.io React/TypeScript/Vite project
- [ ] Integrate Catalyst UI Kit
- [ ] Build visual card editor (basic)
- [ ] Implement template selection
- [ ] Create save/load functionality

### Epic 2: Mobile-First Features (Sprint 3-4) 📱

**Sprint 3: Mobile Capture**
- [ ] Implement camera access (MediaDevices API)
- [ ] Add video recording (<10 sec limit)
- [ ] Integrate speech-to-text (Web Speech API)
- [ ] Build AI summarization (OpenAI/Claude API)
- [ ] Create mobile-optimized UI

**Sprint 4: AI Enhancement**
- [ ] Video frame extraction
- [ ] Auto-transcription pipeline
- [ ] Content structuring algorithms
- [ ] Smart bullet point generation
- [ ] Visual-to-Jott conversion

### Epic 3: Design Integration (Sprint 5-6) 🎨

**Sprint 5: Design Tools**
- [ ] Integrate **local FigmaToCode fork** for design-to-Jott conversion
- [ ] Create Figma plugin using neurodance/FigmaToCode
- [ ] Build design token importer
- [ ] Implement color/typography extraction
- [ ] Add template library from designs
- [ ] Use chrome-devtools-mcp for visual regression testing
- [ ] Create design system documentation

**Sprint 6: Visual Editor**
- [ ] Integrate Onlook concepts (simplified)
- [ ] Add drag-and-drop functionality
- [ ] Implement real-time preview
- [ ] Build component library
- [ ] Add responsive design tools

### Epic 4: Platform Distribution (Sprint 7-8) 🚀

**Sprint 7: Embedding Infrastructure**
- [ ] Build embeddable widget (iframe)
- [ ] Create WordPress plugin
- [ ] Develop email renderer
- [ ] Add social media previews
- [ ] Implement CDN distribution

**Sprint 8: Chat Platforms**
- [ ] Teams app development
- [ ] Slack integration
- [ ] Discord bot
- [ ] WhatsApp Business API
- [ ] Zoom app marketplace

### Epic 5: Creator Economy (Sprint 9-10) 💰

**Sprint 9: Monetization**
- [ ] Creator dashboard
- [ ] Subscription management
- [ ] Payment integration (Stripe)
- [ ] Analytics dashboard
- [ ] Revenue sharing system

**Sprint 10: Marketplace**
- [ ] Template marketplace
- [ ] Premium Jott store
- [ ] Creator profiles
- [ ] Discovery algorithm
- [ ] Social features

### Epic 6: Enterprise Features (Sprint 11-12) 🏢

**Sprint 11: Security & Compliance**
- [ ] SSO/SAML integration
- [ ] Data encryption
- [ ] Audit logging
- [ ] GDPR compliance
- [ ] Role-based access

**Sprint 12: Advanced Features**
- [ ] API marketplace
- [ ] White-label options
- [ ] Custom branding
- [ ] Advanced analytics
- [ ] SLA monitoring

## Revised MCP Strategy

### chrome-devtools-mcp Implementation (Sprint 1+) ✅ NOW ACTIVE
**New Capability Unlocked:**
- **Browser automation & testing** via Puppeteer
- **Performance profiling** for Jott rendering
- **Visual regression testing** for templates
- **Network analysis** for API optimization
- **Debugging support** for development

**Implementation Plan:**
1. **Sprint 1**: Use for automated testing of Jott rendering
2. **Sprint 3**: Performance profiling of mobile features
3. **Sprint 5**: Visual regression testing for design tools
4. **Sprint 7**: Cross-platform compatibility testing

### Design MCP Server (Still Deferred)
**Why Still Deferred:**
- Figma MCP complexity remains high
- Local FigmaToCode fork provides sufficient capability
- Focus on chrome-devtools-mcp for testing first

## Forked Repository Integration Strategy

### neurodance/AdaptiveCards
- **Purpose**: Core rendering engine with Jott extensions
- **Modifications**: Add video/audio support, conciseness features
- **Maintenance**: Track upstream, selective merges

### neurodance/daisyui
- **Purpose**: Component patterns for Jott templates
- **Modifications**: Jott-specific components, mobile optimizations
- **Maintenance**: Independent evolution

### neurodance/FigmaToCode
- **Purpose**: Design-to-Jott conversion pipeline
- **Modifications**: Adaptive Cards output format
- **Maintenance**: Extend, not replace core functionality

### neurodance/chrome-devtools-mcp
- **Purpose**: Testing, debugging, performance
- **Usage**: Development tool, not production dependency
- **Maintenance**: Track upstream for security updates

## Technology Decisions

### Immediate Stack (Locked In):
- **JFrame**: Vanilla JS, AdaptiveCards, GitHub Pages
- **Jottr.io**: React, TypeScript, Vite, Catalyst UI
- **Mobile**: Web APIs (MediaDevices, Speech)
- **AI**: OpenAI/Claude APIs

### Deferred Technologies:
- ❌ MCP Server (too complex for now)
- ❌ Native mobile apps (web-first approach)
- ❌ Blockchain/Web3 (not aligned with vision)
- ❌ Complex backend (maintain simplicity)

## Success Metrics by Sprint

### Sprint 1-2 (Foundation)
- ✅ Working demo deployed
- ✅ 10 templates available
- ✅ < 100ms render time

### Sprint 3-4 (Mobile)
- 📱 Mobile capture working
- 🎥 Video Jotts created
- 🎤 Voice input functional

### Sprint 5-6 (Design)
- 🎨 Figma plugin released
- 📐 50+ design templates
- 👁️ Visual editor beta

### Sprint 7-8 (Platform)
- 🔌 5 platform integrations
- 📧 Email rendering working
- 💬 Teams/Slack apps live

### Sprint 9-10 (Economy)
- 💳 Payments enabled
- 👥 100 creators onboarded
- 📈 First revenue generated

### Sprint 11-12 (Enterprise)
- 🔐 Security certified
- 🏢 First enterprise customer
- 📊 $10k MRR achieved

## Risk Mitigation

### High Priority Risks:
1. **Mobile browser limitations** → Progressive enhancement
2. **AI API costs** → Caching and rate limiting
3. **Platform changes** → Abstraction layers

### Medium Priority Risks:
1. **Adoption curve** → Free tier + viral features
2. **Competition** → Focus on unique features
3. **Technical debt** → Regular refactoring

## Next Actions (This Week)

1. **Today**: Fork AdaptiveCards repo
2. **Tomorrow**: Set up project structure
3. **Day 3**: Implement first template
4. **Day 4**: Add mobile capture prototype
5. **Day 5**: Deploy MVP to GitHub Pages

## Conclusion

By prioritizing mobile-first features and deferring complex integrations like MCP servers, we can:
- Ship faster with proven technologies
- Focus on unique value (video bullets, voice Jotts)
- Maintain simplicity and reliability
- Build momentum with creators

The roadmap balances innovation (mobile capture) with pragmatism (defer MCP), ensuring we deliver value quickly while positioning for future growth.