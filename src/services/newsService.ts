
const NEWS_API_KEY = 'ed5a64d631744bb693160fd70115c3b2';
const THE_NEWS_API_KEY = '7QfFI2tpedijwyUwaxh6d8TsXQ1y3VFHftT1owKG';
const RAPIDAPI_KEY = 'e959f7813dmshf6c015e10f9d344p122dd0jsn8535aadbefe1';

export const newsService = {
  async getBreakingNews() {
    try {
      // NewsAPI.org kullanarak
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=tr&category=general&apiKey=${NEWS_API_KEY}&pageSize=20`
      );

      if (!response.ok) {
        throw new Error('News data fetch failed');
      }

      const data = await response.json();
      return this.parseNewsAPIData(data.articles || []);
    } catch (error) {
      console.log('NewsAPI hatası, TheNewsAPI deneniyor...', error);
      return this.getNewsFromTheNewsAPI();
    }
  },

  async getNewsFromTheNewsAPI() {
    try {
      const response = await fetch(
        `https://api.thenewsapi.com/v1/news/top?api_token=${THE_NEWS_API_KEY}&locale=tr&limit=20`
      );

      if (!response.ok) {
        throw new Error('TheNewsAPI data fetch failed');
      }

      const data = await response.json();
      return this.parseTheNewsAPIData(data.data || []);
    } catch (error) {
      console.log('TheNewsAPI hatası, mock data kullanılıyor...', error);
      return this.getMockNewsData();
    }
  },

  async getCrisisNews(keywords: string[] = ['kriz', 'acil', 'yangın', 'deprem', 'sel']) {
    try {
      const keywordQuery = keywords.join(' OR ');
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywordQuery)}&language=tr&sortBy=publishedAt&apiKey=${NEWS_API_KEY}&pageSize=10`
      );

      if (!response.ok) {
        throw new Error('Crisis news fetch failed');
      }

      const data = await response.json();
      return this.parseNewsAPIData(data.articles || []);
    } catch (error) {
      console.error('Kriz haberleri alınamadı:', error);
      return this.getMockCrisisNews();
    }
  },

  parseNewsAPIData(articles: any[]) {
    return articles.map((article: any) => ({
      id: article.url,
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source?.name || 'Bilinmeyen Kaynak',
      category: 'general',
      severity: this.getNewsSeverity(article.title + ' ' + article.description)
    })).filter((news: any) => news.title && news.description);
  },

  parseTheNewsAPIData(articles: any[]) {
    return articles.map((article: any) => ({
      id: article.uuid,
      title: article.title,
      description: article.description,
      content: article.snippet,
      url: article.url,
      image: article.image_url,
      publishedAt: article.published_at,
      source: article.source || 'Bilinmeyen Kaynak',
      category: article.categories?.[0] || 'general',
      severity: this.getNewsSeverity(article.title + ' ' + article.description)
    })).filter((news: any) => news.title && news.description);
  },

  getMockNewsData() {
    const mockNews = [
      {
        id: '1',
        title: 'İstanbul Boğazı\'nda Trafik Yoğunluğu',
        description: 'İstanbul Boğazı\'nda gemi trafiği yoğunlaştı, geçiş süreleri uzadı.',
        content: 'İstanbul Boğazı\'nda artan gemi trafiği nedeniyle geçiş süreleri normalin üzerinde seyrediyor.',
        url: '#',
        image: null,
        publishedAt: new Date().toISOString(),
        source: 'Denizcilik Haber',
        category: 'transportation',
        severity: 'medium'
      },
      {
        id: '2',
        title: 'Ege Denizi\'nde Fırtına Uyarısı',
        description: 'Meteoroloji Genel Müdürlüğü Ege Denizi için fırtına uyarısı yayınladı.',
        content: 'Ege Denizi\'nde beklenen kuvvetli rüzgar nedeniyle denizcilik faaliyetlerinde dikkat edilmesi gerekiyor.',
        url: '#',
        image: null,
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'Meteoroloji',
        category: 'weather',
        severity: 'high'
      },
      {
        id: '3',
        title: 'Havayolu Trafiğinde Normalleşme',
        description: 'Pandemi sonrası havayolu trafiği normale döndü.',
        content: 'Havayolu şirketleri normalleşen trafik ile beraber sefer sayılarını artırıyor.',
        url: '#',
        image: null,
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: 'Havacılık Dünyası',
        category: 'aviation',
        severity: 'low'
      }
    ];
    return mockNews;
  },

  getMockCrisisNews() {
    return [
      {
        id: 'crisis1',
        title: 'Karayolu Trafiğinde Yoğunluk',
        description: 'Ana arterlerde trafik yoğunluğu devam ediyor.',
        content: 'Şehir içi trafikte normalin üzerinde yoğunluk gözleniyor.',
        url: '#',
        image: null,
        publishedAt: new Date().toISOString(),
        source: 'Trafik Merkezi',
        category: 'traffic',
        severity: 'medium'
      }
    ];
  },

  getNewsSeverity(text: string) {
    const highSeverityWords = ['kriz', 'acil', 'tehlike', 'yangın', 'deprem', 'sel', 'fırtına', 'kaza'];
    const mediumSeverityWords = ['uyarı', 'dikkat', 'yoğunluk', 'gecikme', 'sorun'];
    
    const lowerText = text.toLowerCase();
    
    if (highSeverityWords.some(word => lowerText.includes(word))) return 'high';
    if (mediumSeverityWords.some(word => lowerText.includes(word))) return 'medium';
    return 'low';
  },

  async getNewsFromGoogle(query: string) {
    try {
      const response = await fetch(`https://google-news1.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=TR&lang=tr`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'google-news1.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('Google News fetch failed');
      }

      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error('Google News hatası:', error);
      return [];
    }
  }
};
