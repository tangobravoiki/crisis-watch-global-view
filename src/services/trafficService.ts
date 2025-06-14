
const TOMTOM_KEY = '4aWbNX5XHYVrCjWnn1uDeXeCM9Q7hGG0';

export const trafficService = {
  async getTrafficData(lat: number, lon: number, zoom: number = 10) {
    console.log('Trafik verisi alınıyor...', { lat, lon, zoom });
    
    try {
      // TomTom Traffic Flow API
      const response = await fetch(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/${zoom}/${lat}/${lon}.json?key=${TOMTOM_KEY}`
      );

      if (!response.ok) {
        console.error('TomTom Traffic API hatası:', response.status);
        return this.getMockTrafficData(lat, lon);
      }

      const data = await response.json();
      console.log('TomTom\'dan trafik verisi alındı:', data);
      return this.parseTrafficData(data);
    } catch (error) {
      console.error('Trafik verisi alınamadı:', error);
      return this.getMockTrafficData(lat, lon);
    }
  },

  parseTrafficData(data: any) {
    if (!data || !data.flowSegmentData) {
      return null;
    }

    return {
      currentSpeed: data.flowSegmentData.currentSpeed,
      freeFlowSpeed: data.flowSegmentData.freeFlowSpeed,
      currentTravelTime: data.flowSegmentData.currentTravelTime,
      freeFlowTravelTime: data.flowSegmentData.freeFlowTravelTime,
      confidence: data.flowSegmentData.confidence,
      roadClosure: data.flowSegmentData.roadClosure
    };
  },

  getMockTrafficData(lat: number, lon: number) {
    return {
      currentSpeed: Math.floor(Math.random() * 60) + 20,
      freeFlowSpeed: 80,
      currentTravelTime: Math.floor(Math.random() * 300) + 180,
      freeFlowTravelTime: 120,
      confidence: 0.85,
      roadClosure: false,
      coordinates: { lat, lon }
    };
  },

  getTrafficTileUrl(x: number, y: number, z: number) {
    return `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/${z}/${x}/${y}.png?key=${TOMTOM_KEY}`;
  },

  getTrafficSeverity(trafficData: any) {
    if (!trafficData) return 'low';
    
    const speedRatio = trafficData.currentSpeed / trafficData.freeFlowSpeed;
    
    if (speedRatio < 0.3) return 'high'; // Very slow traffic
    if (speedRatio < 0.6) return 'medium'; // Moderate traffic
    return 'low'; // Light traffic
  }
};
