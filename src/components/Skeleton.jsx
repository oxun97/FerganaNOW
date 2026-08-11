import React from 'react';

export const Skeleton = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
  </div>
);

export const SkeletonLiveCard = () => (
  <div className="skeleton-live-card">
    <div className="skeleton skeleton-badge" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-btn" />
  </div>
);
