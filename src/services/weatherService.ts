
const OPENWEATHER_KEY = '62bc64d515f8934e1a20f8c23268df81';

export const weatherService = {
  async getCurrentWeather(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=tr`
      );

      if (!response.ok) {
        console.error('OpenWeatherMap API hatası:', response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Hava durumu verisi alınamadı:', error);
      return null;
    }
  },

  async getWeatherForecast(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=tr`
      );

      if (!response.ok) {
        console.error('Weather forecast API hatası:', response.status);
        return null;
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
        console.error('Weather alerts API hatası:', response.status);
        return [];
      }

      const data = await response.json();
      return data.alerts || [];
    } catch (error) {
      console.error('Hava durumu uyarıları alınamadı:', error);
      return [];
    }
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
