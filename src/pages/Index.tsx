
import React, { useState, useEffect } from "react";
import Map from "@/components/Map";
import NewsPanel from "@/components/NewsPanel";
import { newsService } from "@/services/newsService";

const Index = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await newsService.getBreakingNews();
      setNews(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 h-[400px] md:h-screen">
        <Map news={news} loading={loading} />
      </div>
      <div className="w-full md:w-1/3 h-[400px] md:h-screen border-l border-white/10 bg-black/40">
        <NewsPanel news={news} loading={loading} />
      </div>
    </div>
  );
};

export default Index;
