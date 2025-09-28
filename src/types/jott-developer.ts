/**
 * Jott Developer SDK Type Definitions
 * For building agents and extending the platform
 */

import type { JottCard } from './index';
import type { CognitiveContext, JottIntent } from './cognitive';

// .jtt file structure when parsed
export interface JottTemplate {
  meta: JottMeta;
  agent: AgentDefinition;
  triggers?: TriggerDefinition;
  flow: FlowDefinition;
  privacy: PrivacyConfig;
  transparency: TransparencyConfig;
  developer?: DeveloperConfig;
  composition?: CompositionConfig;
  marketplace?: MarketplaceConfig;
  localization?: LocalizationConfig;
  versioning?: VersioningConfig;
  security?: SecurityConfig;
  performance?: PerformanceConfig;
}

export interface JottMeta {
  version: string;
  type: 'template' | 'agent' | 'composite' | 'specification';
  name: string;
  author: string;
  license: string;
  created: string;
  description: string;
}

export interface AgentDefinition {
  id: string; // Unique identifier (e.g., "com.company.agent")
  name: string;
  description: string;
  version: string;
  capabilities: AgentCapability[];
  permissions: PermissionSet;
}

export type AgentCapability =
  | 'text-generation'
  | 'data-processing'
  | 'user-interaction'
  | 'calendar-integration'
  | 'email-access'
  | 'file-system'
  | 'network-requests'
  | 'voice-interaction'
  | 'image-processing'
  | 'video-processing';

export interface PermissionSet {
  required: Permission[];
  optional: Permission[];
}

export interface Permission {
  id: string; // e.g., "storage:local", "calendar:read"
  reason: string; // Why this permission is needed
  scope?: 'read' | 'write' | 'execute';
  expires?: string; // ISO date or duration
}

export interface TriggerDefinition {
  voice?: VoiceTrigger;
  context?: ContextTrigger[];
  gesture?: GestureTrigger[];
  schedule?: ScheduleTrigger[];
}

export interface VoiceTrigger {
  phrases: string[];
  entities: VoiceEntityDefinition[];
  languages?: string[];
}

export interface VoiceEntityDefinition {
  name: string;
  type?: 'person' | 'date' | 'time' | 'location' | 'free-text' | 'enum';
  values?: string[];
  required?: boolean;
}

export interface ContextTrigger {
  type: 'time' | 'calendar' | 'location' | 'pattern' | 'cognitive';
  value: string;
  action: string;
  confidence?: number;
}

export interface GestureTrigger {
  type: 'shake' | 'double-tap' | 'long-press' | 'swipe';
  action: string;
}

export interface ScheduleTrigger {
  cron: string;
  timezone?: string;
  action: string;
}

export interface FlowDefinition {
  gather?: GatherStep;
  process?: ProcessStep[];
  generate: GenerateStep;
  deliver?: DeliverStep;
}

export interface GatherStep {
  parallel?: boolean;
  timeout?: number;
  sources: DataSource[];
  fallbacks?: Record<string, any>;
}

export interface DataSource {
  id: string;
  type: 'history' | 'cognitive' | 'environment' | 'calendar' | 'email' | 'custom';
  query: string;
  cache?: boolean;
}

export interface ProcessStep {
  id: string;
  type: 'ai' | 'transform' | 'filter' | 'aggregate' | 'custom';
  model?: string;
  input: string[];
  output: string;
  config?: Record<string, any>;
}

export interface GenerateStep {
  format: 'adaptive-card' | 'text' | 'voice' | 'video' | 'custom';
  template: string | AdaptiveCardTemplate;
  variables?: Record<string, any>;
}

export interface AdaptiveCardTemplate {
  type: 'AdaptiveCard';
  version: string;
  body: string | any[];
  actions?: any[];
}

export interface DeliverStep {
  channels: {
    primary: DeliveryChannel;
    fallback?: DeliveryChannel;
  };
  timing: DeliveryTiming;
  confirmation?: ConfirmationConfig;
}

export type DeliveryChannel =
  | 'notification'
  | 'email'
  | 'chat'
  | 'voice'
  | 'sms'
  | 'in-app';

export interface DeliveryTiming {
  immediate?: boolean;
  smart_delivery?: boolean;
  batch_similar?: boolean;
  respect_attention?: boolean;
  schedule?: string;
}

export interface ConfirmationConfig {
  required: boolean | string; // Can be conditional
  timeout?: number;
  type?: 'explicit' | 'implicit';
}

export interface PrivacyConfig {
  data: DataPrivacy;
  compliance: ComplianceFlags;
  rights: UserRights;
}

export interface DataPrivacy {
  storage: 'local-encrypted' | 'cloud-encrypted' | 'ephemeral' | 'none';
  retention: string; // Duration string like "7-days"
  sharing: 'never' | 'anonymized' | 'with-consent';
  export_format: 'json' | 'csv' | 'xml';
  encryption?: 'AES-256' | 'RSA-2048';
}

export interface ComplianceFlags {
  gdpr: boolean;
  ccpa: boolean;
  coppa: boolean;
  hipaa?: boolean;
  sox?: boolean;
}

export interface UserRights {
  access: boolean;
  rectification: boolean;
  erasure: boolean;
  portability: boolean;
  object: boolean;
}

export interface TransparencyConfig {
  level: 'minimal' | 'balanced' | 'full' | 'verbose';
  show: {
    reasoning: boolean;
    confidence: boolean;
    sources: boolean;
    alternatives: boolean;
  };
  explanations: {
    before_action?: string;
    after_action?: string;
    on_error?: string;
  };
}

export interface DeveloperConfig {
  test?: TestConfig;
  debug?: DebugConfig;
  analytics?: AnalyticsConfig;
}

export interface TestConfig {
  fixtures?: string;
  mocks?: string;
  coverage_threshold?: number;
  test_runner?: 'jest' | 'vitest' | 'mocha';
}

export interface DebugConfig {
  log_level: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  breakpoints?: boolean;
  inspector?: boolean;
  performance_tracking?: boolean;
}

export interface AnalyticsConfig {
  enabled: boolean;
  events: string[];
  anonymized: boolean;
  provider?: 'mixpanel' | 'amplitude' | 'custom';
}

export interface CompositionConfig {
  extensible: boolean;
  extends?: string[];
  compose_with?: string[];
  provides?: Interface[];
  requires?: Interface[];
}

export interface Interface {
  interface: string;
  version: string;
}

export interface MarketplaceConfig {
  publish: PublishConfig;
  ratings?: RatingsConfig;
  monetization?: MonetizationConfig;
  support?: SupportConfig;
}

export interface PublishConfig {
  public: boolean;
  category: string;
  tags: string[];
  preview_url?: string;
}

export interface RatingsConfig {
  enabled: boolean;
  moderated: boolean;
  min_rating?: number;
}

export interface MonetizationConfig {
  model: 'free' | 'freemium' | 'subscription' | 'one-time' | 'usage-based';
  trial_days?: number;
  price_usd?: number;
  revenue_share?: number; // Percentage to developer
}

export interface SupportConfig {
  email?: string;
  documentation?: string;
  issues?: string;
  chat?: string;
}

export interface LocalizationConfig {
  default: string;
  supported: string[];
  strings: Record<string, Record<string, string>>;
  auto_translate?: boolean;
}

export interface VersioningConfig {
  current: string;
  minimum_sdk: string;
  changelog: Record<string, string>;
  migration?: MigrationConfig;
  deprecations?: Deprecation[];
}

export interface MigrationConfig {
  from: string;
  to?: string;
  script: string;
  auto?: boolean;
}

export interface Deprecation {
  feature: string;
  since: string;
  remove: string;
  replacement?: string;
  message?: string;
}

export interface SecurityConfig {
  sandbox?: SandboxConfig;
  secrets?: SecretsConfig;
  network?: NetworkConfig;
  content?: ContentConfig;
}

export interface SandboxConfig {
  enabled: boolean;
  permissions: 'strict' | 'moderate' | 'permissive';
  allowed_apis?: string[];
}

export interface SecretsConfig {
  storage: 'secure-enclave' | 'keychain' | 'env' | 'vault';
  rotation?: string; // Duration
  auto_generate?: boolean;
}

export interface NetworkConfig {
  https_only: boolean;
  cors_origins?: string[];
  rate_limit?: string;
  timeout?: number;
}

export interface ContentConfig {
  sanitize_input: boolean;
  escape_output: boolean;
  max_size?: string;
  allowed_types?: string[];
}

export interface PerformanceConfig {
  timing?: TimingConstraints;
  resources?: ResourceLimits;
  cache?: CacheConfig;
}

export interface TimingConstraints {
  max_gather?: number;
  max_process?: number;
  max_generate?: number;
  total_timeout?: number;
}

export interface ResourceLimits {
  max_memory?: string;
  max_cpu?: string;
  max_network?: string;
  max_storage?: string;
}

export interface CacheConfig {
  enabled: boolean;
  ttl?: number;
  strategy?: 'lru' | 'lfu' | 'ttl' | 'custom';
  size?: string;
}

// Agent base class for TypeScript implementation
export abstract class JottAgent {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly version: string;

  protected context?: CognitiveContext;
  protected permissions: Set<string> = new Set();

  // Lifecycle hooks
  async onLoad(): Promise<void> {}
  async onActivate(trigger: any): Promise<void> {}
  async onDeactivate(): Promise<void> {}
  async onError(error: Error): Promise<void> {}

  // Core methods
  abstract execute(input: any): Promise<JottCard>;
  abstract explain(): Promise<string>;

  // Permission management
  async requestPermission(permission: string): Promise<boolean> {
    // Implementation would show consent UI
    return true;
  }

  hasPermission(permission: string): boolean {
    return this.permissions.has(permission);
  }

  // Privacy compliance
  async exportUserData(): Promise<any> {
    throw new Error('Not implemented');
  }

  async deleteUserData(): Promise<void> {
    throw new Error('Not implemented');
  }

  // Transparency
  protected async withTransparency<T>(
    action: string,
    fn: () => Promise<T>
  ): Promise<T> {
    console.log(`[${this.name}] ${action}`);
    const result = await fn();
    console.log(`[${this.name}] Completed: ${action}`);
    return result;
  }
}

// Agent loader
export class JottLoader {
  static async load(path: string): Promise<JottAgent> {
    // Load and parse .jtt file
    const template = await this.parseJttFile(path);

    // Create agent instance
    return this.createAgent(template);
  }

  private static async parseJttFile(path: string): Promise<JottTemplate> {
    // Implementation would parse YAML/JSON
    throw new Error('Not implemented');
  }

  private static createAgent(template: JottTemplate): JottAgent {
    // Dynamic agent creation
    throw new Error('Not implemented');
  }
}

// Export for module usage
export default JottAgent;