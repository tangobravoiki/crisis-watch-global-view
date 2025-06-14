
const RAPIDAPI_KEY = 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1';
const AISSTREAM_KEY = '1e3dd2202bc9ba9df4b285abcfd8c5749ad57590';

export const shipService = {
  async getNearbyShips(lat: number, lon: number, radius: number = 50) {
    console.log('Gemi verisi alınıyor...', { lat, lon, radius });

    // Try VesselFinder first
    try {
      const ships = await this.getShipsFromVesselFinder(lat, lon);
      if (ships && ships.length > 0) {
        console.log('VesselFinder\'dan gemi verisi alındı:', ships.length);
        return ships;
      }
    } catch (error) {
      console.error('VesselFinder hatası:', error);
    }

    // Fallback to mock data
    console.log('Mock gemi verisi kullanılıyor');
    return this.getMockShips(lat, lon);
  },

  async getShipsFromVesselFinder(lat: number, lon: number) {
    try {
      const response = await fetch(`https://vessels-info.p.rapidapi.com/api/v1/vessels/search?lat=${lat}&lng=${lon}&radius=50`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'vessels-info.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`VesselFinder API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseVesselFinderData(data);
    } catch (error) {
      console.error('VesselFinder hatası:', error);
      throw error;
    }
  },

  parseVesselFinderData(data: any) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((vessel: any) => ({
      mmsi: vessel.mmsi || Math.random().toString(),
      name: vessel.name || 'Unknown Vessel',
      latitude: vessel.latitude,
      longitude: vessel.longitude,
      speed: vessel.speed || 0,
      course: vessel.course || 0,
      shipType: this.getShipTypeFromCode(vessel.ship_type),
      flag: vessel.flag || 'Unknown'
    })).filter((ship: any) => ship.latitude && ship.longitude);
  },

  getMockShips(lat: number, lon: number) {
    const shipTypes = ['Cargo', 'Tanker', 'Passenger', 'Fishing', 'Towing', 'Pleasure'];
    const flags = ['Turkey', 'Greece', 'Malta', 'Panama', 'Liberia'];
    const mockShips = [];

    for (let i = 0; i < 6; i++) {
      mockShips.push({
        mmsi: `35${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        name: `MV ${['ISTANBUL', 'BOSPHORUS', 'MARMARA', 'AEGEAN', 'MEDITERRANEAN', 'ANATOLIA'][i]}`,
        latitude: lat + (Math.random() - 0.5) * 1,
        longitude: lon + (Math.random() - 0.5) * 1,
        speed: Math.floor(Math.random() * 15) + 5,
        course: Math.floor(Math.random() * 360),
        shipType: shipTypes[Math.floor(Math.random() * shipTypes.length)],
        flag: flags[Math.floor(Math.random() * flags.length)]
      });
    }
    return mockShips;
  },

  getShipTypeFromCode(code: number) {
    const shipTypes = {
      30: 'Fishing',
      31: 'Towing',
      32: 'Towing Large',
      33: 'Dredging',
      34: 'Diving',
      35: 'Military',
      36: 'Sailing',
      37: 'Pleasure',
      60: 'Passenger',
      70: 'Cargo',
      80: 'Tanker'
    };
    return shipTypes[code] || 'Unknown';
  },

  async getShipDetails(mmsi: string) {
    try {
      const response = await fetch(`https://vessels-info.p.rapidapi.com/api/v1/vessels/${mmsi}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'vessels-info.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        console.error('Ship details API hatası:', response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Gemi detayları alınamadı:', error);
      return null;
    }
  }
};
