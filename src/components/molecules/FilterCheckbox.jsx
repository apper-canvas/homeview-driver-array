import React from "react";
import ApperIcon from "@/components/ApperIcon";

const FilterCheckbox = ({ label, checked, onChange, className = "" }) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <div className={`relative flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
        checked ? 'bg-primary border-primary' : 'border-gray-300 hover:border-primary'
      }`}>
        {checked && (
          <ApperIcon name="Check" size={12} className="text-white" />
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default FilterCheckbox;