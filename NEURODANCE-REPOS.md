# Neurodance Repository Strategy

## Overview
The **neurodance** GitHub organization now contains forked versions of critical dependencies, giving us control over customization while maintaining upstream compatibility.

## Repository Structure

```
C:\_source\repos\
├── jframe\                     (Main project)
│   ├── jottr-io\               (Creative platform)
│   └── [JFrame infrastructure files]
├── AdaptiveCards\              (neurodance fork)
├── daisyui\                    (neurodance fork)
├── FigmaToCode\                (neurodance fork)
└── chrome-devtools-mcp\        (neurodance fork)
```

## Repository Purposes & Modifications

### 1. neurodance/AdaptiveCards
**Upstream**: Microsoft/AdaptiveCards
**Purpose**: Core rendering engine with Jott-specific extensions

**Planned Modifications**:
- Add support for micro-video elements (<10 sec)
- Implement "conciseness" layout modes
- Add "extensibility" action types (continue, expand)
- Support for voice narration attachments
- Progressive disclosure components

**Integration Points**:
- JFrame will use this as primary rendering engine
- Custom schema extensions for Jott format
- Maintain compatibility with standard AC hosts

### 2. neurodance/daisyui
**Upstream**: saadeghi/daisyui
**Purpose**: Component design patterns adapted for Jotts

**Planned Modifications**:
- Create Jott-specific component variants
- Mobile-first responsive patterns
- Video thumbnail components
- Voice input UI components
- Concise card layouts (3-point summaries)

**Integration Points**:
- Template library for Jottr.io
- CSS patterns for JFrame rendering
- Theme system for brand consistency

### 3. neurodance/FigmaToCode
**Upstream**: bernaferrari/FigmaToCode
**Purpose**: Convert Figma designs directly to Jott format

**Planned Modifications**:
- Add Adaptive Cards JSON output format
- Implement Jott schema mapping
- Support for component extraction
- Design token to Jott variable mapping
- Batch conversion for template libraries

**Integration Points**:
- Jottr.io design import feature
- Figma plugin development
- Template marketplace population

### 4. neurodance/chrome-devtools-mcp
**Upstream**: ChromeDevTools/chrome-devtools-mcp
**Purpose**: Testing, debugging, and performance profiling

**Current Capabilities** (No modifications needed):
- Browser automation via Puppeteer
- Performance trace recording
- Network request analysis
- Screenshot capture
- Console debugging

**Usage Strategy**:
- Automated testing of Jott rendering
- Cross-browser compatibility testing
- Performance profiling (target: <100ms render)
- Visual regression testing
- Mobile simulation testing

## Development Workflow

### For Each Forked Repo:

1. **Initial Setup**:
   ```bash
   cd ../AdaptiveCards
   git remote add upstream https://github.com/microsoft/AdaptiveCards.git
   git fetch upstream
   ```

2. **Feature Development**:
   - Create feature branches for Jott-specific modifications
   - Keep main branch close to upstream for easy merging
   - Document all customizations

3. **Upstream Sync**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git push origin main
   ```

4. **Testing Integration**:
   - Use chrome-devtools-mcp for all testing
   - Automated test suite for modifications
   - Performance benchmarks

## Implementation Timeline

### Week 1 (Immediate):
1. Set up development environment with all forks
2. Configure chrome-devtools-mcp for testing
3. Begin AdaptiveCards customization for video support
4. Extract first 10 daisyui patterns for templates

### Week 2:
1. Implement conciseness features in AdaptiveCards
2. Create Jott-specific daisyui components
3. Set up FigmaToCode development environment
4. Build automated test suite with chrome-devtools-mcp

### Week 3-4:
1. Complete AdaptiveCards Jott extensions
2. Implement FigmaToCode Adaptive Cards output
3. Full integration testing across platforms
4. Performance optimization

## Maintenance Strategy

### Version Control:
- Tag releases as `jott-v1.0.0` etc.
- Maintain CHANGELOG for Jott modifications
- Document breaking changes from upstream

### Security:
- Monitor upstream security advisories
- Rapid merge of security patches
- Regular dependency updates

### Community:
- Contribute improvements back to upstream
- Open source Jott-specific features
- Build community around extensions

## Risk Mitigation

### Fork Divergence:
- **Risk**: Too much customization makes merging difficult
- **Mitigation**: Use composition over modification where possible
- **Strategy**: Build Jott features as plugins/extensions

### Upstream Abandonment:
- **Risk**: Original projects become unmaintained
- **Mitigation**: We control our destiny with forks
- **Strategy**: Build community around neurodance versions

### License Compliance:
- **AdaptiveCards**: MIT ✅
- **daisyui**: MIT ✅
- **FigmaToCode**: MIT ✅
- **chrome-devtools-mcp**: Apache 2.0 ✅

All licenses are compatible with commercial use.

## Next Actions

1. **Today**:
   - Configure all repos with upstream remotes
   - Set up chrome-devtools-mcp for testing
   - Create first Jott extension in AdaptiveCards

2. **Tomorrow**:
   - Extract daisyui patterns for templates
   - Begin FigmaToCode output format development
   - Write automated tests

3. **This Week**:
   - Complete video support in AdaptiveCards
   - Create 10 Jott templates
   - Deploy demo with custom rendering

## Conclusion

Having neurodance forks provides:
- **Control**: Direct customization capability
- **Speed**: No waiting for PR approvals
- **Innovation**: Freedom to experiment
- **Security**: Upstream sync for patches
- **Testing**: chrome-devtools-mcp for quality assurance

This positions us to move faster while maintaining compatibility with the broader ecosystem.