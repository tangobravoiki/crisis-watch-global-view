
const RAPIDAPI_KEY = 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1';
const AISSTREAM_KEY = '1e3dd2202bc9ba9df4b285abcfd8c5749ad57590';

export const shipService = {
  async getNearbyShips(lat: number, lon: number, radius: number = 100) {
    try {
      // VesselFinder API kullanarak
      const response = await fetch(`https://vesselfinder-api.p.rapidapi.com/vessels/search?lat=${lat}&lng=${lon}&radius=${radius}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'vesselfinder-api.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        console.error('VesselFinder API hatası:', response.status);
        return this.getShipsFromAISStream(lat, lon);
      }

      const data = await response.json();
      return this.parseShipData(data);
    } catch (error) {
      console.error('VesselFinder hatası:', error);
      return this.getShipsFromAISStream(lat, lon);
    }
  },

  async getShipsFromAISStream(lat: number, lon: number) {
    try {
      // AISStream.io API
      const response = await fetch(`https://api.aisstream.io/v0/last_known_vessel?api_key=${AISSTREAM_KEY}&lat=${lat}&lng=${lon}&radius=50`, {
        method: 'GET'
      });

      if (!response.ok) {
        console.error('AISStream API hatası:', response.status);
        return [];
      }

      const data = await response.json();
      return this.parseAISStreamData(data);
    } catch (error) {
      console.error('AISStream hatası:', error);
      return [];
    }
  },

  parseShipData(data: any) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((ship: any) => ({
      mmsi: ship.mmsi || Math.random().toString(),
      name: ship.name || 'Unknown Vessel',
      latitude: ship.lat || ship.latitude,
      longitude: ship.lng || ship.longitude,
      speed: ship.speed || 0,
      course: ship.course || 0,
      shipType: ship.type || 'Unknown',
      flag: ship.flag || 'Unknown'
    })).filter((ship: any) => ship.latitude && ship.longitude);
  },

  parseAISStreamData(data: any) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((vessel: any) => ({
      mmsi: vessel.mmsi,
      name: vessel.name || 'Unknown Vessel',
      latitude: vessel.lat,
      longitude: vessel.lng,
      speed: vessel.speed_over_ground || 0,
      course: vessel.course_over_ground || 0,
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
      const response = await fetch(`https://vessel-information.p.rapidapi.com/vessel/info?mmsi=${mmsi}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'vessel-information.p.rapidapi.com'
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
