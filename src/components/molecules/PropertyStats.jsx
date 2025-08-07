import React from "react";
import ApperIcon from "@/components/ApperIcon";

const PropertyStats = ({ bedrooms, bathrooms, squareFeet, className = "" }) => {
  return (
    <div className={`flex items-center gap-4 text-gray-600 ${className}`}>
      <div className="flex items-center gap-1">
        <ApperIcon name="Bed" size={16} />
        <span className="text-sm">{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex items-center gap-1">
        <ApperIcon name="Bath" size={16} />
        <span className="text-sm">{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex items-center gap-1">
        <ApperIcon name="Square" size={16} />
        <span className="text-sm">{squareFeet.toLocaleString()} sq ft</span>
      </div>
    </div>
  );
};

export default PropertyStats;