# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**⚠️ IMPORTANT**: This repository contains TWO distinct but interdependent projects. See [PROJECT-ARCHITECTURE.md](./PROJECT-ARCHITECTURE.md) for detailed architecture and relationships.

### JFrame (This Repository - Infrastructure Layer)
JFrame is the **embedding and distribution infrastructure** for "Jotts" - a new creative medium. It provides the virtual infrastructure (interfaces, protocols, security, connectors, APIs, logging) that makes Jotts deployable anywhere:
- Web pages, emails, chat platforms (Teams/Slack/Zoom)
- Social media (Facebook, Twitter/X, Instagram)
- Secure enterprise environments
- Any visual interface or form factor

**Current Implementation**: A client-side web application that generates Adaptive Cards using AI (Claude Code with the anthropic api account "jordan@goldcode.com") or demo mode. Static HTML/JavaScript for GitHub Pages deployment.

### Jottr.io (Subdirectory - Creative Layer)
Located in `jottr-io/` subdirectory. The **creative platform** for creating and publishing Jotts:
- Visual studio for Jott creation
- Publishing platform (similar to Substack model)
- Built on AdaptiveCards concepts with enhanced interactivity
- React + TypeScript + Vite with Catalyst UI Kit

**Note**: These projects work together - JFrame makes Jotts deployable everywhere, while Jottr.io is where creators build them.

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
- **Strong expertise**: .NET, C#, ASP.NET, T-SQL, Windows, Azure, Microsoft ecosystem, PowerShell 7
- **Currently learning**:
  - Bash shell commands and Git/GitHub CLI
  - Next.js and modern React patterns
  - TypeScript (transitioning from C# background)
  - Python programming
  - Modern web deployment (Vercel, Cloudflare, Supabase)
- **Preferred approach**: Detailed explanations with the "why" behind architectural decisions
- **Learning style**: Values tutoring and hand-holding for new technologies

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

3. **TypeScript/JavaScript**:
   - Draw parallels to C# concepts (e.g., "interfaces are like C# interfaces", "async/await works similarly")
   - Explain differences explicitly (e.g., "unlike C#, TypeScript types are compile-time only")
   - Compare Next.js patterns to ASP.NET MVC/Razor Pages when relevant
   - Point out when JavaScript behaves differently than expected from C#

4. **Modern Web Development**:
   - Explain React hooks by comparing to C# state management patterns
   - Clarify client vs server components (similar to WebForms code-behind vs JavaScript)
   - Break down the deployment pipeline step-by-step
   - Explain why certain architectural choices are made (e.g., "Vercel over Cloudflare because...")

5. **Python Learning**:
   - Leverage C# knowledge (e.g., "Python lists are like C# List<T>")
   - Highlight Python's different philosophy (dynamic typing, indentation)
   - Start with practical examples relevant to web development

6. **Communication Style**:
   - Be educational but not condescending
   - Provide "learning moments" for new technologies
   - Always explain the "why" behind decisions
   - Show both the "what" and the "why" for all operations
   - Give context about industry best practices