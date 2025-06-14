
import React from 'react';
import { Plane, Ship, Cloud, Newspaper, MapPin, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LayerControlsProps {
  activeLayer: string;
  setActiveLayer: (layer: string) => void;
}

const LayerControls = ({ activeLayer, setActiveLayer }: LayerControlsProps) => {
  const layers = [
    { id: 'flights', name: 'Uçak Takibi', icon: Plane, color: 'bg-blue-500' },
    { id: 'ships', name: 'Gemi Takibi', icon: Ship, color: 'bg-cyan-500' },
    { id: 'vessel-control', name: 'Gemi Kontrolü', icon: Anchor, color: 'bg-purple-500' },
    { id: 'weather', name: 'Hava Durumu', icon: Cloud, color: 'bg-green-500' },
    { id: 'news', name: 'Haberler', icon: Newspaper, color: 'bg-red-500' },
    { id: 'traffic', name: 'Trafik', icon: MapPin, color: 'bg-orange-500' }
  ];

  return (
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
  );
};

export default LayerControls;
