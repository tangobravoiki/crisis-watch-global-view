
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { newsService } from '@/services/newsService';

const NewsPanel = () => {
  const [news, setNews] = useState([]);
  const [crisisNews, setCrisisNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const [generalNews, crisisData] = await Promise.all([
        newsService.getBreakingNews(),
        newsService.getCrisisNews()
      ]);
      
      setNews(generalNews.slice(0, 10));
      setCrisisNews(crisisData.slice(0, 5));
    } catch (error) {
      console.error('Haber yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'high') {
      return <AlertTriangle className="w-3 h-3" />;
    }
    return null;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}dk önce`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}sa önce`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}g önce`;
    }
  };

  const displayNews = activeTab === 'all' ? news : crisisNews;

  return (
    <Card className="h-full bg-black/30 border-white/20 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Haber Akışı</span>
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'all' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
              onClick={() => setActiveTab('all')}
            >
              Tümü
            </Button>
            <Button
              variant={activeTab === 'crisis' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
              onClick={() => setActiveTab('crisis')}
            >
              Kriz
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 h-[calc(100%-80px)]">
        <ScrollArea className="h-full px-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {displayNews.map((article, index) => (
                <div
                  key={article.id || index}
                  className="border-b border-white/10 pb-4 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(article.severity)}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {article.source}
                        </Badge>
                        {article.severity === 'high' && getSeverityIcon(article.severity)}
                      </div>
                      
                      <h3 className="font-medium text-sm leading-5 mb-2">
                        {article.title}
                      </h3>
                      
                      {article.description && (
                        <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(article.publishedAt)}
                        </div>
                        
                        {article.url && article.url !== '#' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => window.open(article.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {displayNews.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <p>Henüz haber bulunmuyor.</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t border-white/10">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-white border-white/20"
            onClick={loadNews}
            disabled={loading}
          >
            {loading ? 'Yükleniyor...' : 'Haberleri Yenile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsPanel;
