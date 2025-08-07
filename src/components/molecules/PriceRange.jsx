import React from "react";
import Input from "@/components/atoms/Input";

const PriceRange = ({ minPrice, maxPrice, onMinChange, onMaxChange }) => {
  const formatPrice = (value) => {
    return value ? `$${parseInt(value).toLocaleString()}` : "";
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Price Range</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Min Price</label>
          <Input
            type="number"
            value={minPrice}
            onChange={(e) => onMinChange(e.target.value)}
            placeholder="0"
            className="text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Max Price</label>
          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxChange(e.target.value)}
            placeholder="No limit"
            className="text-sm"
          />
        </div>
      </div>
      {(minPrice || maxPrice) && (
        <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
          {formatPrice(minPrice) || "$0"} - {formatPrice(maxPrice) || "No limit"}
        </p>
      )}
    </div>
  );
};

export default PriceRange;