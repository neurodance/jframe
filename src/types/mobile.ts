/**
 * Mobile capture and media-related type definitions
 * For micro-video Jotts and camera/mic features
 */

import type { JottCard, MediaConfig } from './index';

// Mobile capture configuration
export interface CaptureConfig {
  video: VideoCaptureConfig;
  audio: AudioCaptureConfig;
  camera: CameraCaptureConfig;
}

// Video capture (for <10 second micro-videos)
export interface VideoCaptureConfig {
  maxDuration: number; // Default: 10 seconds
  resolution: VideoResolution;
  facingMode: 'user' | 'environment';
  frameRate: number;
  bitrate?: number;
  autoTranscribe: boolean;
  extractKeyFrames: boolean;
  aiSummarize: boolean;
}

export interface VideoResolution {
  width: number;
  height: number;
}

export const VIDEO_PRESETS = {
  mobile: { width: 480, height: 854 },  // 9:16 vertical
  square: { width: 720, height: 720 },  // 1:1 square
  landscape: { width: 1280, height: 720 } // 16:9 horizontal
} as const;

// Audio capture (for voice narration)
export interface AudioCaptureConfig {
  maxDuration: number; // Default: 30 seconds
  sampleRate: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  voiceToText: boolean;
  structureContent: boolean;
  generateHeadlines: boolean;
}

// Camera capture (for photos/documents)
export interface CameraCaptureConfig {
  documentMode: boolean;
  whiteboardMode: boolean;
  annotationTools: boolean;
  ocrEnabled: boolean;
  autoEnhance: boolean;
}

// Media capture result
export interface CaptureResult {
  type: 'video' | 'audio' | 'image';
  blob: Blob;
  duration?: number; // For video/audio
  thumbnail?: string; // Base64 for video
  metadata: CaptureMetadata;
  transcription?: Transcription;
  analysis?: MediaAnalysis;
}

export interface CaptureMetadata {
  timestamp: Date;
  device: string;
  orientation?: 'portrait' | 'landscape';
  location?: GeolocationCoordinates;
  fileSize: number;
  mimeType: string;
}

// Transcription for audio/video
export interface Transcription {
  text: string;
  language: string;
  confidence: number;
  segments?: TranscriptionSegment[];
  keywords?: string[];
}

export interface TranscriptionSegment {
  text: string;
  start: number; // Seconds
  end: number;
  confidence: number;
  speaker?: string;
}

// AI-powered media analysis
export interface MediaAnalysis {
  summary: string;
  keyPoints: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  topics?: string[];
  objects?: DetectedObject[]; // For images/video
  faces?: DetectedFace[]; // Privacy-aware
  text?: ExtractedText[]; // OCR results
}

export interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

export interface DetectedFace {
  id: string; // Anonymous ID
  emotions?: Record<string, number>;
  age?: number;
  boundingBox?: BoundingBox;
}

export interface ExtractedText {
  text: string;
  confidence: number;
  language?: string;
  boundingBox?: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Media processor interface
export interface MediaProcessor {
  processVideo(blob: Blob, config: VideoCaptureConfig): Promise<ProcessedVideo>;
  processAudio(blob: Blob, config: AudioCaptureConfig): Promise<ProcessedAudio>;
  processImage(blob: Blob, config: CameraCaptureConfig): Promise<ProcessedImage>;
}

export interface ProcessedVideo {
  compressed: Blob;
  thumbnail: string;
  duration: number;
  keyFrames: string[]; // Base64 images
  transcription?: Transcription;
  jottCard: JottCard;
}

export interface ProcessedAudio {
  compressed: Blob;
  duration: number;
  waveform: number[]; // For visualization
  transcription: Transcription;
  jottCard: JottCard;
}

export interface ProcessedImage {
  optimized: Blob;
  thumbnail: string;
  text?: ExtractedText[];
  objects?: DetectedObject[];
  jottCard: JottCard;
}

// WebRTC/MediaStream interfaces
export interface StreamManager {
  getVideoStream(config: VideoCaptureConfig): Promise<MediaStream>;
  getAudioStream(config: AudioCaptureConfig): Promise<MediaStream>;
  getCameraStream(config: CameraCaptureConfig): Promise<MediaStream>;
  stopStream(stream: MediaStream): void;
  switchCamera(stream: MediaStream): Promise<MediaStream>;
}

// Recording interfaces
export interface Recorder {
  start(stream: MediaStream, options?: RecorderOptions): void;
  pause(): void;
  resume(): void;
  stop(): Promise<Blob>;
  getState(): RecorderState;
}

export interface RecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  bitsPerSecond?: number;
}

export type RecorderState = 'inactive' | 'recording' | 'paused';

// Mobile UI components
export interface CaptureUI {
  showVideoCapture(config: VideoCaptureConfig): Promise<CaptureResult>;
  showAudioCapture(config: AudioCaptureConfig): Promise<CaptureResult>;
  showCameraCapture(config: CameraCaptureConfig): Promise<CaptureResult>;
  showEditor(result: CaptureResult): Promise<CaptureResult>;
}

// Permissions
export interface PermissionManager {
  requestCamera(): Promise<PermissionState>;
  requestMicrophone(): Promise<PermissionState>;
  requestLocation(): Promise<PermissionState>;
  checkPermission(name: PermissionName): Promise<PermissionState>;
}

// Device capabilities
export interface DeviceCapabilities {
  hasCamera: boolean;
  hasMicrophone: boolean;
  cameras: CameraInfo[];
  microphones: MicrophoneInfo[];
  supportedVideoFormats: string[];
  supportedAudioFormats: string[];
  maxVideoResolution: VideoResolution;
}

export interface CameraInfo {
  deviceId: string;
  label: string;
  facingMode?: 'user' | 'environment';
  capabilities?: MediaTrackCapabilities;
}

export interface MicrophoneInfo {
  deviceId: string;
  label: string;
  capabilities?: MediaTrackCapabilities;
}

// Export as namespace
export as namespace JFrameMobile;