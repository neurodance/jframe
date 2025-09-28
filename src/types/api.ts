/**
 * API-related type definitions
 */

import type { JottCard, JottType } from './index';

// AI Provider interfaces
export interface AIProvider {
  name: 'openai' | 'anthropic' | 'azure' | 'local';
  generateCard(request: GenerateRequest): Promise<GenerateResponse>;
  validateCard(card: unknown): Promise<ValidationResult>;
  enhanceCard(card: JottCard): Promise<JottCard>;
}

export interface GenerateRequest {
  prompt: string;
  type?: JottType;
  style?: CardStyle;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  examples?: JottCard[];
}

export interface GenerateResponse {
  card: JottCard;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
  suggestions?: string[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

// OpenAI-specific types
export interface OpenAIConfig {
  apiKey: string;
  model?: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  baseUrl?: string;
  organization?: string;
}

export interface OpenAIRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
  tools?: Tool[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_calls?: ToolCall[];
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

// Anthropic/Claude-specific types
export interface AnthropicConfig {
  apiKey: string;
  model?: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';
  baseUrl?: string;
}

export interface AnthropicRequest {
  model: string;
  messages: ClaudeMessage[];
  max_tokens: number;
  temperature?: number;
  system?: string;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
}

export interface ContentBlock {
  type: 'text' | 'image';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

// Storage interfaces
export interface StorageProvider {
  save(key: string, value: unknown): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
}

export class LocalStorageProvider implements StorageProvider {
  async save(key: string, value: unknown): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async load<T>(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async list(prefix?: string): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!prefix || key.startsWith(prefix))) {
        keys.push(key);
      }
    }
    return keys;
  }
}

// Template management
export interface TemplateProvider {
  getTemplate(id: string): Promise<JottCard | null>;
  listTemplates(category?: string): Promise<TemplateInfo[]>;
  saveTemplate(template: JottCard, info: TemplateInfo): Promise<string>;
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  usage?: number;
  rating?: number;
}

// Analytics interfaces
export interface AnalyticsProvider {
  trackEvent(event: AnalyticsEvent): Promise<void>;
  getMetrics(jottId: string): Promise<JottMetrics>;
}

export interface AnalyticsEvent {
  type: 'view' | 'expand' | 'continue' | 'share' | 'complete';
  jottId: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface JottMetrics {
  jottId: string;
  views: number;
  uniqueViews: number;
  expansions: number;
  completions: number;
  averageViewTime: number;
  shareCount: number;
}

// Style configurations
export type CardStyle =
  | 'minimal'
  | 'modern'
  | 'classic'
  | 'vibrant'
  | 'professional'
  | 'creative'
  | 'data-driven'
  | 'storytelling';

// HTTP client types
export interface HttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<T>;
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(url: string, options?: RequestOptions): Promise<T>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

// Response types
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  code: string;
  status?: number;
  details?: unknown;
}

// Export as namespace
export as namespace JFrameAPI;