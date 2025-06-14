
const THE_NEWS_API_KEY = '7QfFI2tpedijwyUwaxh6d8TsXQ1y3VFHftT1owKG';

export const newsService = {
  /**
   * Sadece başlıca haberleri çeker, konum varsa döner.
   */
  async getBreakingNews() {
    try {
      const response = await fetch(
        `https://api.thenewsapi.com/v1/news/top?api_token=${THE_NEWS_API_KEY}&locale=tr&limit=10`
      );
      if (!response.ok) throw new Error("TheNewsAPI error");
      const data = await response.json();
      const articles = (data.data || [])
        .map((a: any) => ({
          id: a.uuid || Math.random().toString(),
          title: a.title,
          description: a.description,
          url: a.url,
          // Konum örneklemesi: eğer a.geo_location varsa ekle
          latitude: a.geo_location?.latitude ?? undefined,
          longitude: a.geo_location?.longitude ?? undefined,
          publishedAt: a.published_at,
        }));
      return articles;
    } catch (e) {
      // En azından basit örnek/mock: konumlu ve konumsuz
      return [
        {
          id: "mock1",
          title: "Sahte Deprem Haberi",
          description: "İstanbul'da büyük bir deprem oldu.",
          url: "#",
          latitude: 41.0082,
          longitude: 28.9784,
          publishedAt: new Date().toISOString(),
        },
        {
          id: "mock2",
          title: "Elektrik Kesintisi",
          description: "Ankara'da büyük çaplı elektrik kesintisi yaşanıyor.",
          url: "#",
          latitude: 39.9334,
          longitude: 32.8597,
          publishedAt: new Date().toISOString(),
        },
        {
          id: "mock3",
          title: "Ekonomi Haberleri",
          description: "Döviz kuru yükselişte.",
          url: "#",
          publishedAt: new Date().toISOString(),
        },
      ];
    }
  }
};
