# TypeScript Migration Plan

## Decision: ✅ YES - Use TypeScript Everywhere

### Why TypeScript for JFrame/Jottr.io

#### 1. Perfect Match for Your Background
- **C# Developer** → TypeScript has similar type system
- **Enterprise experience** → TS provides enterprise-grade safety
- **Learning modern web** → TS is industry standard for serious web apps

#### 2. Your Stack Already Supports It
- **jottr-io**: Already React + TypeScript
- **chrome-devtools-mcp**: TypeScript
- **FigmaToCode**: 98.4% TypeScript
- **AdaptiveCards**: Has TypeScript definitions

#### 3. Project Benefits
- **Type safety** for Jott schemas
- **IntelliSense** for AdaptiveCards API
- **Refactoring confidence** across repos
- **Self-documenting** code

## Migration Timeline

### Week 1: Foundation (IMMEDIATE START)
```bash
# Install TypeScript tooling
npm install --save-dev typescript @types/node ts-node tsx

# Add build scripts to package.json
"scripts": {
  "build": "tsc",
  "dev": "tsx watch src/app.ts",
  "type-check": "tsc --noEmit"
}
```

### Week 2: Core Files Migration
| File | Migration | Priority |
|------|-----------|----------|
| app.js → app.ts | Add types for JFrameApp class | HIGH |
| tests/*.js → tests/*.ts | Type test helpers | HIGH |
| New Jott types | Create from scratch | HIGH |

### Week 3: Full Conversion
- All JavaScript files converted
- Type definitions for external libs
- Shared types package

## Key TypeScript Files to Create

### 1. Core Types (`src/types/index.ts`)
```typescript
// Adaptive Card types with Jott extensions
export interface JottCard extends AdaptiveCard {
  jottMetadata: {
    conciseness: ConcisenessConfig;
    extensibility: ExtensibilityConfig;
    media?: MediaConfig;
  };
}

export interface ConcisenessConfig {
  headline: string;
  keyPoints: string[];
  expandable: boolean;
  maxDuration?: number; // for video/audio
}

export interface MediaConfig {
  type: 'video' | 'audio' | 'image';
  url: string;
  duration?: number;
  thumbnail?: string;
}
```

### 2. API Types (`src/types/api.ts`)
```typescript
// OpenAI/Claude API types
export interface AIProvider {
  generateCard(prompt: string): Promise<JottCard>;
  validateCard(card: unknown): card is JottCard;
}

export interface APIResponse<T> {
  data: T;
  error?: string;
  timestamp: Date;
}
```

### 3. Component Types (`src/types/components.ts`)
```typescript
// React component props (for jottr-io)
export interface JottEditorProps {
  initialCard?: JottCard;
  onSave: (card: JottCard) => Promise<void>;
  onPreview: (card: JottCard) => void;
  features: EditorFeatures;
}

export interface EditorFeatures {
  videoCapture: boolean;
  aiAssist: boolean;
  templates: boolean;
  collaboration: boolean;
}
```

## C# to TypeScript Patterns

### Interfaces (Familiar!)
```typescript
// Just like C# interfaces
interface IRenderer {
  render(card: JottCard): HTMLElement;
  validate(input: unknown): boolean;
}

// Implementation
class AdaptiveCardRenderer implements IRenderer {
  render(card: JottCard): HTMLElement {
    // Implementation
  }
}
```

### Enums (Like C#)
```typescript
// String enums (better than C# for web)
enum JottType {
  Text = 'text',
  Video = 'video',
  Audio = 'audio',
  Interactive = 'interactive'
}

// Use in types
interface Jott {
  type: JottType;
  content: string;
}
```

### Generics (Like C#)
```typescript
// Generic repository pattern
class Repository<T extends { id: string }> {
  private items: Map<string, T> = new Map();

  async find(id: string): Promise<T | undefined> {
    return this.items.get(id);
  }

  async save(item: T): Promise<void> {
    this.items.set(item.id, item);
  }
}

// Usage
const jottRepo = new Repository<JottCard>();
```

### Async/Await (Like C#)
```typescript
// Async patterns you know from C#
async function processJott(id: string): Promise<JottCard> {
  try {
    const raw = await fetchJott(id);
    const validated = validateJott(raw);
    return await enhanceWithAI(validated);
  } catch (error) {
    console.error('Processing failed:', error);
    throw new JottProcessingError(error);
  }
}
```

## Configuration Files

### Package.json Updates
```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "dev": "tsx watch src/app.ts",
    "test": "vitest",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

### ESLint for TypeScript
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

## Benefits You'll See Immediately

1. **IntelliSense Everything**
   - Full autocomplete for AdaptiveCards
   - Type hints for all APIs
   - Catch typos instantly

2. **Refactoring Safety**
   - Rename across entire codebase
   - Find all usages
   - Safe extraction

3. **Documentation in Code**
   ```typescript
   /** Configuration for Jott rendering */
   interface RenderConfig {
     /** Maximum render time in ms */
     timeout: number;
     /** Enable performance tracking */
     trackPerformance: boolean;
   }
   ```

4. **Catch Errors at Compile Time**
   - No more `undefined is not a function`
   - Type mismatches caught early
   - Required properties enforced

## Migration Priority

### Phase 1 (This Week)
- [x] Create tsconfig.json
- [ ] Convert app.js → app.ts
- [ ] Add type definitions for Jott
- [ ] Update package.json scripts

### Phase 2 (Next Week)
- [ ] Convert all test files
- [ ] Create shared types package
- [ ] Add API type definitions

### Phase 3 (Week 3)
- [ ] Full TypeScript in jframe
- [ ] Integrate with jottr-io types
- [ ] Type-safe API contracts

## Conclusion

With your C# background, TypeScript will feel natural and provide the type safety you're used to. Every major library you're using already supports TypeScript, making this a no-brainer decision.

**Start writing all NEW code in TypeScript today**, then gradually migrate existing JavaScript files.