import React from "react";

export const renderContentWithHashtags = (content, onTagClick) => {
  if (!content) return null;

  const parts = content.split(/(\s+)/);

  return parts.map((part, index) => {
    if (part.startsWith("#") && part.length > 1) {
      return React.createElement(
        "span",
        {
          key: index,
          onClick: (e) => {
            e.stopPropagation();
            if (onTagClick) onTagClick(part);
          },
          className: "text-cyan-400 font-medium hover:text-cyan-300 cursor-pointer transition-colors"
        },
        part
      );
    }
    return part;
  });
};
