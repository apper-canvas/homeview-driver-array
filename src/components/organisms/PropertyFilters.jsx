import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PriceRange from "@/components/molecules/PriceRange";
import FilterCheckbox from "@/components/molecules/FilterCheckbox";
import ApperIcon from "@/components/ApperIcon";

const PropertyFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  isOpen, 
  onToggle 
}) => {
  const propertyTypes = ["Single Family", "Condo", "Townhouse", "Multi-Family"];

  const handlePropertyTypeChange = (type) => {
    const currentTypes = filters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFiltersChange({ ...filters, propertyTypes: newTypes });
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={onToggle}
          variant="secondary"
          icon={isOpen ? "X" : "Filter"}
          className="w-full"
        >
          {isOpen ? "Close Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:block overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-semibold text-gray-900">Filters</h3>
                <Button
                  onClick={onClearFilters}
                  variant="ghost"
                  size="sm"
                  icon="RotateCcw"
                >
                  Clear All
                </Button>
              </div>

              {/* Price Range */}
              <PriceRange
                minPrice={filters.priceMin}
                maxPrice={filters.priceMax}
                onMinChange={(value) => onFiltersChange({ ...filters, priceMin: value })}
                onMaxChange={(value) => onFiltersChange({ ...filters, priceMax: value })}
              />

              {/* Property Types */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Property Type</h4>
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <FilterCheckbox
                      key={type}
                      label={type}
                      checked={(filters.propertyTypes || []).includes(type)}
                      onChange={() => handlePropertyTypeChange(type)}
                    />
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Minimum Bedrooms</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => onFiltersChange({ 
                        ...filters, 
                        bedroomsMin: filters.bedroomsMin === num ? null : num 
                      })}
                      className={`p-2 rounded-lg border-2 text-center transition-colors ${
                        filters.bedroomsMin === num
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 hover:border-primary"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Minimum Bathrooms</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => onFiltersChange({ 
                        ...filters, 
                        bathroomsMin: filters.bathroomsMin === num ? null : num 
                      })}
                      className={`p-2 rounded-lg border-2 text-center transition-colors ${
                        filters.bathroomsMin === num
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 hover:border-primary"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Square Footage */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Minimum Square Feet</h4>
                <Input
                  type="number"
                  value={filters.squareFeetMin || ""}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    squareFeetMin: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  placeholder="Enter minimum sq ft"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyFilters;