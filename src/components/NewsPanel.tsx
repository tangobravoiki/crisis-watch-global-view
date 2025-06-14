
import React from "react";

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  latitude?: number;
  longitude?: number;
  publishedAt?: string;
}

interface Props {
  news: NewsItem[];
  loading?: boolean;
}

const NewsPanel = ({ news, loading }: Props) => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-white/10">
      <h2 className="text-lg font-bold text-white">Haberler</h2>
    </div>
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
        </div>
      ) : (
        <ul className="space-y-6">
          {news.map((item) => (
            <li key={item.id} className="p-3 rounded bg-white/10 hover:bg-white/20 transition">
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-gray-300 mb-1">{item.description}</p>
              )}
              {item.latitude && item.longitude && (
                <p className="text-xs text-lime-400 mb-1">Konumlu haber</p>
              )}
              {item.publishedAt && (
                <p className="text-xs text-gray-400">{new Date(item.publishedAt).toLocaleString("tr-TR")}</p>
              )}
              {item.url && item.url !== "#" && (
                <a
                  className="inline-block mt-2 text-cyan-300 hover:underline text-xs"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Haberi Aç
                </a>
              )}
            </li>
          ))}
          {news.length === 0 && (
            <div className="text-gray-300 text-center py-12">Haber bulunamadı.</div>
          )}
        </ul>
      )}
    </div>
  </div>
);

export default NewsPanel;
