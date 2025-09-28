/**
 * Cognitive companion and mind-reading type definitions
 * For the revolutionary blue ocean Jott experience
 */

import type { JottCard, JottType } from './index';

// Cognitive context for mind-reading
export interface CognitiveContext {
  temporal: TemporalContext;
  behavioral: BehavioralContext;
  environmental: EnvironmentalContext;
  relational: RelationalContext;
  cognitive: CognitiveState;
}

export interface TemporalContext {
  timestamp: Date;
  timeOfDay: 'early_morning' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  weekOfMonth: 1 | 2 | 3 | 4 | 5;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  deadline?: DeadlineProximity;
  businessHours: boolean;
  timezone: string;
}

export interface DeadlineProximity {
  task: string;
  due: Date;
  urgency: 'overdue' | 'today' | 'tomorrow' | 'this_week' | 'next_week' | 'future';
}

export interface BehavioralContext {
  recentTopics: Topic[];
  communicationPatterns: CommunicationPattern[];
  workingOn: Project[];
  frequentContacts: Person[];
  activityLevel: 'idle' | 'low' | 'moderate' | 'high' | 'intense';
  lastActions: UserAction[];
}

export interface Topic {
  name: string;
  frequency: number;
  lastMentioned: Date;
  relatedPeople: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface CommunicationPattern {
  recipient: string;
  frequency: 'rare' | 'occasional' | 'regular' | 'frequent' | 'constant';
  topics: string[];
  preferredStyle: 'formal' | 'casual' | 'technical' | 'brief';
  bestTimes: TimeWindow[];
}

export interface TimeWindow {
  day?: string;
  startHour: number;
  endHour: number;
}

export interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'blocked' | 'review' | 'completed';
  team: string[];
  lastActivity: Date;
  nextMilestone?: Date;
}

export interface EnvironmentalContext {
  location: Location;
  device: Device;
  connectivity: 'offline' | 'slow' | 'normal' | 'fast';
  noiseLevel: 'silent' | 'quiet' | 'moderate' | 'loud';
  motion: 'stationary' | 'walking' | 'running' | 'driving' | 'transit';
  batteryLevel?: number;
  notifications: NotificationState;
}

export interface Location {
  type: 'home' | 'office' | 'transit' | 'public' | 'unknown';
  coordinates?: GeolocationCoordinates;
  timezone: string;
  country?: string;
}

export interface Device {
  type: 'desktop' | 'laptop' | 'tablet' | 'phone' | 'watch' | 'smart_speaker';
  os: 'windows' | 'macos' | 'ios' | 'android' | 'linux';
  screenSize: 'small' | 'medium' | 'large';
  inputMethods: InputMethod[];
}

export type InputMethod = 'keyboard' | 'mouse' | 'touch' | 'voice' | 'stylus';

export interface NotificationState {
  doNotDisturb: boolean;
  focusMode?: string;
  allowedApps: string[];
}

export interface RelationalContext {
  recipient?: Person;
  relationship?: RelationshipType;
  lastInteraction?: Interaction;
  sharedContext: SharedContext[];
  communicationHistory: Message[];
}

export interface Person {
  id: string;
  name: string;
  role?: string;
  company?: string;
  email?: string;
  preferences: RecipientPreferences;
  timezone?: string;
}

export interface RecipientPreferences {
  communicationStyle: 'visual' | 'analytical' | 'narrative' | 'executive';
  preferredLength: 'micro' | 'brief' | 'detailed' | 'comprehensive';
  bestTimes: TimeWindow[];
  topics: string[];
}

export interface RelationshipType {
  category: 'personal' | 'professional' | 'client' | 'vendor';
  level: 'acquaintance' | 'colleague' | 'friend' | 'close';
  formality: 'very_formal' | 'formal' | 'neutral' | 'casual' | 'very_casual';
  authority: 'superior' | 'peer' | 'subordinate' | 'external';
}

export interface Interaction {
  date: Date;
  type: 'email' | 'chat' | 'call' | 'meeting' | 'jott';
  topic: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  followUp?: string;
}

export interface SharedContext {
  type: 'project' | 'document' | 'decision' | 'promise' | 'joke';
  content: string;
  date: Date;
  relevance: number; // 0-1
}

export interface Message {
  id: string;
  date: Date;
  from: string;
  to: string;
  content: string;
  jott?: JottCard;
}

export interface CognitiveState {
  attention: AttentionState;
  mood?: MoodState;
  energy: EnergyLevel;
  stress: StressLevel;
  focus: FocusLevel;
}

export interface AttentionState {
  available: number; // seconds
  quality: 'scattered' | 'partial' | 'moderate' | 'focused' | 'deep';
  interruptions: number;
  taskSwitches: number;
}

export interface MoodState {
  valence: number; // -1 to 1 (negative to positive)
  arousal: number; // 0 to 1 (calm to excited)
  confidence: number; // 0 to 1
}

export type EnergyLevel = 'exhausted' | 'low' | 'moderate' | 'high' | 'peak';
export type StressLevel = 'relaxed' | 'normal' | 'moderate' | 'high' | 'overwhelmed';
export type FocusLevel = 'distracted' | 'partial' | 'moderate' | 'focused' | 'flow';

// Intent inference
export interface JottIntent {
  type: IntentType;
  confidence: number; // 0-1
  parameters: IntentParameters;
  alternatives: JottIntent[];
}

export type IntentType =
  | 'status_update'
  | 'question'
  | 'reminder'
  | 'summary'
  | 'announcement'
  | 'request'
  | 'response'
  | 'brainstorm'
  | 'decision'
  | 'schedule'
  | 'thank'
  | 'apologize'
  | 'celebrate'
  | 'document'
  | 'share';

export interface IntentParameters {
  urgency: 'low' | 'normal' | 'high' | 'critical';
  audience: 'self' | 'individual' | 'team' | 'organization' | 'public';
  tone: 'formal' | 'neutral' | 'casual' | 'friendly' | 'urgent';
  length: 'micro' | 'brief' | 'standard' | 'detailed';
  action?: 'inform' | 'request' | 'confirm' | 'decide';
}

// Voice interaction
export interface VoiceCommand {
  raw: string;
  normalized: string;
  intent: VoiceIntent;
  entities: VoiceEntity[];
  confidence: number;
}

export interface VoiceIntent {
  action: 'create' | 'send' | 'read' | 'update' | 'delete' | 'search';
  target: 'jott' | 'message' | 'reminder' | 'note';
}

export interface VoiceEntity {
  type: 'person' | 'time' | 'topic' | 'action' | 'location';
  value: string;
  position: [number, number]; // start, end in raw text
}

// Prediction engine
export interface PredictiveJott {
  trigger: TriggerCondition;
  jott: JottCard;
  confidence: number;
  reasoning: string;
  alternatives: JottCard[];
}

export interface TriggerCondition {
  type: 'time' | 'event' | 'pattern' | 'context';
  description: string;
  conditions: Condition[];
}

export interface Condition {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
}

// Cognitive thread management
export interface CognitiveThread {
  id: string;
  topic: string;
  participants: Person[];
  startDate: Date;
  lastActivity: Date;
  status: 'active' | 'paused' | 'waiting' | 'completed';
  history: JottCard[];
  context: SharedContext[];
  nextActions: Action[];
}

export interface Action {
  type: 'follow_up' | 'decision' | 'review' | 'create' | 'share';
  description: string;
  due?: Date;
  assigned?: Person;
  completed: boolean;
}

// Attention guardian
export interface DeliveryDecision {
  deliver: boolean;
  timing: DeliveryTiming;
  format: 'micro' | 'standard' | 'full';
  channel: DeliveryChannel;
  reasoning: string;
}

export interface DeliveryTiming {
  when: 'now' | 'next_break' | 'end_of_task' | 'scheduled';
  time?: Date;
  batch?: boolean;
}

export type DeliveryChannel = 'notification' | 'email' | 'chat' | 'voice' | 'ambient';

// Mind-reading service
export interface MindReader {
  analyzeContext(): Promise<CognitiveContext>;
  inferIntent(context: CognitiveContext): Promise<JottIntent>;
  predictNeeds(context: CognitiveContext): Promise<PredictiveJott[]>;
  suggestContent(intent: JottIntent): Promise<JottCard>;
  optimizeDelivery(jott: JottCard, context: CognitiveContext): Promise<DeliveryDecision>;
}

// User action tracking
export interface UserAction {
  timestamp: Date;
  type: 'click' | 'type' | 'speak' | 'navigate' | 'copy' | 'paste';
  target: string;
  value?: string;
  context?: Record<string, any>;
}

// Export as namespace
export as namespace JFrameCognitive;