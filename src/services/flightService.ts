
const RAPIDAPI_KEY = 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1';
const AVIATIONSTACK_KEY = 'a1e63f696eae988382be2f90795c00c9';

export const flightService = {
  async getNearbyFlights(lat: number, lon: number, radius: number = 100) {
    try {
      // FlightRadar24 API kullanarak
      const response = await fetch(`https://flightradar24-api.p.rapidapi.com/flights/list-in-boundary?bl_lat=${lat-1}&bl_lng=${lon-1}&tr_lat=${lat+1}&tr_lng=${lon+1}&limit=50`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'flightradar24-api.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        console.error('FlightRadar24 API hatası:', response.status);
        return this.getFlightsFromAviationStack(lat, lon);
      }

      const data = await response.json();
      return this.parseFlightData(data);
    } catch (error) {
      console.error('FlightRadar24 hatası:', error);
      return this.getFlightsFromAviationStack(lat, lon);
    }
  },

  async getFlightsFromAviationStack(lat: number, lon: number) {
    try {
      const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&limit=50`, {
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

  parseFlightData(data: any) {
    if (!data || !data.aircraft) return [];
    
    return data.aircraft.map((flight: any) => ({
      icao24: flight[0],
      callsign: flight[16] || 'Unknown',
      latitude: flight[1],
      longitude: flight[2],
      altitude: flight[4],
      velocity: flight[5],
      heading: flight[3],
      registration: flight[9]
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
      const response = await fetch(`https://flightradar24-api.p.rapidapi.com/flights/detail?flight=${flightId}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'flightradar24-api.p.rapidapi.com'
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
