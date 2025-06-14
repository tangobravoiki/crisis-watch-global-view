
const THE_NEWS_API_KEY = '7QfFI2tpedijwyUwaxh6d8TsXQ1y3VFHftT1owKG';
const NEWSAPI_ORG_KEY = 'ed5a64d631744bb693160fd70115c3b2';
const COLLECTAPI_KEY = '6KfGlnEskk5Ah5QKepNzWY:0GQ9h2vP4sO4tkuCNZLyY6';
const RAPIDAPI_KEY = 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1';

export const newsService = {
  async getBreakingNews() {
    console.log('Haber verisi alınıyor...');
    
    // Try TheNewsAPI first
    try {
      const news = await this.getNewsFromTheNewsAPI();
      if (news && news.length > 0) {
        console.log('TheNewsAPI\'den haber verisi alındı:', news.length);
        return news.slice(0, 10);
      }
    } catch (error) {
      console.error('TheNewsAPI hatası:', error);
    }

    // Fallback to NewsAPI.org
    try {
      const news = await this.getNewsFromNewsAPIOrg();
      if (news && news.length > 0) {
        console.log('NewsAPI.org\'dan haber verisi alındı:', news.length);
        return news.slice(0, 10);
      }
    } catch (error) {
      console.error('NewsAPI.org hatası:', error);
    }

    // Final fallback - mock data
    console.log('Mock haber verisi kullanılıyor');
    return this.getMockNews();
  },

  async getNewsFromTheNewsAPI() {
    try {
      const response = await fetch(
        `https://api.thenewsapi.com/v1/news/top?api_token=${THE_NEWS_API_KEY}&locale=tr&limit=15`
      );

      if (!response.ok) {
        throw new Error(`TheNewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseTheNewsAPIData(data.data || []);
    } catch (error) {
      console.error('TheNewsAPI hatası:', error);
      throw error;
    }
  },

  async getNewsFromNewsAPIOrg() {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=tr&apiKey=${NEWSAPI_ORG_KEY}&pageSize=15`
      );

      if (!response.ok) {
        throw new Error(`NewsAPI.org error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseNewsAPIData(data.articles || []);
    } catch (error) {
      console.error('NewsAPI.org hatası:', error);
      throw error;
    }
  },

  async getCrisisNews(keywords: string[] = ['kriz', 'acil', 'yangın', 'deprem', 'sel', 'fırtına']) {
    try {
      const keywordQuery = keywords.join(' OR ');
      const response = await fetch(
        `https://api.thenewsapi.com/v1/news/all?api_token=${THE_NEWS_API_KEY}&search=${encodeURIComponent(keywordQuery)}&language=tr&limit=10`
      );

      if (!response.ok) {
        console.error('Crisis news API hatası:', response.status);
        return this.getMockCrisisNews();
      }

      const data = await response.json();
      return this.parseTheNewsAPIData(data.data || []);
    } catch (error) {
      console.error('Kriz haberleri alınamadı:', error);
      return this.getMockCrisisNews();
    }
  },

  parseTheNewsAPIData(articles: any[]) {
    return articles.map((article: any) => ({
      id: article.uuid || Math.random().toString(),
      title: article.title,
      description: article.description,
      content: article.snippet,
      url: article.url,
      image: article.image_url,
      publishedAt: article.published_at,
      source: article.source || 'Bilinmeyen Kaynak',
      category: article.categories?.[0] || 'general',
      severity: this.getNewsSeverity(article.title + ' ' + (article.description || ''))
    })).filter((news: any) => news.title && news.description);
  },

  parseNewsAPIData(articles: any[]) {
    return articles.map((article: any) => ({
      id: article.url || Math.random().toString(),
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source?.name || 'Bilinmeyen Kaynak',
      category: 'general',
      severity: this.getNewsSeverity(article.title + ' ' + (article.description || ''))
    })).filter((news: any) => news.title && news.description);
  },

  getMockNews() {
    const mockArticles = [
      {
        id: 'mock_1',
        title: 'İstanbul Trafiğinde Yoğunluk',
        description: 'Şehirde trafik yoğunluğu devam ediyor.',
        content: 'Detaylı trafik raporu...',
        url: '#',
        image: null,
        publishedAt: new Date().toISOString(),
        source: 'Trafik Haber',
        category: 'traffic',
        severity: 'medium'
      },
      {
        id: 'mock_2',
        title: 'Hava Durumu Uyarısı',
        description: 'Meteoroloji\'den fırtına uyarısı.',
        content: 'Hava durumu detayları...',
        url: '#',
        image: null,
        publishedAt: new Date().toISOString(),
        source: 'Meteoroloji',
        category: 'weather',
        severity: 'high'
      },
      {
        id: 'mock_3',
        title: 'Havayolu Trafiğinde Artış',
        description: 'Uçak seferlerinde yoğunluk yaşanıyor.',
        content: 'Havayolu detayları...',
        url: '#',
        image: null,
        publishedAt: new Date().toISOString(),
        source: 'Havayolu Haber',
        category: 'aviation',
        severity: 'low'
      }
    ];
    return mockArticles;
  },

  getMockCrisisNews() {
    return [
      {
        id: 'crisis_1',
        title: 'Acil Durum Tatbikatı',
        description: 'Şehirde acil durum tatbikatı yapılıyor.',
        content: 'Tatbikat detayları...',
        url: '#',
        image: null,
        publishedAt: new Date().toISOString(),
        source: 'AFAD',
        category: 'emergency',
        severity: 'high'
      }
    ];
  },

  getNewsSeverity(text: string) {
    if (!text) return 'low';
    
    const highSeverityWords = ['kriz', 'acil', 'tehlike', 'yangın', 'deprem', 'sel', 'fırtına', 'kaza', 'ölüm', 'yaralanma'];
    const mediumSeverityWords = ['uyarı', 'dikkat', 'yoğunluk', 'gecikme', 'sorun', 'arıza'];
    
    const lowerText = text.toLowerCase();
    
    if (highSeverityWords.some(word => lowerText.includes(word))) return 'high';
    if (mediumSeverityWords.some(word => lowerText.includes(word))) return 'medium';
    return 'low';
  }
};
