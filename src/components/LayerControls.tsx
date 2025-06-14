
import React from 'react';
import { Plane, Ship, Cloud, Newspaper, MapPin, Anchor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LayerControlsProps {
  activeLayers: string[];
  setActiveLayers: (layers: string[]) => void;
}

const layers = [
  { id: 'flights', name: 'Uçak Takibi', icon: Plane, color: 'bg-blue-500' },
  { id: 'ships', name: 'Gemi Takibi', icon: Ship, color: 'bg-cyan-500' },
  { id: 'vessel-control', name: 'Gemi Kontrolü', icon: Anchor, color: 'bg-purple-500' },
  { id: 'weather', name: 'Hava Durumu', icon: Cloud, color: 'bg-green-500' },
  { id: 'news', name: 'Haberler', icon: Newspaper, color: 'bg-red-500' },
  { id: 'traffic', name: 'Trafik', icon: MapPin, color: 'bg-orange-500' }
];

const LayerControls = ({ activeLayers, setActiveLayers }: LayerControlsProps) => {
  return (
    <Card className="mb-4 bg-black/60 border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Katman Kontrolü</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <ToggleGroup
          type="multiple"
          value={activeLayers}
          onValueChange={setActiveLayers}
          className="flex flex-col gap-2"
        >
          {layers.map(layer => {
            const IconComponent = layer.icon;
            const isActive = activeLayers.includes(layer.id);
            return (
              <ToggleGroupItem
                key={layer.id}
                value={layer.id}
                variant={isActive ? "default" : "outline"}
                className={
                  `w-full flex items-center justify-start gap-2 text-white px-3 py-2 rounded-md 
                  ${isActive ? layer.color + " hover:opacity-80" : "hover:bg-white/10"}`
                }
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {layer.name}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </CardContent>
    </Card>
  );
};

export default LayerControls;
