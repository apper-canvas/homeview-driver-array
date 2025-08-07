import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No properties found", 
  description = "Try adjusting your filters or search criteria",
  actionText = "Clear Filters",
  onAction,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full p-8 mb-6">
        <ApperIcon name="Home" size={64} className="text-primary" />
      </div>
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="Filter" size={18} />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Empty;