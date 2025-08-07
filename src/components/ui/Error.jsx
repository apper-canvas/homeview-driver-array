import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="bg-red-50 rounded-full p-6 mb-6">
        <ApperIcon name="AlertCircle" size={48} className="text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;