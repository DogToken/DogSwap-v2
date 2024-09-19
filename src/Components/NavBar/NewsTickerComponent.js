import React from 'react';
import newsItems from '../../utils/newsItems';
import '../../styles/NewsTicker.css';

const NewsTickerComponent = () => {
  return (
    <div className="news-ticker-container">
      <div className="news-ticker">
        <div className="news-ticker-content">
          {newsItems.map((newsItem, index) => (
            <div className="news-ticker-item" key={index}>
              {renderNewsItem(newsItem)}
            </div>
          ))}
          {/* Duplicate the items to ensure continuous scrolling */}
          {newsItems.map((newsItem, index) => (
            <div className="news-ticker-item" key={`duplicate-${index}`}>
              {renderNewsItem(newsItem)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Function to render the news item with clickable links
const renderNewsItem = (newsItem) => {
  const parts = newsItem.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, index) => {
    if (part.match(/https?:\/\/[^\s]+/)) {
      return (
        <a href={part} key={index} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
};

export default NewsTickerComponent;
