/**
 * Privacy Assessment Engine
 * Ethically demonstrates what can be inferred from digital footprints
 */

export default class PrivacyAssessment {
  constructor() {
    this.assessmentId = this.generateId();
    this.startTime = Date.now();
    this.expiryTime = 5 * 60 * 1000; // 5 minutes

    // Track what we've checked (for transparency)
    this.checksPerformed = [];
    this.dataFound = {};
  }

  /**
   * Generate unique assessment ID (for tracking, not storage)
   */
  generateId() {
    return 'assessment_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Create the main Privacy Assessment Jott
   * This is the shareable, well-designed output
   */
  async createPrivacyJott() {
    // Gather all context
    const anonymous = await this.assessAnonymous();

    // Create the Jott card
    const jott = {
      type: "AdaptiveCard",
      version: "1.5",
      speak: "I've analyzed your digital footprint. The results might surprise you.",
      body: [
        {
          type: "Container",
          style: "emphasis",
          items: [
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: "🔍",
                      size: "ExtraLarge"
                    }
                  ]
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: "Your Digital Footprint Analysis",
                      weight: "Bolder",
                      size: "Large",
                      wrap: true
                    },
                    {
                      type: "TextBlock",
                      text: "What the internet knows about you right now",
                      isSubtle: true,
                      wrap: true,
                      size: "Small"
                    }
                  ]
                }
              ]
            }
          ]
        },

        // Privacy Score
        {
          type: "Container",
          separator: true,
          items: [
            {
              type: "TextBlock",
              text: "Privacy Score",
              weight: "Bolder",
              size: "Medium"
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  width: "auto",
                  items: [
                    {
                      type: "TextBlock",
                      text: `${anonymous.privacy_score}`,
                      size: "ExtraLarge",
                      weight: "Bolder",
                      color: this.getScoreColor(anonymous.privacy_score)
                    }
                  ]
                },
                {
                  type: "Column",
                  width: "stretch",
                  items: [
                    {
                      type: "TextBlock",
                      text: "/100",
                      size: "Medium",
                      weight: "Light",
                      spacing: "None"
                    },
                    {
                      type: "TextBlock",
                      text: `Exposure Level: ${anonymous.exposure_level.level}`,
                      color: anonymous.exposure_level.color,
                      weight: "Bolder",
                      size: "Small"
                    }
                  ]
                }
              ]
            }
          ]
        },

        // What We Detected (Without You Telling Us Anything)
        {
          type: "Container",
          separator: true,
          items: [
            {
              type: "TextBlock",
              text: "📍 Location Detection",
              weight: "Bolder",
              size: "Medium"
            },
            ...this.createLocationInsights(anonymous)
          ]
        },

        // Device Fingerprint
        {
          type: "Container",
          separator: true,
          items: [
            {
              type: "TextBlock",
              text: "💻 Device Fingerprint",
              weight: "Bolder",
              size: "Medium"
            },
            ...this.createDeviceInsights(anonymous)
          ]
        },

        // Key Insights
        {
          type: "Container",
          separator: true,
          style: "warning",
          items: [
            {
              type: "TextBlock",
              text: "⚠️ Key Privacy Concerns",
              weight: "Bolder",
              size: "Medium"
            },
            ...this.createPrivacyConcerns(anonymous)
          ]
        },

        // Recommendations
        {
          type: "Container",
          separator: true,
          style: "good",
          items: [
            {
              type: "TextBlock",
              text: "✅ Quick Wins to Improve Your Privacy",
              weight: "Bolder",
              size: "Medium"
            },
            ...this.createRecommendations(anonymous)
          ]
        },

        // Call to Action
        {
          type: "Container",
          separator: true,
          items: [
            {
              type: "TextBlock",
              text: "Want a deeper analysis?",
              weight: "Bolder",
              wrap: true
            },
            {
              type: "TextBlock",
              text: "Jottr.io can show you what else is discoverable with just your email or name - ethically and transparently.",
              wrap: true,
              size: "Small",
              isSubtle: true
            }
          ]
        }
      ],

      // Actions
      actions: [
        {
          type: "Action.OpenUrl",
          title: "📊 Full Privacy Assessment",
          url: "https://jottr.io/privacy-assessment",
          style: "positive"
        },
        {
          type: "Action.OpenUrl",
          title: "🛡️ Privacy Protection Guide",
          url: "https://jottr.io/privacy-guide"
        },
        {
          type: "Action.OpenUrl",
          title: "Share This Assessment",
          url: `https://jottr.io/share?jott=${this.assessmentId}`
        }
      ],

      // Metadata for sharing
      metadata: {
        shareable: true,
        title: "My Privacy Score: " + anonymous.privacy_score + "/100",
        description: "I just discovered what the internet knows about me. Check your own digital footprint!",
        hashtags: ["PrivacyAwareness", "DigitalFootprint", "JottrPrivacy"],
        shareText: this.generateShareText(anonymous)
      }
    };

    return jott;
  }

  /**
   * Create location insights for the Jott
   */
  createLocationInsights(assessment) {
    const location = assessment.checks.find(c => c.category === 'Location')?.found;
    if (!location) return [];

    const insights = [];

    if (location.city) {
      insights.push({
        type: "FactSet",
        facts: [
          {
            title: "City:",
            value: location.city
          },
          {
            title: "Region:",
            value: location.region || "Unknown"
          },
          {
            title: "Country:",
            value: location.country || "Unknown"
          },
          {
            title: "ISP:",
            value: location.isp || "Unknown"
          },
          {
            title: "VPN Status:",
            value: location.vpn ? "✅ Protected" : "❌ Exposed"
          }
        ]
      });
    }

    insights.push({
      type: "TextBlock",
      text: location.vpn ?
        "Good: You're using a VPN to hide your location" :
        "**Risk**: Your real location is visible to every website you visit",
      wrap: true,
      size: "Small",
      color: location.vpn ? "Good" : "Warning"
    });

    return insights;
  }

  /**
   * Create device insights for the Jott
   */
  createDeviceInsights(assessment) {
    const device = assessment.checks.find(c => c.category === 'Device')?.found;
    if (!device) return [];

    const insights = [];

    insights.push({
      type: "FactSet",
      facts: [
        {
          title: "Device:",
          value: `${device.device_type} - ${device.os}`
        },
        {
          title: "Browser:",
          value: device.browser
        },
        {
          title: "Screen:",
          value: `${device.screen.width}×${device.screen.height}`
        },
        {
          title: "Languages:",
          value: device.languages?.join(", ") || device.language
        },
        {
          title: "Uniqueness:",
          value: `${Math.round(device.uniqueness * 100)}%`
        }
      ]
    });

    if (device.uniqueness > 0.7) {
      insights.push({
        type: "TextBlock",
        text: "**Warning**: Your device has a highly unique fingerprint, making you easily trackable",
        wrap: true,
        size: "Small",
        color: "Warning"
      });
    }

    return insights;
  }

  /**
   * Create privacy concerns for the Jott
   */
  createPrivacyConcerns(assessment) {
    const concerns = [];

    assessment.insights.forEach(insight => {
      concerns.push({
        type: "TextBlock",
        text: `• ${insight.message}`,
        wrap: true,
        size: "Small",
        color: insight.severity === 'high' ? 'Attention' : 'Default'
      });
    });

    return concerns;
  }

  /**
   * Create recommendations for the Jott
   */
  createRecommendations(assessment) {
    const recommendations = [];

    assessment.recommendations.slice(0, 3).forEach(rec => {
      recommendations.push({
        type: "Container",
        items: [
          {
            type: "ColumnSet",
            columns: [
              {
                type: "Column",
                width: "auto",
                items: [
                  {
                    type: "TextBlock",
                    text: rec.priority === 'high' ? "🔴" : "🟡",
                    size: "Small"
                  }
                ]
              },
              {
                type: "Column",
                width: "stretch",
                items: [
                  {
                    type: "TextBlock",
                    text: `**${rec.title}**`,
                    wrap: true,
                    size: "Small"
                  },
                  {
                    type: "TextBlock",
                    text: rec.description,
                    wrap: true,
                    size: "Small",
                    isSubtle: true
                  },
                  {
                    type: "TextBlock",
                    text: `Impact: ${rec.impact}`,
                    wrap: true,
                    size: "Small",
                    color: "Good"
                  }
                ]
              }
            ]
          }
        ]
      });
    });

    return recommendations;
  }

  /**
   * Generate shareable text for social media
   */
  generateShareText(assessment) {
    const score = assessment.privacy_score;
    const level = assessment.exposure_level.level;

    let message = `🔍 I just checked my digital footprint with @JottrIO\n\n`;
    message += `Privacy Score: ${score}/100 (${level} exposure)\n\n`;

    if (score < 40) {
      message += `😱 Wow, I had no idea so much was visible online!\n`;
    } else if (score < 70) {
      message += `🤔 Room for improvement in my online privacy.\n`;
    } else {
      message += `💪 Pretty good privacy protection, but always room to improve!\n`;
    }

    message += `\nCheck your own privacy score (it's free & ethical): jottr.io/privacy\n`;
    message += `\n#PrivacyMatters #DigitalFootprint #OnlinePrivacy`;

    return message;
  }

  /**
   * Get color based on privacy score
   */
  getScoreColor(score) {
    if (score >= 80) return "Good";
    if (score >= 60) return "Default";
    if (score >= 40) return "Warning";
    return "Attention";
  }

  /**
   * Level 0: Anonymous visitor assessment
   */
  async assessAnonymous() {
    const assessment = {
      level: 0,
      name: "Anonymous Visitor",
      description: "What we can detect without any information from you",
      checks: []
    };

    // IP-based location
    const location = await this.assessIPLocation();
    assessment.checks.push({
      category: "Location",
      found: location,
      privacy_impact: this.calculateLocationImpact(location),
      education: "Your IP address reveals your approximate location to every website you visit."
    });

    // Device fingerprint
    const device = this.assessDeviceFingerprint();
    assessment.checks.push({
      category: "Device",
      found: device,
      privacy_impact: this.calculateDeviceImpact(device),
      education: "Your device configuration creates a semi-unique fingerprint."
    });

    // Browser configuration
    const browser = this.assessBrowserConfig();
    assessment.checks.push({
      category: "Browser",
      found: browser,
      privacy_impact: this.calculateBrowserImpact(browser),
      education: "Browser settings reveal privacy preferences and technical sophistication."
    });

    // Calculate overall score for this level
    assessment.privacy_score = this.calculateLevelScore(assessment.checks);
    assessment.exposure_level = this.getExposureLevel(assessment.privacy_score);

    // Generate insights
    assessment.insights = this.generateAnonymousInsights(location, device, browser);

    // Recommendations
    assessment.recommendations = this.generateAnonymousRecommendations(assessment);

    return assessment;
  }

  /**
   * Assess IP-based location information
   */
  async assessIPLocation() {
    try {
      // Try primary API
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        const data = await response.json();

        this.checksPerformed.push({
          type: 'ip_location',
          source: 'ipapi.co',
          timestamp: Date.now()
        });

        return {
          ip: this.maskIP(data.ip),
          city: data.city,
          region: data.region,
          country: data.country_name,
          country_code: data.country_code,
          latitude: this.roundCoordinate(data.latitude),
          longitude: this.roundCoordinate(data.longitude),
          timezone: data.timezone,
          isp: data.org,
          postal: data.postal ? data.postal.substring(0, 3) + '**' : null,
          vpn: this.detectVPN(data),
          accuracy: 'city_level'
        };
      }
    } catch (e) {
      console.log('Primary IP location failed, using fallback');
    }

    // Fallback to timezone only
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      accuracy: 'timezone_only'
    };
  }

  /**
   * Assess device fingerprint uniqueness
   */
  assessDeviceFingerprint() {
    const fingerprint = {
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio
      },
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      maxTouchPoints: navigator.maxTouchPoints
    };

    // Calculate uniqueness score
    fingerprint.uniqueness = this.calculateUniqueness(fingerprint);

    // Identify device type and OS
    fingerprint.device_type = this.identifyDeviceType(fingerprint.userAgent);
    fingerprint.os = this.identifyOS(fingerprint.userAgent);
    fingerprint.browser = this.identifyBrowser(fingerprint.userAgent);

    this.checksPerformed.push({
      type: 'device_fingerprint',
      source: 'browser_apis',
      timestamp: Date.now()
    });

    return fingerprint;
  }

  /**
   * Assess browser configuration
   */
  assessBrowserConfig() {
    const config = {
      cookies_enabled: navigator.cookieEnabled,
      do_not_track: navigator.doNotTrack === "1",
      plugins_count: navigator.plugins?.length || 0,
      webgl_vendor: this.getWebGLInfo().vendor,
      webgl_renderer: this.getWebGLInfo().renderer,
      canvas_fingerprint: this.getCanvasFingerprint(),
      ad_blocker: this.detectAdBlocker(),
      privacy_enhanced: false
    };

    // Detect privacy-enhanced browsers
    if (config.do_not_track || config.ad_blocker) {
      config.privacy_enhanced = true;
    }

    // Detect incognito/private mode
    config.private_browsing = this.detectPrivateBrowsing();

    this.checksPerformed.push({
      type: 'browser_config',
      source: 'browser_apis',
      timestamp: Date.now()
    });

    return config;
  }

  /**
   * Calculate privacy impact scores
   */
  calculateLocationImpact(location) {
    if (!location.city) return 'low';
    if (location.vpn) return 'low';
    if (location.latitude) return 'high';
    return 'moderate';
  }

  calculateDeviceImpact(device) {
    if (device.uniqueness > 0.8) return 'high';
    if (device.uniqueness > 0.5) return 'moderate';
    return 'low';
  }

  calculateBrowserImpact(browser) {
    if (browser.privacy_enhanced) return 'low';
    if (!browser.do_not_track) return 'moderate';
    return 'low';
  }

  /**
   * Calculate uniqueness score for fingerprint
   */
  calculateUniqueness(fingerprint) {
    let score = 0;

    // Common configurations get lower scores
    if (fingerprint.screen.width === 1920 && fingerprint.screen.height === 1080) {
      score += 0.1; // Very common resolution
    } else if (fingerprint.screen.width === 1366 && fingerprint.screen.height === 768) {
      score += 0.1; // Common laptop resolution
    } else {
      score += 0.3; // Less common resolution
    }

    // Operating system uniqueness
    if (fingerprint.platform.includes('Win')) {
      score += 0.1; // Windows is common
    } else if (fingerprint.platform.includes('Mac')) {
      score += 0.2; // Mac is less common
    } else {
      score += 0.3; // Linux/other is uncommon
    }

    // Hardware features
    if (fingerprint.hardwareConcurrency > 8) {
      score += 0.2; // High-end hardware
    }

    // Multiple languages configured
    if (fingerprint.languages?.length > 2) {
      score += 0.1;
    }

    return Math.min(score, 1.0); // Cap at 1.0
  }

  /**
   * Calculate privacy score for a level
   */
  calculateLevelScore(checks) {
    let score = 100;

    checks.forEach(check => {
      switch (check.privacy_impact) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'moderate':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Get exposure level from score
   */
  getExposureLevel(score) {
    if (score >= 80) return { level: "MINIMAL", color: "Good" };
    if (score >= 60) return { level: "LOW", color: "Default" };
    if (score >= 40) return { level: "MODERATE", color: "Warning" };
    if (score >= 20) return { level: "HIGH", color: "Warning" };
    return { level: "CRITICAL", color: "Attention" };
  }

  /**
   * Generate insights for anonymous level
   */
  generateAnonymousInsights(location, device, browser) {
    const insights = [];

    if (location.city) {
      insights.push({
        type: 'location',
        message: `Your location is visible down to ${location.city}, ${location.country}`,
        severity: 'moderate'
      });
    }

    if (!location.vpn) {
      insights.push({
        type: 'vpn',
        message: "No VPN detected - your real IP is exposed",
        severity: 'high'
      });
    }

    if (device.uniqueness > 0.7) {
      insights.push({
        type: 'fingerprint',
        message: "Your device has a highly unique fingerprint",
        severity: 'moderate'
      });
    }

    if (!browser.do_not_track) {
      insights.push({
        type: 'tracking',
        message: "Do Not Track is disabled - websites can track you",
        severity: 'low'
      });
    }

    return insights;
  }

  /**
   * Generate recommendations
   */
  generateAnonymousRecommendations(assessment) {
    const recommendations = [];

    if (!assessment.checks.find(c => c.found?.vpn)) {
      recommendations.push({
        priority: 'high',
        title: 'Use a VPN',
        description: 'Hide your real IP address and location',
        impact: '+15 privacy points',
        action: 'Learn about VPNs'
      });
    }

    if (assessment.checks.find(c => c.found?.uniqueness > 0.7)) {
      recommendations.push({
        priority: 'medium',
        title: 'Reduce fingerprint uniqueness',
        description: 'Use common screen resolutions and configurations',
        impact: '+10 privacy points',
        action: 'Browser hardening guide'
      });
    }

    if (!assessment.checks.find(c => c.found?.do_not_track)) {
      recommendations.push({
        priority: 'low',
        title: 'Enable Do Not Track',
        description: 'Signal websites not to track you',
        impact: '+5 privacy points',
        action: 'Browser settings'
      });
    }

    return recommendations;
  }

  /**
   * Helper functions
   */

  maskIP(ip) {
    if (!ip) return null;
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.***.***`;
  }

  roundCoordinate(coord) {
    // Round to city-level precision
    return Math.round(coord * 100) / 100;
  }

  detectVPN(ipData) {
    // Simple VPN detection based on ISP name
    const vpnProviders = ['vpn', 'proxy', 'hosting', 'datacenter', 'cloud'];
    const isp = (ipData.org || '').toLowerCase();
    return vpnProviders.some(provider => isp.includes(provider));
  }

  identifyDeviceType(userAgent) {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  }

  identifyOS(userAgent) {
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/mac/i.test(userAgent)) return 'macOS';
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/android/i.test(userAgent)) return 'Android';
    if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS';
    return 'Unknown';
  }

  identifyBrowser(userAgent) {
    if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return 'Chrome';
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
    if (/edge/i.test(userAgent)) return 'Edge';
    return 'Unknown';
  }

  getWebGLInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return { vendor: 'unknown', renderer: 'unknown' };

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return { vendor: 'hidden', renderer: 'hidden' };

      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown',
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown'
      };
    } catch (e) {
      return { vendor: 'error', renderer: 'error' };
    }
  }

  getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const text = 'JottPrivacy,123';
      ctx.textBaseline = 'top';
      ctx.font = '14px "Arial"';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText(text, 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText(text, 4, 17);

      const dataURL = canvas.toDataURL();
      // Return hash of the image
      return this.simpleHash(dataURL);
    } catch (e) {
      return 'canvas_blocked';
    }
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  detectAdBlocker() {
    // Simple ad blocker detection
    // In production, would use more sophisticated methods
    return false;
  }

  detectPrivateBrowsing() {
    // Detect private/incognito mode
    // Various methods depending on browser
    return false;
  }

  /**
   * Clear all assessment data (privacy by design)
   */
  clearAssessment() {
    this.checksPerformed = [];
    this.dataFound = {};

    // Return confirmation
    return {
      cleared: true,
      message: "All assessment data has been deleted",
      timestamp: Date.now()
    };
  }
}