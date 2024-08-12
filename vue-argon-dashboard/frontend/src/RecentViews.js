// RecentViews.js
import React from 'react';

const RecentViews = ({ recentItems }) => {
  return (
    <div className="recent-views">
      <h2>Recent Views</h2>
      <div className="recent-items">
        {recentItems.length > 0 ? (
          recentItems.map((item, index) => (
            <div key={index} className="recent-item">
              <img src={item.image} alt={item.alt} style={{ width: '100px', height: 'auto' }} />
              <p>{item.title}</p>
            </div>
          ))
        ) : (
          <p>No recent views</p>
        )}
      </div>
    </div>
  );
};

export default RecentViews;
