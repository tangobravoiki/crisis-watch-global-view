
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
        console.error('NewsAPI hatası:', response.status);
        return this.getNewsFromTheNewsAPI();
      }

      const data = await response.json();
      return this.parseNewsAPIData(data.articles || []);
    } catch (error) {
      console.error('NewsAPI hatası:', error);
      return this.getNewsFromTheNewsAPI();
    }
  },

  async getNewsFromTheNewsAPI() {
    try {
      const response = await fetch(
        `https://api.thenewsapi.com/v1/news/top?api_token=${THE_NEWS_API_KEY}&locale=tr&limit=20`
      );

      if (!response.ok) {
        console.error('TheNewsAPI hatası:', response.status);
        return [];
      }

      const data = await response.json();
      return this.parseTheNewsAPIData(data.data || []);
    } catch (error) {
      console.error('TheNewsAPI hatası:', error);
      return [];
    }
  },

  async getCrisisNews(keywords: string[] = ['kriz', 'acil', 'yangın', 'deprem', 'sel']) {
    try {
      const keywordQuery = keywords.join(' OR ');
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywordQuery)}&language=tr&sortBy=publishedAt&apiKey=${NEWS_API_KEY}&pageSize=10`
      );

      if (!response.ok) {
        console.error('Crisis news API hatası:', response.status);
        return [];
      }

      const data = await response.json();
      return this.parseNewsAPIData(data.articles || []);
    } catch (error) {
      console.error('Kriz haberleri alınamadı:', error);
      return [];
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
        console.error('Google News API hatası:', response.status);
        return [];
      }

      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error('Google News hatası:', error);
      return [];
    }
  }
};
