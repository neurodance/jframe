# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JFrame is a client-side web application that generates Adaptive Cards using AI (Claude Code with the anthropic api account "jordan@goldcode.com") or demo mode. It's a static HTML/JavaScript application designed for GitHub Pages deployment with no backend requirements.

## Development Commands

Since this is a static web application with no build system:

```bash
# Serve locally with Python
python -m http.server 8000

# Or with Node.js
npx serve .
```

## Architecture

### Core Files
- **index.html**: Main HTML page with chat-like interface for entering prompts
- **app.js**: Main application logic implementing the `JFrameApp` class that handles:
  - User input and API key management (stored in localStorage)
  - OpenAI API integration for card generation
  - Demo mode with predefined card templates
  - Adaptive Cards rendering
- **style.css**: Application styles with modern chat interface design
- **lib/adaptivecards.js**: Local fallback for Adaptive Cards library
- **lib/adaptivecards.css**: Local fallback for Adaptive Cards styles

### Key Implementation Details

**JFrameApp Class Structure** (app.js):
- Constructor initializes DOM element references
- `generateCard()`: Main method that handles prompt processing, API calls or demo mode
- `callGPT()`: Makes OpenAI API calls with system prompt for Adaptive Card generation
- `getDemoCard()`: Returns predefined cards based on prompt keywords
- `renderAdaptiveCard()`: Uses AdaptiveCards library to render JSON as visual cards
- `addUserMessage()`, `addAssistantMessage()`: Handle chat message display
- API keys stored in localStorage, never transmitted except to OpenAI

**Demo Mode Logic**:
- Activates when no API key is provided
- Analyzes prompt keywords to return appropriate demo cards
- Includes examples for: Eiffel Tower, weather, products, profiles, and a generic fallback

## External Dependencies

- **Adaptive Cards Library**: Loaded from CDN (unpkg.com) with local fallback in `/lib`
- **OpenAI API**: For AI-powered card generation (optional - demo mode available)

## Deployment

This project is designed for GitHub Pages - simply enable Pages in repository settings. No build step required.

## User Context & Preferences

### Background
- **Strong expertise**: .NET, C#, T-SQL, Windows, Azure, Microsoft ecosystem, PowerShell 7
- **Learning focus**: Bash shell commands and Git/GitHub CLI
- **Preferred approach**: Beginner-friendly explanations for bash and git commands

### Assistant Guidelines

When working with this user:

1. **Bash Commands**:
   - Always explain what bash commands do before running them
   - Provide PowerShell equivalents when helpful for understanding
   - Break down complex command syntax (pipes, redirects, flags)
   - Example: Instead of just `ls -la`, explain "Lists all files including hidden ones (-a) in long format (-l) showing permissions, owner, size, and date"

2. **Git/GitHub CLI**:
   - Explain git concepts and workflows clearly
   - Show what each git command does to the repository
   - Provide context for why certain git practices are recommended
   - Example: Explain "git status shows uncommitted changes" rather than assuming knowledge

3. **Development Approach**:
   - Leverage user's .NET/C# knowledge when explaining JavaScript concepts
   - Draw parallels to familiar Microsoft tools when introducing new concepts
   - Can assume comfort with IDEs, debugging, and general programming concepts

4. **Communication Style**:
   - Be educational but not condescending
   - Provide "learning moments" when using bash or git
   - Offer tips for remembering common commands
   - Show both the "what" and the "why" for terminal operations