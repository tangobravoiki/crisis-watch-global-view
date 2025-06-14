
import React, { useState, useEffect } from 'react';
import Map from '@/components/Map';
import ControlPanel from '@/components/ControlPanel';
import NewsPanel from '@/components/NewsPanel';
import WeatherPanel from '@/components/WeatherPanel';
import Header from '@/components/Header';
import LayerControls from '@/components/LayerControls';
import ApiTestPanels from '@/components/ApiTestPanels';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  const [activeLayer, setActiveLayer] = useState('flights');
  const [mapCenter, setMapCenter] = useState([35.2433, 38.9637]); // Türkiye merkezi
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Alert panel disabled: API ve mock verisi yasaklandığı için burası boş bırakıldı
    setAlerts([]);
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
      <Header emergencyMode={emergencyMode} setEmergencyMode={setEmergencyMode} />

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
          <LayerControls activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
          <ControlPanel activeLayer={activeLayer} />
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

      <ApiTestPanels />
    </div>
  );
};

export default Index;
