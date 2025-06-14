import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Play, Pause } from 'lucide-react';

const ControlPanel = ({ activeLayer }) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState([30]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    let interval;
    if (autoRefresh && isPlaying) {
      interval = setInterval(() => {
        setLastUpdate(new Date());
        // Burada veri güncellemesi yapılacak
        console.log(`${activeLayer} verisi güncelleniyor...`);
      }, refreshInterval[0] * 1000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, isPlaying, refreshInterval, activeLayer]);

  const handleManualRefresh = () => {
    setLastUpdate(new Date());
    console.log(`${activeLayer} verisi manuel olarak güncellendi`);
  };

  const getLayerInfo = () => {
    switch (activeLayer) {
      case 'flights':
        return {
          title: 'Uçak Takibi',
          description: 'Gerçek zamanlı uçak pozisyonları',
          stats: { active: 127, total: 450 }
        };
      case 'ships':
        return {
          title: 'Gemi Takibi',
          description: 'Deniz trafiği ve gemi pozisyonları',
          stats: { active: 89, total: 320 }
        };
      case 'vessel-control':
        return {
          title: 'Gemi Kontrolü',
          description: 'Gemi operasyon kontrolü ve yönetimi',
          stats: { active: 15, total: 50 }
        };
      case 'weather':
        return {
          title: 'Hava Durumu',
          description: 'Meteorolojik veriler ve uyarılar',
          stats: { active: 12, total: 25 }
        };
      case 'traffic':
        return {
          title: 'Trafik Durumu',
          description: 'Karayolu trafik yoğunluğu',
          stats: { active: 45, total: 120 }
        };
      case 'news':
        return {
          title: 'Haber Takibi',
          description: 'Güncel haberler ve kriz bildirimleri',
          stats: { active: 23, total: 100 }
        };
      default:
        return {
          title: 'Veri Katmanı',
          description: 'Katman bilgisi',
          stats: { active: 0, total: 0 }
        };
    }
  };

  const layerInfo = getLayerInfo();

  return (
    <Card className="bg-black/70 border-white/20 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{layerInfo.title}</span>
          <Badge variant="outline" className="text-green-400 border-green-400">
            Aktif
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-300">{layerInfo.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* İstatistikler */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/10 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{layerInfo.stats.active}</div>
            <div className="text-xs text-gray-300">Aktif</div>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{layerInfo.stats.total}</div>
            <div className="text-xs text-gray-300">Toplam</div>
          </div>
        </div>

        {/* Kontroller */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Otomatik Güncelleme</span>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>

          {autoRefresh && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Güncelleme Aralığı</span>
                <span className="text-sm text-gray-300">{refreshInterval[0]}s</span>
              </div>
              <Slider
                value={refreshInterval}
                onValueChange={setRefreshInterval}
                max={120}
                min={5}
                step={5}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-white border-white/20 bg-black/60"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Durdur' : 'Başlat'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/20 bg-black/60"
              onClick={handleManualRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Son Güncelleme */}
        <div className="text-xs text-gray-400 text-center">
          Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
        </div>

        {/* Katman Özel Ayarlar */}
        {activeLayer === 'flights' && (
          <div className="space-y-2 pt-2 border-t border-white/20">
            <h4 className="text-sm font-medium">Uçak Filtreleri</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="cursor-pointer">Ticari</Badge>
              <Badge variant="outline" className="cursor-pointer">Özel</Badge>
              <Badge variant="outline" className="cursor-pointer">Kargo</Badge>
            </div>
          </div>
        )}

        {activeLayer === 'ships' && (
          <div className="space-y-2 pt-2 border-t border-white/20">
            <h4 className="text-sm font-medium">Gemi Tipleri</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="cursor-pointer">Kargo</Badge>
              <Badge variant="outline" className="cursor-pointer">Tanker</Badge>
              <Badge variant="outline" className="cursor-pointer">Yolcu</Badge>
            </div>
          </div>
        )}

        {activeLayer === 'vessel-control' && (
          <div className="space-y-2 pt-2 border-t border-white/20">
            <h4 className="text-sm font-medium">Kontrol Seçenekleri</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="cursor-pointer">Operasyonel</Badge>
              <Badge variant="outline" className="cursor-pointer">Bakım</Badge>
              <Badge variant="outline" className="cursor-pointer">Acil</Badge>
            </div>
          </div>
        )}

        {activeLayer === 'weather' && (
          <div className="space-y-2 pt-2 border-t border-white/20">
            <h4 className="text-sm font-medium">Hava Uyarıları</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Rüzgar Uyarısı</span>
                <Badge variant="destructive" className="text-xs">Yüksek</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Yağış Durumu</span>
                <Badge variant="secondary" className="text-xs">Normal</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
