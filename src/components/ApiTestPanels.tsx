
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ApiTestPanels = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string>('');
  const [vesselPhotoResult, setVesselPhotoResult] = useState<string>('');
  const [marineTrafficResult, setMarineTrafficResult] = useState<string>('');
  const [webHeadersResult, setWebHeadersResult] = useState<string>('');

  // Vessel Photo API
  const vesselPhotoAPI = async () => {
    const url = 'https://vessel-data.p.rapidapi.com/get_vessel_photo/%7Bshipid%7D';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1',
        'x-rapidapi-host': 'vessel-data.p.rapidapi.com'
      }
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Vessel Data API Hatası",
          description: `Yanıt kodu: ${response.status}`,
        });
        return null;
      }
      return await response.text();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Vessel Data API Hatası",
        description: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  };

  // MarineTraffic API
  const marineTrafficAPI = async () => {
    const url = 'https://marinetraffic1.p.rapidapi.com/';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1',
        'x-rapidapi-host': 'marinetraffic1.p.rapidapi.com'
      }
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "MarineTraffic API Hatası",
          description: `Yanıt kodu: ${response.status}`,
        });
        return null;
      }
      return await response.text();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "MarineTraffic API Hatası",
        description: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  };

  // Scan Web Headers API
  const scanWebHeadersAPI = async () => {
    const url = 'https://scan-web-heades-api.p.rapidapi.com/ScanHeaders?domain=www.google.com';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1',
        'x-rapidapi-host': 'scan-web-heades-api.p.rapidapi.com'
      }
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Scan Web Headers API Hatası",
          description: `Yanıt kodu: ${response.status}`,
        });
        return null;
      }
      return await response.text();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Scan Web Headers API Hatası",
        description: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Vessel Photo API */}
        <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex flex-col space-y-2">
          <h2 className="font-bold text-lg text-white mb-2">Vessel Data API</h2>
          <p className="text-gray-300 text-sm mb-2">
            Gemi fotoğrafı API örneği (herhangi bir yanıt döndürür, shipid parametresi {'{shipid}'} ile test edilir).
          </p>
          <Button
            variant="outline"
            className="mb-2 text-white border-white/30"
            onClick={async () => {
              setLoading("vessel");
              setVesselPhotoResult('');
              const result = await vesselPhotoAPI();
              setLoading('');
              if (result) setVesselPhotoResult(result);
            }}
            disabled={loading === "vessel"}
          >
            {loading === "vessel" ? 'Yükleniyor...' : 'Çalıştır'}
          </Button>
          {vesselPhotoResult && (
            <pre className="bg-black/30 text-xs rounded p-2 overflow-auto text-gray-100 whitespace-pre-wrap max-h-48">
              {vesselPhotoResult}
            </pre>
          )}
        </div>

        {/* MarineTraffic API */}
        <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex flex-col space-y-2">
          <h2 className="font-bold text-lg text-white mb-2">Marine Traffic API</h2>
          <p className="text-gray-300 text-sm mb-2">
            MarineTraffic test API çağrısı (döküman gerektiriyor olabilir, örnek endpoint root).
          </p>
          <Button
            variant="outline"
            className="mb-2 text-white border-white/30"
            onClick={async () => {
              setLoading("marine");
              setMarineTrafficResult('');
              const result = await marineTrafficAPI();
              setLoading('');
              if (result) setMarineTrafficResult(result);
            }}
            disabled={loading === "marine"}
          >
            {loading === "marine" ? 'Yükleniyor...' : 'Çalıştır'}
          </Button>
          {marineTrafficResult && (
            <pre className="bg-black/30 text-xs rounded p-2 overflow-auto text-gray-100 whitespace-pre-wrap max-h-48">
              {marineTrafficResult}
            </pre>
          )}
        </div>

        {/* Scan Web Headers API */}
        <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex flex-col space-y-2">
          <h2 className="font-bold text-lg text-white mb-2">Scan Web Headers API</h2>
          <p className="text-gray-300 text-sm mb-2">
            Belirli alan adı için başlıkları çeker (şu an www.google.com ile örnek gösterim).
          </p>
          <Button
            variant="outline"
            className="mb-2 text-white border-white/30"
            onClick={async () => {
              setLoading("headers");
              setWebHeadersResult('');
              const result = await scanWebHeadersAPI();
              setLoading('');
              if (result) setWebHeadersResult(result);
            }}
            disabled={loading === "headers"}
          >
            {loading === "headers" ? 'Yükleniyor...' : 'Çalıştır'}
          </Button>
          {webHeadersResult && (
            <pre className="bg-black/30 text-xs rounded p-2 overflow-auto text-gray-100 whitespace-pre-wrap max-h-48">
              {webHeadersResult}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTestPanels;
