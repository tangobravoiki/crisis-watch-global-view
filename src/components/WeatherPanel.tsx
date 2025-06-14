import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, Wind, Droplets, Thermometer, Eye, Gauge } from 'lucide-react';
import { weatherService } from '@/services/weatherService';

const WeatherPanel = () => {
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 41.0082, lon: 28.9784, name: 'İstanbul' });

  const locations = [
    { lat: 41.0082, lon: 28.9784, name: 'İstanbul' },
    { lat: 39.9334, lon: 32.8597, name: 'Ankara' },
    { lat: 38.4192, lon: 27.1287, name: 'İzmir' },
    { lat: 36.8969, lon: 30.7133, name: 'Antalya' }
  ];

  useEffect(() => {
    loadWeatherData();
  }, [selectedLocation]);

  const loadWeatherData = async () => {
    setLoading(true);
    try {
      const [weatherData, weatherAlerts] = await Promise.all([
        weatherService.getCurrentWeather(selectedLocation.lat, selectedLocation.lon),
        weatherService.getWeatherAlerts(selectedLocation.lat, selectedLocation.lon)
      ]);
      
      setWeather(weatherData);
      setAlerts(weatherAlerts.slice(0, 3));
    } catch (error) {
      console.error('Hava durumu yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherSeverity = () => {
    if (!weather) return 'low';
    return weatherService.getWeatherSeverity(weather);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <Card className="bg-black/70 border-white/20 text-white">
        <CardHeader>
          <CardTitle>Hava Durumu</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/70 border-white/20 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Hava Durumu</span>
          <Badge className={getSeverityColor(getWeatherSeverity())}>
            {getWeatherSeverity() === 'high' ? 'Uyarı' : 
             getWeatherSeverity() === 'medium' ? 'Dikkat' : 'Normal'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Konum Seçici */}
        <div className="flex flex-wrap gap-1">
          {locations.map((location) => (
            <Button
              key={location.name}
              variant={selectedLocation.name === location.name ? 'default' : 'ghost'}
              size="sm"
              className={`text-xs px-2 py-1 ${selectedLocation.name !== location.name ? "text-white bg-black/40" : ""}`}
              onClick={() => setSelectedLocation(location)}
            >
              {location.name}
            </Button>
          ))}
        </div>

        {weather && (
          <>
            {/* Ana Hava Durumu */}
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {weather.weather?.[0]?.icon && (
                  <img
                    src={weatherService.getWeatherIcon(weather.weather[0].icon)}
                    alt={weather.weather[0].description}
                    className="w-16 h-16"
                  />
                )}
              </div>
              <div className="text-3xl font-bold mb-1 text-black">
                {Math.round(weather.main?.temp || 0)}°C
              </div>
              <div className="text-sm text-gray-800 capitalize">
                {weather.weather?.[0]?.description || 'Bilgi yok'}
              </div>
              <div className="text-xs text-gray-700 mt-1">
                Hissedilen: {Math.round(weather.main?.feels_like || 0)}°C
              </div>
            </div>

            {/* Detaylar */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                <Wind className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs text-gray-300">Rüzgar</div>
                  <div className="text-sm font-medium">
                    {Math.round((weather.wind?.speed || 0) * 3.6)} km/h
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs text-gray-300">Nem</div>
                  <div className="text-sm font-medium">{weather.main?.humidity || 0}%</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                <Gauge className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-xs text-gray-300">Basınç</div>
                  <div className="text-sm font-medium">{weather.main?.pressure || 0} hPa</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                <Eye className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs text-gray-300">Görüş</div>
                  <div className="text-sm font-medium">
                    {Math.round((weather.visibility || 0) / 1000)} km
                  </div>
                </div>
              </div>
            </div>

            {/* Min/Max Sıcaklık */}
            <div className="flex justify-between p-3 bg-white/5 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-gray-300">Minimum</div>
                <div className="text-lg font-semibold text-blue-400">
                  {Math.round(weather.main?.temp_min || 0)}°
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-300">Maksimum</div>
                <div className="text-lg font-semibold text-red-400">
                  {Math.round(weather.main?.temp_max || 0)}°
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hava Durumu Uyarıları */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Cloud className="w-4 h-4 mr-2" />
              Uyarılar
            </h4>
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="p-2 bg-red-500/20 border border-red-500/30 rounded text-sm"
              >
                <div className="font-medium">{alert.event}</div>
                <div className="text-xs text-gray-300 mt-1">
                  {alert.description?.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Güncelleme Butonu */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-white border-white/20 bg-black/60"
          onClick={loadWeatherData}
          disabled={loading}
        >
          <Cloud className="w-4 h-4 mr-2" />
          {loading ? 'Güncelleniyor...' : 'Güncelle'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeatherPanel;
