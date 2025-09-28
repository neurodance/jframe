/**
 * Cold-start context detection
 * Captures environmental context without user history
 */

import WeatherContext from './weather-context.js';

export default class ColdStartContext {
  constructor(environment = null, options = {}) {
    this.detectionTime = new Date();
    // Allow injection of environment for testing
    this.env = environment || {
      navigator: typeof navigator !== 'undefined' ? navigator : null,
      window: typeof window !== 'undefined' ? window : null,
      Intl: typeof Intl !== 'undefined' ? Intl : null
    };

    // Optional enhanced context providers
    this.options = {
      includeWeather: options.includeWeather || false,
      weatherApiKey: options.weatherApiKey || null,
      includeNews: options.includeNews || false,
      includeEvents: options.includeEvents || false,
      ...options
    };

    // Initialize weather context if enabled
    if (this.options.includeWeather) {
      this.weatherContext = new WeatherContext(this.options.weatherApiKey);
    }
  }

  /**
   * Detect all available context from the environment
   * @returns {Object} Detected context with confidence scores
   */
  async detect() {
    const temporal = this.detectTemporalContext();
    const environmental = this.detectEnvironmentalContext();
    const location = await this.detectLocationContext();

    const context = {
      temporal,
      environmental,
      location,
      confidence: this.calculateConfidence(temporal, environmental, location),
      detectedAt: this.detectionTime
    };

    // Add enhanced contexts if enabled
    if (this.options.includeWeather && this.weatherContext) {
      if (location.latitude && location.longitude) {
        context.weather = await this.weatherContext.getWeatherContext(
          location.latitude,
          location.longitude,
          location.city
        );
      }
    }

    return context;
  }

  /**
   * Detect temporal context (time-related)
   */
  detectTemporalContext() {
    const now = new Date();
    const hour = now.getHours();
    const dayIndex = now.getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
      currentTime: now,
      timezone: this.detectTimezone(),
      timeOfDay: this.getTimeOfDay(hour),
      dayOfWeek: days[dayIndex],
      isWeekend: dayIndex === 0 || dayIndex === 6,
      hour24: hour,
      hour12: hour % 12 || 12,
      isPM: hour >= 12,
      month: now.toLocaleDateString('en-US', { month: 'long' }),
      date: now.getDate(),
      year: now.getFullYear()
    };
  }

  /**
   * Detect environmental context (browser/device)
   */
  detectEnvironmentalContext() {
    const nav = this.env.navigator;
    const context = {
      language: nav?.language || 'en-US',
      languages: nav?.languages || ['en-US'],
      platform: nav?.platform || 'Unknown',
      userAgent: nav?.userAgent || '',
      deviceType: this.detectDeviceType(),
      prefersDarkMode: this.detectDarkMode(),
      screenSize: this.detectScreenSize(),
      online: nav?.onLine !== undefined ? nav.onLine : true
    };

    return context;
  }

  /**
   * Detect location context using multiple sources
   */
  async detectLocationContext() {
    const location = {
      timezone: this.detectTimezone(),
      locale: this.detectLocale(),
      ip: null,
      country: null,
      region: null,
      city: null,
      latitude: null,
      longitude: null,
      accuracy: null,
      source: 'none'
    };

    // Try IP-based geolocation first (no permission needed)
    try {
      const ipLocation = await this.detectIPLocation();
      if (ipLocation) {
        Object.assign(location, ipLocation);
        location.source = 'ip';
      }
    } catch (e) {
      console.log('IP geolocation failed:', e);
    }

    // Try browser Geolocation API if available (requires permission)
    // We'll only use this if explicitly requested to avoid permission prompts
    if (this.env.window?.navigator?.geolocation && this.requestPreciseLocation) {
      try {
        const geoLocation = await this.detectBrowserGeolocation();
        if (geoLocation) {
          // Browser geolocation is more accurate, so override IP-based data
          location.latitude = geoLocation.latitude;
          location.longitude = geoLocation.longitude;
          location.accuracy = geoLocation.accuracy;
          location.source = 'gps';
        }
      } catch (e) {
        console.log('Browser geolocation failed:', e);
      }
    }

    return location;
  }

  /**
   * Detect location from IP address using free API
   */
  async detectIPLocation() {
    // Using ipapi.co free tier (no API key needed for limited requests)
    try {
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });

      if (!response.ok) {
        throw new Error('IP geolocation API failed');
      }

      const data = await response.json();

      return {
        ip: data.ip,
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        isp: data.org,
        postal: data.postal
      };
    } catch (e) {
      // Fallback to another free API
      try {
        const response = await fetch('https://api.ipify.org?format=json', {
          signal: AbortSignal.timeout(2000)
        });
        const data = await response.json();
        return { ip: data.ip };
      } catch (e2) {
        return null;
      }
    }
  }

  /**
   * Detect precise location using browser Geolocation API
   */
  async detectBrowserGeolocation() {
    return new Promise((resolve, reject) => {
      if (!this.env.window?.navigator?.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      this.env.window.navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: false, // Don't need high accuracy for context
          timeout: 5000,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    });
  }

  /**
   * Detect user's locale settings
   */
  detectLocale() {
    try {
      if (this.env.Intl) {
        const locale = this.env.Intl.DateTimeFormat().resolvedOptions().locale;
        return locale;
      }
    } catch (e) {}
    return this.env.navigator?.language || 'en-US';
  }

  /**
   * Detect timezone
   */
  detectTimezone() {
    try {
      if (this.env.Intl) {
        return this.env.Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
    } catch (e) {}
    return 'UTC';
  }

  /**
   * Get time of day description
   */
  getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Detect device type from user agent
   */
  detectDeviceType() {
    const ua = this.env.navigator?.userAgent?.toLowerCase() || '';

    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    }
    return 'desktop';
  }

  /**
   * Detect dark mode preference
   */
  detectDarkMode() {
    if (this.env.window && this.env.window.matchMedia) {
      return this.env.window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  /**
   * Detect screen size category
   */
  detectScreenSize() {
    if (this.env.window) {
      const width = this.env.window.innerWidth || 1920;

      if (width < 640) return 'small';
      if (width < 1024) return 'medium';
      if (width < 1920) return 'large';
      return 'extra-large';
    }
    return 'unknown';
  }

  /**
   * Calculate confidence scores
   */
  calculateConfidence(temporal, environmental, location) {
    // Simple confidence scoring based on data availability
    let temporalScore = 1.0;
    let environmentalScore = 0.0;
    let locationScore = 0.0;

    // Reduce temporal confidence if timezone detection failed
    if (temporal.timezone === 'UTC' && this.env.Intl) {
      temporalScore = 0.8;
    }

    // Calculate environmental confidence based on available data
    const envChecks = [
      environmental.language !== 'en-US',
      environmental.platform !== 'Unknown',
      environmental.userAgent !== '',
      environmental.deviceType !== 'desktop'
    ];

    environmentalScore = envChecks.filter(Boolean).length / envChecks.length;

    // Calculate location confidence
    if (location) {
      if (location.source === 'gps') {
        locationScore = 1.0; // GPS is most accurate
      } else if (location.source === 'ip') {
        locationScore = location.city ? 0.7 : 0.5; // IP location is less accurate
      } else {
        locationScore = 0.3; // Only timezone available
      }
    }

    return {
      temporal: temporalScore,
      environmental: Math.max(0.5, environmentalScore),
      location: locationScore,
      overall: (temporalScore + environmentalScore + locationScore) / 3
    };
  }

  /**
   * Get contextual greeting based on time of day
   */
  getContextualGreeting() {
    const temporal = this.detectTemporalContext();
    const greetings = {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good night'
    };

    return greetings[temporal.timeOfDay] || 'Hello';
  }

  /**
   * Get relevant suggestions based on context
   */
  async getContextualSuggestions() {
    const temporal = this.detectTemporalContext();
    const location = await this.detectLocationContext();
    const environmental = this.detectEnvironmentalContext();
    const suggestions = [];

    // Time-based suggestions
    if (temporal.timeOfDay === 'morning') {
      suggestions.push({
        type: 'routine',
        text: 'Review today\'s schedule',
        icon: '📅',
        confidence: 0.8
      });

      // Location-aware morning suggestion
      if (location.city) {
        suggestions.push({
          type: 'local',
          text: `Check ${location.city} weather and traffic`,
          icon: '🌤️',
          confidence: 0.75
        });
      }
    }

    if (temporal.isWeekend) {
      suggestions.push({
        type: 'leisure',
        text: 'Weekend planning',
        icon: '🎉',
        confidence: 0.7
      });

      // Location-aware weekend suggestion
      if (location.city) {
        suggestions.push({
          type: 'local',
          text: `Events near ${location.city} this weekend`,
          icon: '📍',
          confidence: 0.65
        });
      }
    } else if (temporal.dayOfWeek === 'Monday') {
      suggestions.push({
        type: 'work',
        text: 'Weekly priorities',
        icon: '💪',
        confidence: 0.75
      });
    } else if (temporal.dayOfWeek === 'Friday') {
      suggestions.push({
        type: 'planning',
        text: 'Week in review',
        icon: '📊',
        confidence: 0.7
      });
    }

    // Evening suggestions
    if (temporal.timeOfDay === 'evening') {
      suggestions.push({
        type: 'reflection',
        text: 'Daily summary',
        icon: '🌅',
        confidence: 0.6
      });
    }

    // Night suggestions
    if (temporal.timeOfDay === 'night') {
      suggestions.push({
        type: 'personal',
        text: 'Tomorrow\'s preparation',
        icon: '🌙',
        confidence: 0.65
      });
    }

    // Mobile-specific suggestions
    if (environmental.deviceType === 'mobile') {
      suggestions.push({
        type: 'quick',
        text: 'Quick voice note',
        icon: '🎤',
        confidence: 0.7
      });
    }

    // Location-based suggestions
    if (location.country && location.city) {
      // Check if traveling (timezone mismatch might indicate travel)
      const browserTimezone = temporal.timezone;
      const ipTimezone = location.timezone;

      if (browserTimezone !== ipTimezone && ipTimezone) {
        suggestions.push({
          type: 'travel',
          text: `Traveling in ${location.city}? Local tips`,
          icon: '✈️',
          confidence: 0.8
        });
      }
    }

    // Sort by confidence
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }
}