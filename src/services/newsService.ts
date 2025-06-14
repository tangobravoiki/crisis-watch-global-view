
export const newsService = {
  /**
   * Coğrafi çatışma verilerini çeker
   */
  async getBreakingNews() {
    const url = 'https://geoconflicts.p.rapidapi.com/cluster?date=2022-02-24&format=esri';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1',
        'x-rapidapi-host': 'geoconflicts.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log('API Response:', result);
      
      // API yanıtını uygun formata dönüştür
      const articles = (result.features || []).map((feature: any, index: number) => ({
        id: feature.attributes?.id || `conflict-${index}`,
        title: feature.attributes?.event_type || 'Çatışma Olayı',
        description: feature.attributes?.notes || feature.attributes?.actor1 || 'Coğrafi çatışma verisi',
        url: '#',
        latitude: feature.geometry?.y || feature.geometry?.coordinates?.[1],
        longitude: feature.geometry?.x || feature.geometry?.coordinates?.[0],
        publishedAt: feature.attributes?.event_date || new Date().toISOString(),
      }));

      console.log('Processed articles:', articles);
      return articles;
    } catch (error) {
      console.error('API Error:', error);
      throw error; // Mock veri yerine hata fırlat
    }
  }
};
