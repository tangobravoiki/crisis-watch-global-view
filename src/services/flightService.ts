
const RAPIDAPI_KEY = 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1';
const AVIATIONSTACK_KEY = 'a1e63f696eae988382be2f90795c00c9';

export const flightService = {
  async getNearbyFlights(lat: number, lon: number, radius: number = 100) {
    try {
      // ADS-B Exchange API kullanarak (daha güvenilir)
      const response = await fetch(`https://adsbexchange-com1.p.rapidapi.com/v2/lat/${lat}/lon/${lon}/dist/25/`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'adsbexchange-com1.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        console.error('ADS-B Exchange API hatası:', response.status);
        return this.getFlightsFromAviationStack();
      }

      const data = await response.json();
      return this.parseADSBData(data);
    } catch (error) {
      console.error('ADS-B Exchange hatası:', error);
      return this.getFlightsFromAviationStack();
    }
  },

  async getFlightsFromAviationStack() {
    try {
      // HTTPS kullanarak CORS sorununu çöz
      const response = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&limit=20`, {
        method: 'GET'
      });

      if (!response.ok) {
        console.error('AviationStack API hatası:', response.status);
        return [];
      }

      const data = await response.json();
      return this.parseAviationStackData(data.data || []);
    } catch (error) {
      console.error('AviationStack hatası:', error);
      return [];
    }
  },

  parseADSBData(data: any) {
    if (!data || !data.ac) return [];
    
    return data.ac.map((flight: any) => ({
      icao24: flight.hex || Math.random().toString(36).substr(2, 9),
      callsign: flight.flight || 'Unknown',
      latitude: flight.lat,
      longitude: flight.lon,
      altitude: flight.alt_baro || 0,
      velocity: flight.gs || 0,
      heading: flight.track || 0,
      registration: flight.r || 'Unknown'
    })).filter((flight: any) => flight.latitude && flight.longitude);
  },

  parseAviationStackData(flights: any[]) {
    return flights.map((flight: any) => ({
      icao24: flight.flight?.icao || Math.random().toString(36).substr(2, 9),
      callsign: flight.flight?.number || 'Unknown',
      latitude: flight.geography?.latitude || 0,
      longitude: flight.geography?.longitude || 0,
      altitude: flight.geography?.altitude || 0,
      velocity: 0,
      heading: flight.geography?.direction || 0,
      registration: flight.aircraft?.registration || 'Unknown'
    })).filter((flight: any) => flight.latitude && flight.longitude);
  },

  async getFlightDetails(flightId: string) {
    try {
      const response = await fetch(`https://adsbexchange-com1.p.rapidapi.com/v2/icao/${flightId}/`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'adsbexchange-com1.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        console.error('Flight details API hatası:', response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Uçak detayları alınamadı:', error);
      return null;
    }
  }
};
