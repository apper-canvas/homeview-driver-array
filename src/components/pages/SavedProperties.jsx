import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [allProperties, savedData] = await Promise.all([
        propertyService.getAll(),
        savedPropertyService.getAll()
      ]);
      
      const savedPropertyIds = savedData.map(sp => sp.propertyId);
      const savedPropertiesList = allProperties.filter(property => 
        savedPropertyIds.includes(property.Id)
      );
      
      setProperties(savedPropertiesList);
      setSavedProperties(savedPropertyIds);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    try {
      await savedPropertyService.remove(propertyId);
      setSavedProperties(prev => prev.filter(id => id !== propertyId));
      setProperties(prev => prev.filter(property => property.Id !== propertyId));
      toast.success("Property removed from saved list");
    } catch (err) {
      toast.error("Failed to remove property");
    }
  };

  const handleClearAll = async () => {
    try {
      const removePromises = savedProperties.map(propertyId => 
        savedPropertyService.remove(propertyId)
      );
      await Promise.all(removePromises);
      setSavedProperties([]);
      setProperties([]);
      toast.success("All saved properties cleared");
    } catch (err) {
      toast.error("Failed to clear saved properties");
    }
  };

  useEffect(() => {
    loadSavedProperties();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSavedProperties} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
          Saved Properties
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Keep track of properties you're interested in and compare them easily.
        </p>
      </div>

      {properties.length === 0 ? (
        <Empty
          title="No saved properties yet"
          description="Start exploring properties and save the ones you like to see them here."
          actionText="Browse Properties"
          onAction={() => window.location.href = "/"}
        />
      ) : (
        <>
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-display font-semibold text-gray-900">
                  {properties.length} Saved {properties.length === 1 ? "Property" : "Properties"}
                </h2>
                <p className="text-gray-600 mt-1">
                  Properties you've saved for future reference
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleClearAll}
                  variant="ghost"
                  icon="Trash2"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <PropertyGrid
            properties={properties}
            onSaveProperty={handleRemoveProperty}
            savedProperties={savedProperties}
          />

          {/* Summary Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Collection Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {properties.length}
                </div>
                <div className="text-gray-600">Total Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  ${Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length / 1000)}K
                </div>
                <div className="text-gray-600">Avg Price</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Math.round(properties.reduce((sum, p) => sum + p.squareFeet, 0) / properties.length).toLocaleString()}
                </div>
                <div className="text-gray-600">Avg Sq Ft</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  ${Math.min(...properties.map(p => p.price)).toLocaleString()}
                </div>
                <div className="text-gray-600">Lowest Price</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedProperties;