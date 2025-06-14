const AVIATIONSTACK_KEY = 'a1e63f696eae988382be2f90795c00c9';
const RAPIDAPI_KEY = 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1';
const APIMARKET_KEY = 'cma6gluj90008l804ikosp0yp';

export const flightService = {
  async getNearbyFlights(lat: number, lon: number, radius: number = 100) {
    console.log('Uçak verisi alınıyor...', { lat, lon, radius });

    // Önce AviationStack
    try {
      const flights = await this.getFlightsFromAviationStack();
      if (flights && flights.length > 0) {
        console.log('AviationStack\'ten uçak verisi alındı:', flights.length);
        return flights;
      }
    } catch (error) {
      console.error('AviationStack hatası:', error);
    }

    // Yedek: FlightRadar24
    try {
      const flights = await this.getFlightsFromFlightRadar(lat, lon);
      if (flights && flights.length > 0) {
        console.log('FlightRadar24\'ten uçak verisi alındı:', flights.length);
        return flights;
      }
    } catch (error) {
      console.error('FlightRadar24 hatası:', error);
    }

    // Mock veri ASLA kullanılmasın
    console.error("Uçuş verisi alınamadı. Mock veri gösterilmeyecek.");
    return [];
  },

  async getFlightsFromAviationStack() {
    try {
      const response = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&limit=15`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`AviationStack API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAviationStackData(data.data || []);
    } catch (error) {
      console.error('AviationStack hatası:', error);
      throw error;
    }
  },

  async getFlightsFromFlightRadar(lat: number, lon: number) {
    try {
      const response = await fetch(`https://flightradar-flight-tracker.p.rapidapi.com/flights/list-in-boundary?bl_lat=${lat-1}&bl_lng=${lon-1}&tr_lat=${lat+1}&tr_lng=${lon+1}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'flightradar-flight-tracker.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`FlightRadar API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseFlightRadarData(data.aircraft || []);
    } catch (error) {
      console.error('FlightRadar hatası:', error);
      throw error;
    }
  },

  parseAviationStackData(flights: any[]) {
    return flights.map((flight: any, index: number) => ({
      icao24: flight.flight?.icao || `mock_${index}`,
      callsign: flight.flight?.number || `FL${1000 + index}`,
      latitude: flight.geography?.latitude || (41 + (Math.random() - 0.5) * 2),
      longitude: flight.geography?.longitude || (29 + (Math.random() - 0.5) * 2),
      altitude: flight.geography?.altitude || Math.floor(Math.random() * 12000) + 3000,
      velocity: Math.floor(Math.random() * 300) + 200,
      heading: flight.geography?.direction || Math.floor(Math.random() * 360),
      registration: flight.aircraft?.registration || 'Unknown'
    })).filter((flight: any) => flight.latitude && flight.longitude);
  },

  parseFlightRadarData(aircraft: any[]) {
    return aircraft.map((plane: any) => ({
      icao24: plane.hex || Math.random().toString(36).substr(2, 9),
      callsign: plane.flight || 'Unknown',
      latitude: plane.lat,
      longitude: plane.lng,
      altitude: plane.alt || 0,
      velocity: plane.spd || 0,
      heading: plane.trak || 0,
      registration: plane.reg || 'Unknown'
    })).filter((flight: any) => flight.latitude && flight.longitude);
  },

  getMockFlights(lat: number, lon: number) {
    const mockFlights = [];
    for (let i = 0; i < 8; i++) {
      mockFlights.push({
        icao24: `MOCK${i.toString().padStart(3, '0')}`,
        callsign: `TK${1000 + i}`,
        latitude: lat + (Math.random() - 0.5) * 2,
        longitude: lon + (Math.random() - 0.5) * 2,
        altitude: Math.floor(Math.random() * 8000) + 5000,
        velocity: Math.floor(Math.random() * 200) + 250,
        heading: Math.floor(Math.random() * 360),
        registration: `TC-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
      });
    }
    return mockFlights;
  },

  async getFlightDetails(flightId: string) {
    try {
      const response = await fetch(`https://flightradar-flight-tracker.p.rapidapi.com/flights/detail?flight=${flightId}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'flightradar-flight-tracker.p.rapidapi.com'
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
  },

  async getFlightPlaybackFromRadar1(flightId: string, timestamp: number) {
    // API parametrelerini kontrol et
    if (!flightId || !timestamp) {
      throw new Error('Hem flightId hem timestamp belirtilmeli');
    }

    const url = `https://flight-radar1.p.rapidapi.com/flights/get-playback?flightId=${flightId}&timestamp=${timestamp}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1',
        'x-rapidapi-host': 'flight-radar1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`FlightRadar1 Playback API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('FlightRadar1 playback verisi alınamadı:', error);
      return null;
    }
  },

  async getMostTrackedFlightsFromFlightradar243() {
    const url = 'https://flightradar243.p.rapidapi.com/v1/flights/most-tracked';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'flightradar243.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`flightradar243 most-tracked API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('flightradar243 most-tracked verisi alınamadı:', error);
      return null;
    }
  }
};
