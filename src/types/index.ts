/**
 * Core type definitions for JFrame and Jott system
 */

// Base Adaptive Card types (extending Microsoft's schema)
export interface AdaptiveCard {
  type: 'AdaptiveCard';
  version: '1.0' | '1.1' | '1.2' | '1.3' | '1.4' | '1.5';
  body: CardElement[];
  actions?: Action[];
  $schema?: string;
}

export interface CardElement {
  type: string;
  id?: string;
  isVisible?: boolean;
  separator?: boolean;
  spacing?: 'none' | 'small' | 'default' | 'medium' | 'large' | 'extraLarge';
}

export interface TextBlock extends CardElement {
  type: 'TextBlock';
  text: string;
  size?: 'small' | 'default' | 'medium' | 'large' | 'extraLarge';
  weight?: 'lighter' | 'default' | 'bolder';
  color?: 'default' | 'dark' | 'light' | 'accent' | 'good' | 'warning' | 'attention';
  wrap?: boolean;
}

export interface Image extends CardElement {
  type: 'Image';
  url: string;
  altText?: string;
  size?: 'auto' | 'stretch' | 'small' | 'medium' | 'large';
}

export interface Action {
  type: string;
  title: string;
  id?: string;
}

// Jott-specific extensions
export interface JottCard extends AdaptiveCard {
  jottMetadata: JottMetadata;
  version: '1.5'; // Force latest version for Jotts
}

export interface JottMetadata {
  id: string;
  created: Date;
  modified: Date;
  author?: string;
  conciseness: ConcisenessConfig;
  extensibility: ExtensibilityConfig;
  media?: MediaConfig;
  analytics?: AnalyticsConfig;
}

// Conciseness: "Every Jott tells a story in 7 seconds or less"
export interface ConcisenessConfig {
  headline: string;
  keyPoints: string[]; // Max 3 points
  expandable: boolean;
  readTime: number; // Seconds
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Extensibility: "Start simple, scale infinitely"
export interface ExtensibilityConfig {
  canExpand: boolean;
  canContinue: boolean;
  hasMore: boolean;
  relatedJotts?: string[]; // IDs of related Jotts
  nextJott?: string; // ID of next in sequence
  expansionType?: 'detail' | 'narrative' | 'exploration';
}

// Media support for video/audio Jotts
export interface MediaConfig {
  type: 'video' | 'audio' | 'image' | 'mixed';
  sources: MediaSource[];
  duration?: number; // Seconds (max 10 for micro-videos)
  thumbnail?: string;
  autoplay?: boolean;
  captions?: Caption[];
}

export interface MediaSource {
  url: string;
  mimeType: string;
  quality?: 'low' | 'medium' | 'high';
}

export interface Caption {
  language: string;
  url: string;
  label?: string;
}

// Analytics for tracking engagement
export interface AnalyticsConfig {
  views?: number;
  expansions?: number;
  shares?: number;
  completionRate?: number;
  averageViewTime?: number;
}

// Jott types
export enum JottType {
  Text = 'text',
  Video = 'video',
  Audio = 'audio',
  Interactive = 'interactive',
  Data = 'data',
  Mixed = 'mixed'
}

// Creator types
export interface Jotter {
  id: string;
  name: string;
  avatar?: string;
  verified?: boolean;
  subscriberCount?: number;
}

// API types
export interface JottRequest {
  prompt: string;
  type?: JottType;
  style?: 'casual' | 'professional' | 'creative' | 'technical';
  maxDuration?: number;
  targetAudience?: string;
}

export interface JottResponse {
  jott: JottCard;
  generated: Date;
  model?: string;
  confidence?: number;
}

// Renderer configuration
export interface RenderConfig {
  container: HTMLElement | string;
  theme?: 'light' | 'dark' | 'auto';
  responsive?: boolean;
  trackAnalytics?: boolean;
  onExpand?: (jott: JottCard) => void;
  onContinue?: (jott: JottCard) => void;
  onShare?: (jott: JottCard) => void;
}

// Error types
export class JottError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'JottError';
  }
}

export class ValidationError extends JottError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class RenderError extends JottError {
  constructor(message: string, details?: unknown) {
    super(message, 'RENDER_ERROR', details);
    this.name = 'RenderError';
  }
}

// Type guards (useful for runtime validation)
export function isJottCard(card: unknown): card is JottCard {
  return (
    typeof card === 'object' &&
    card !== null &&
    'type' in card &&
    (card as any).type === 'AdaptiveCard' &&
    'jottMetadata' in card
  );
}

export function isTextBlock(element: unknown): element is TextBlock {
  return (
    typeof element === 'object' &&
    element !== null &&
    'type' in element &&
    (element as any).type === 'TextBlock'
  );
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type JottTemplate = DeepPartial<JottCard>;

// Export all types as namespace for convenience
export as namespace JFrame;