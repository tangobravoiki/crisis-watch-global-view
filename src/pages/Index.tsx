import React, { useState, useEffect } from 'react';
import Map from '@/components/Map';
import ControlPanel from '@/components/ControlPanel';
import NewsPanel from '@/components/NewsPanel';
import WeatherPanel from '@/components/WeatherPanel';
import { Plane, Ship, Cloud, Newspaper, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [activeLayer, setActiveLayer] = useState('flights');
  const [mapCenter, setMapCenter] = useState([35.2433, 38.9637]); // Türkiye merkezi
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const layers = [
    { id: 'flights', name: 'Uçak Takibi', icon: Plane, color: 'bg-blue-500' },
    { id: 'ships', name: 'Gemi Takibi', icon: Ship, color: 'bg-cyan-500' },
    { id: 'weather', name: 'Hava Durumu', icon: Cloud, color: 'bg-green-500' },
    { id: 'news', name: 'Haberler', icon: Newspaper, color: 'bg-red-500' },
    { id: 'traffic', name: 'Trafik', icon: MapPin, color: 'bg-orange-500' }
  ];

  useEffect(() => {
    // Simüle edilmiş acil durum alertleri
    const mockAlerts = [
      { id: 1, type: 'flight', message: 'Hava trafiğinde yoğunluk', severity: 'medium' },
      { id: 2, type: 'weather', message: 'Şiddetli rüzgar uyarısı', severity: 'high' },
      { id: 3, type: 'traffic', message: 'Ana arterde trafik sıkışıklığı', severity: 'low' }
    ];
    setAlerts(mockAlerts);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Kriz Takip Merkezi</h1>
            </div>
            <Badge variant="outline" className="text-green-400 border-green-400 bg-black/70">
              Canlı
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={emergencyMode ? "destructive" : "outline"}
              size="sm"
              onClick={() => setEmergencyMode(!emergencyMode)}
              className={`border-white/20 ${emergencyMode ? "text-white" : "text-white bg-black/60 hover:bg-black/80"}`}
            >
              {emergencyMode ? 'Acil Durum AÇIK' : 'Acil Durum KAPALI'}
            </Button>
          </div>
        </div>
      </div>

      {/* Alert Panel */}
      {alerts.length > 0 && (
        <div className="bg-black/40 backdrop-blur-sm p-4 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)} bg-black/60`}>
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-black/40 backdrop-blur border-r border-white/10 p-4 overflow-y-auto">
          {/* Layer Controls */}
          <Card className="mb-4 bg-black/60 border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Katman Kontrolü</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {layers.map((layer) => {
                const IconComponent = layer.icon;
                return (
                  <Button
                    key={layer.id}
                    variant={activeLayer === layer.id ? "default" : "ghost"}
                    className={`w-full justify-start text-white ${
                      activeLayer === layer.id 
                        ? `${layer.color} hover:${layer.color}/80` 
                        : 'hover:bg-white/10'
                    }`}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {layer.name}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Control Panel */}
          <ControlPanel activeLayer={activeLayer} />
          
          {/* Weather Panel */}
          <WeatherPanel />
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative bg-black/70">
          <Map 
            activeLayer={activeLayer} 
            center={mapCenter}
            emergencyMode={emergencyMode}
          />
        </div>

        {/* Right Sidebar - News and Info */}
        <div className="w-80 bg-black/40 backdrop-blur border-l border-white/10 p-4 overflow-y-auto">
          <NewsPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
