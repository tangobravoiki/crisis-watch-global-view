
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  emergencyMode: boolean;
  setEmergencyMode: (mode: boolean) => void;
}

const Header = ({ emergencyMode, setEmergencyMode }: HeaderProps) => {
  return (
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
  );
};

export default Header;
