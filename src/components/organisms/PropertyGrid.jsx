import React from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";

const PropertyGrid = ({ properties, onSaveProperty, savedProperties = [] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {properties.map((property) => (
        <motion.div key={property.Id} variants={itemVariants}>
          <PropertyCard
            property={property}
            onSave={onSaveProperty}
            isSaved={savedProperties.includes(property.Id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;