import React from 'react';
import { Tag } from '../types';

interface TagPillProps {
  tag: Tag;
}

const colorMap = {
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-red-100 text-red-500', // Using red-100/500 for a "pinkish" salmon look matching screenshot
  cyan: 'bg-cyan-100 text-cyan-600',
  orange: 'bg-orange-100 text-orange-600',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
};

export const TagPill: React.FC<TagPillProps> = ({ tag }) => {
  const colorClass = colorMap[tag.color] || colorMap.blue;
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {tag.label}
    </span>
  );
};
