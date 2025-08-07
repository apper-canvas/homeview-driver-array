import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PropertyStats from "@/components/molecules/PropertyStats";
import ApperIcon from "@/components/ApperIcon";

const PropertyCard = ({ property, onSave, isSaved = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave(property.Id);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="accent" size="sm">
            {property.propertyType}
          </Badge>
        </div>
        <button
          onClick={handleSaveClick}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
            isSaved 
              ? 'bg-accent text-white shadow-lg' 
              : 'bg-white/90 text-gray-600 hover:bg-accent hover:text-white'
          }`}
        >
          <ApperIcon name="Heart" size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
        
        {/* Gradient overlay for price */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white text-2xl font-display font-bold">
            ${property.price.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-4 flex items-center gap-1">
          <ApperIcon name="MapPin" size={16} />
          {property.address.street}, {property.address.city}, {property.address.state}
        </p>
        
        <PropertyStats 
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          squareFeet={property.squareFeet}
          className="mb-4"
        />
        
        <Button 
          variant="ghost" 
          className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
          icon="ArrowRight"
          iconPosition="right"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default PropertyCard;