
const OPENWEATHER_KEY = '62bc64d515f8934e1a20f8c23268df81';

export const weatherService = {
  async getCurrentWeather(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=tr`
      );

      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Hava durumu verisi alınamadı:', error);
      return this.getMockWeatherData(lat, lon);
    }
  },

  async getWeatherForecast(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=tr`
      );

      if (!response.ok) {
        throw new Error('Weather forecast fetch failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Hava durumu tahmini alınamadı:', error);
      return null;
    }
  },

  async getWeatherAlerts(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=tr&exclude=minutely,hourly,daily`
      );

      if (!response.ok) {
        throw new Error('Weather alerts fetch failed');
      }

      const data = await response.json();
      return data.alerts || [];
    } catch (error) {
      console.error('Hava durumu uyarıları alınamadı:', error);
      return [];
    }
  },

  getMockWeatherData(lat: number, lon: number) {
    return {
      coord: { lon: lon, lat: lat },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "açık hava",
          icon: "01d"
        }
      ],
      main: {
        temp: 15 + Math.random() * 20,
        feels_like: 15 + Math.random() * 20,
        temp_min: 10 + Math.random() * 15,
        temp_max: 20 + Math.random() * 15,
        pressure: 1013 + Math.random() * 20,
        humidity: 40 + Math.random() * 40
      },
      wind: {
        speed: Math.random() * 10,
        deg: Math.random() * 360
      },
      visibility: 10000,
      name: "Konum"
    };
  },

  getWeatherIcon(iconCode: string) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },

  getWeatherSeverity(weather: any) {
    if (!weather || !weather.weather) return 'low';
    
    const condition = weather.weather[0].main.toLowerCase();
    const windSpeed = weather.wind?.speed || 0;
    
    if (condition.includes('thunderstorm') || windSpeed > 15) return 'high';
    if (condition.includes('rain') || condition.includes('snow') || windSpeed > 10) return 'medium';
    return 'low';
  }
};
