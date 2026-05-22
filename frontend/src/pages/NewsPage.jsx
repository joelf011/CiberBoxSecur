import React, { useState } from 'react';
import FeaturedNewsCard from '../components/News/FeaturedNewsCard';
import NewsArticleCard from '../components/News/NewsArticleCard';

const NewsPage = () => {
  // Show 6 cards
  const [visibleCount, setVisibleCount] = useState(6);

  // DB simulation
  const featuredData = {
    id: "featured-1",
    title: "CyberBoxSecur Launches New Threat Intelligence Platform",
    categories: ["Announcement", "Platform"], 
    excerpt: "Discover our new centralized dashboard...",
    date: "2026-04-14",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" 
  };

  // Simulate DB with 12 articles
  const allArticles = Array.from({ length: 12 }, (_, index) => ({
    id: `new-${index + 1}`,
    title: `Understanding the New NIS2 Cybersecurity Directive (Parte ${index + 1})`,
    categories: ["Compliance", "Security"], 
    excerpt: "Learn how the new European cybersecurity directive affects your business...",
    date: "2026-04-10",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
  }));

  // Load More button
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  const visibleArticles = allArticles.slice(0, visibleCount);

  return (
    <div className="container py-5">
      
      {/* Featured */}
      <FeaturedNewsCard article={featuredData} />
      
      {/* News Grid */}
      <div className="row g-4">
        {visibleArticles.map((article) => (
          <div className="col-12 col-md-6 col-lg-4" key={article.id}>
            <NewsArticleCard article={article} />
          </div>
        ))}
      </div> 

      {/* Load more */}
      {visibleCount < allArticles.length && (
        <div className="d-flex justify-content-center mt-5">
          <button 
            onClick={handleLoadMore}
            className="btn btn-outline-primary fw-semibold px-5 py-2 rounded-pill"
          >
            Carregar Mais Notícias
          </button>
        </div>
      )}

    </div>
  );
};

export default NewsPage;