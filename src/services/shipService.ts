
const RAPIDAPI_KEY = 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1';
const AISSTREAM_KEY = '1e3dd2202bc9ba9df4b285abcfd8c5749ad57590';

export const shipService = {
  async getNearbyShips(lat: number, lon: number, radius: number = 50) {
    try {
      // MarineTraffic API kullanarak
      const response = await fetch(`https://marine-traffic.p.rapidapi.com/vessels?lat=${lat}&lng=${lon}&radius=${radius}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'marine-traffic.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        console.error('MarineTraffic API hatası:', response.status);
        return this.getShipsFromVesselFinder(lat, lon);
      }

      const data = await response.json();
      return this.parseMarineTrafficData(data);
    } catch (error) {
      console.error('MarineTraffic hatası:', error);
      return this.getShipsFromVesselFinder(lat, lon);
    }
  },

  async getShipsFromVesselFinder(lat: number, lon: number) {
    try {
      // Alternatif vessel API
      const response = await fetch(`https://vessels-info.p.rapidapi.com/api/v1/vessels/search?lat=${lat}&lng=${lon}&radius=50`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'vessels-info.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        console.error('VesselFinder API hatası:', response.status);
        return [];
      }

      const data = await response.json();
      return this.parseVesselFinderData(data);
    } catch (error) {
      console.error('VesselFinder hatası:', error);
      return [];
    }
  },

  parseMarineTrafficData(data: any) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((ship: any) => ({
      mmsi: ship.mmsi || Math.random().toString(),
      name: ship.shipName || 'Unknown Vessel',
      latitude: ship.lat,
      longitude: ship.lng,
      speed: ship.speed || 0,
      course: ship.course || 0,
      shipType: ship.shipType || 'Unknown',
      flag: ship.flag || 'Unknown'
    })).filter((ship: any) => ship.latitude && ship.longitude);
  },

  parseVesselFinderData(data: any) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((vessel: any) => ({
      mmsi: vessel.mmsi,
      name: vessel.name || 'Unknown Vessel',
      latitude: vessel.latitude,
      longitude: vessel.longitude,
      speed: vessel.speed || 0,
      course: vessel.course || 0,
      shipType: this.getShipTypeFromCode(vessel.ship_type),
      flag: vessel.flag || 'Unknown'
    })).filter((ship: any) => ship.latitude && ship.longitude);
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
