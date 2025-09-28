/**
 * Weather context detection
 * Adds real-time weather and forecast to cold-start context
 */

export default class WeatherContext {
  constructor(apiKey = null) {
    // Use free tier APIs that don't require keys for demo
    this.apiKey = apiKey;
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  /**
   * Get weather context for a location
   */
  async getWeatherContext(latitude, longitude, city) {
    // Check cache first
    const cacheKey = `${latitude},${longitude}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Try multiple weather APIs with fallbacks
      let weatherData = null;

      // Option 1: Open-Meteo (no API key needed!)
      try {
        weatherData = await this.getOpenMeteoWeather(latitude, longitude);
      } catch (e) {
        console.log('Open-Meteo failed, trying fallback...');
      }

      // Option 2: WeatherAPI free tier (requires key)
      if (!weatherData && this.apiKey) {
        weatherData = await this.getWeatherAPI(latitude, longitude);
      }

      // Option 3: Basic weather from IP location service
      if (!weatherData) {
        weatherData = await this.getIPWeather(city);
      }

      if (weatherData) {
        // Add contextual insights
        weatherData.insights = this.generateWeatherInsights(weatherData);
        weatherData.suggestions = this.generateWeatherSuggestions(weatherData);

        // Cache the result
        this.setCache(cacheKey, weatherData);
      }

      return weatherData || this.getDefaultWeather();
    } catch (error) {
      console.error('Weather detection failed:', error);
      return this.getDefaultWeather();
    }
  }

  /**
   * Open-Meteo API (completely free, no key needed)
   */
  async getOpenMeteoWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&hourly=temperature_2m,precipitation_probability,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch` +
      `&timezone=auto&forecast_days=3`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) throw new Error('Open-Meteo API failed');

    const data = await response.json();

    return {
      current: {
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        condition: this.getConditionFromCode(data.current.weather_code),
        icon: this.getWeatherIcon(data.current.weather_code)
      },
      hourly: this.processHourlyForecast(data.hourly),
      daily: this.processDailyForecast(data.daily),
      alerts: this.detectWeatherAlerts(data),
      source: 'open-meteo'
    };
  }

  /**
   * Process hourly forecast for relevant insights
   */
  processHourlyForecast(hourly) {
    const next12Hours = [];
    const now = new Date().getHours();

    for (let i = 0; i < 12 && i < hourly.time.length; i++) {
      const hour = new Date(hourly.time[i]);
      next12Hours.push({
        time: hour.getHours(),
        temperature: Math.round(hourly.temperature_2m[i]),
        precipitationChance: hourly.precipitation_probability[i],
        condition: this.getConditionFromCode(hourly.weather_code[i])
      });
    }

    return next12Hours;
  }

  /**
   * Process daily forecast
   */
  processDailyForecast(daily) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return daily.time.slice(0, 3).map((date, index) => {
      const d = new Date(date);
      return {
        day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : days[d.getDay()],
        high: Math.round(daily.temperature_2m_max[index]),
        low: Math.round(daily.temperature_2m_min[index]),
        precipitationChance: daily.precipitation_probability_max[index],
        precipitation: daily.precipitation_sum[index],
        condition: this.getConditionFromCode(daily.weather_code[index])
      };
    });
  }

  /**
   * Detect weather alerts from forecast data
   */
  detectWeatherAlerts(data) {
    const alerts = [];
    const hourly = data.hourly;

    // Check for rain in next few hours
    for (let i = 0; i < Math.min(6, hourly.time.length); i++) {
      if (hourly.precipitation_probability[i] > 60 && alerts.length === 0) {
        const timeUntil = i === 0 ? 'now' : `in ${i} hour${i > 1 ? 's' : ''}`;
        alerts.push({
          type: 'precipitation',
          severity: hourly.precipitation_probability[i] > 80 ? 'high' : 'moderate',
          message: `☔ Rain likely ${timeUntil} (${hourly.precipitation_probability[i]}% chance)`,
          timing: timeUntil,
          action: 'Grab an umbrella'
        });
        break;
      }
    }

    // Check for temperature extremes
    const currentTemp = data.current.temperature_2m;
    if (currentTemp > 90) {
      alerts.push({
        type: 'heat',
        severity: currentTemp > 100 ? 'high' : 'moderate',
        message: `🌡️ High temperature (${Math.round(currentTemp)}°F)`,
        action: 'Stay hydrated, seek shade'
      });
    } else if (currentTemp < 32) {
      alerts.push({
        type: 'cold',
        severity: currentTemp < 20 ? 'high' : 'moderate',
        message: `❄️ Freezing conditions (${Math.round(currentTemp)}°F)`,
        action: 'Dress warmly, watch for ice'
      });
    }

    // Check for high winds
    if (data.current.wind_speed_10m > 25) {
      alerts.push({
        type: 'wind',
        severity: data.current.wind_speed_10m > 40 ? 'high' : 'moderate',
        message: `💨 Strong winds (${Math.round(data.current.wind_speed_10m)} mph)`,
        action: 'Secure loose items'
      });
    }

    return alerts;
  }

  /**
   * Generate contextual insights from weather
   */
  generateWeatherInsights(weather) {
    const insights = [];
    const temp = weather.current.temperature;
    const condition = weather.current.condition;

    // Temperature-based insights
    if (temp >= 70 && temp <= 80 && condition === 'clear') {
      insights.push("☀️ Perfect weather for outdoor activities!");
    } else if (temp > 85) {
      insights.push("🌡️ Hot day - stay cool and hydrated");
    } else if (temp < 40) {
      insights.push("🧥 Bundle up - it's cold outside");
    }

    // Condition-based insights
    if (condition.includes('rain')) {
      insights.push("☔ Don't forget your umbrella");
    } else if (condition === 'clear' && weather.current.humidity < 40) {
      insights.push("🌤️ Clear and dry - great visibility today");
    }

    // Hourly insights
    const upcomingRain = weather.hourly?.find(h => h.precipitationChance > 60);
    if (upcomingRain && !condition.includes('rain')) {
      insights.push(`🌧️ Rain expected around ${upcomingRain.time}:00`);
    }

    return insights;
  }

  /**
   * Generate weather-based activity suggestions
   */
  generateWeatherSuggestions(weather) {
    const suggestions = [];
    const temp = weather.current.temperature;
    const condition = weather.current.condition;
    const hour = new Date().getHours();

    // Perfect weather suggestions
    if (temp >= 65 && temp <= 78 && condition === 'clear') {
      if (hour < 10) {
        suggestions.push({
          text: "Perfect morning for a run or walk",
          icon: "🏃",
          confidence: 0.9
        });
      } else if (hour >= 11 && hour <= 14) {
        suggestions.push({
          text: "Ideal weather for outdoor lunch",
          icon: "🍽️",
          confidence: 0.85
        });
      } else if (hour >= 15 && hour <= 19) {
        suggestions.push({
          text: "Great time for outdoor happy hour",
          icon: "🍻",
          confidence: 0.8
        });
      }
    }

    // Rain suggestions
    if (condition.includes('rain') || weather.alerts?.some(a => a.type === 'precipitation')) {
      suggestions.push({
        text: "Indoor activities recommended",
        icon: "🏠",
        confidence: 0.9
      });
      suggestions.push({
        text: "Check movie times nearby",
        icon: "🎬",
        confidence: 0.7
      });
    }

    // Hot weather suggestions
    if (temp > 85) {
      suggestions.push({
        text: "Find air-conditioned venues",
        icon: "❄️",
        confidence: 0.85
      });
      if (hour >= 11 && hour <= 16) {
        suggestions.push({
          text: "Avoid strenuous outdoor activities",
          icon: "⚠️",
          confidence: 0.9
        });
      }
    }

    // Cold weather suggestions
    if (temp < 40) {
      suggestions.push({
        text: "Warm drinks at nearby cafes",
        icon: "☕",
        confidence: 0.8
      });
    }

    return suggestions;
  }

  /**
   * Convert weather code to readable condition
   */
  getConditionFromCode(code) {
    const conditions = {
      0: 'clear',
      1: 'mostly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'foggy',
      48: 'foggy',
      51: 'light drizzle',
      53: 'drizzle',
      55: 'heavy drizzle',
      61: 'light rain',
      63: 'rain',
      65: 'heavy rain',
      71: 'light snow',
      73: 'snow',
      75: 'heavy snow',
      77: 'snow grains',
      80: 'light showers',
      81: 'showers',
      82: 'heavy showers',
      85: 'light snow showers',
      86: 'snow showers',
      95: 'thunderstorm',
      96: 'thunderstorm with hail',
      99: 'thunderstorm with heavy hail'
    };

    return conditions[code] || 'unknown';
  }

  /**
   * Get weather icon for condition
   */
  getWeatherIcon(code) {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌡️';
  }

  /**
   * Simple IP-based weather (fallback)
   */
  async getIPWeather(city) {
    if (!city) return null;

    try {
      // Use wttr.in for simple weather (no API key needed)
      const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
        signal: AbortSignal.timeout(3000)
      });

      if (!response.ok) throw new Error('wttr.in failed');

      const data = await response.json();
      const current = data.current_condition[0];

      return {
        current: {
          temperature: parseInt(current.temp_F),
          feelsLike: parseInt(current.FeelsLikeF),
          humidity: parseInt(current.humidity),
          windSpeed: parseInt(current.windspeedMiles),
          condition: current.weatherDesc[0].value.toLowerCase(),
          icon: '🌡️'
        },
        source: 'wttr.in'
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Default weather when APIs fail
   */
  getDefaultWeather() {
    return {
      current: {
        temperature: null,
        condition: 'unknown',
        icon: '🌡️'
      },
      insights: ['Weather data temporarily unavailable'],
      suggestions: [],
      source: 'none'
    };
  }

  /**
   * Cache management
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}