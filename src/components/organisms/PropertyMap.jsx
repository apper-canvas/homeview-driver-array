import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PropertyMap = ({ properties, selectedProperty, onPropertySelect }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of US
  const [zoom, setZoom] = useState(4);

  // Simulate map markers
  const markers = properties.map((property) => ({
    ...property,
    position: property.coordinates
  }));

  const handleMarkerClick = (property) => {
    onPropertySelect(property);
    setMapCenter(property.coordinates);
    setZoom(12);
  };

  const resetView = () => {
    setMapCenter({ lat: 39.8283, lng: -98.5795 });
    setZoom(4);
    onPropertySelect(null);
  };

  return (
    <div className="relative h-96 lg:h-[600px] bg-gray-100 rounded-xl overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Button onClick={resetView} variant="secondary" size="sm" icon="RotateCcw">
          Reset View
        </Button>
        <div className="bg-white rounded-lg p-2 shadow-lg">
          <p className="text-sm text-gray-600">Zoom: {zoom}</p>
        </div>
      </div>

      {/* Simulated Map */}
      <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Map" size={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Interactive Map View</h3>
          <p className="text-gray-500">Click on property markers to see details</p>
        </div>
      </div>

      {/* Property Markers (Simulated) */}
      {markers.slice(0, 6).map((property, index) => (
        <motion.button
          key={property.Id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleMarkerClick(property)}
          className={`absolute bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform ${
            selectedProperty?.Id === property.Id ? 'ring-4 ring-primary/30' : ''
          }`}
          style={{
            left: `${20 + (index % 3) * 30}%`,
            top: `${25 + Math.floor(index / 3) * 40}%`
          }}
        >
          <ApperIcon name="Home" size={20} />
        </motion.button>
      ))}

      {/* Property Details Popup */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl p-4 max-w-md mx-auto"
        >
          <div className="flex gap-4">
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.title}
              className="w-20 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-display font-semibold text-gray-900 line-clamp-1">
                  {selectedProperty.title}
                </h4>
                <button
                  onClick={() => onPropertySelect(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              </div>
              <p className="text-lg font-bold text-primary mb-1">
                ${selectedProperty.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{selectedProperty.bedrooms} bed</span>
                <span>{selectedProperty.bathrooms} bath</span>
                <span>{selectedProperty.squareFeet.toLocaleString()} sq ft</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PropertyMap;