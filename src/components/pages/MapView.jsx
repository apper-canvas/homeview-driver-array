import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropertyMap from "@/components/organisms/PropertyMap";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showList, setShowList] = useState(false);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const [propertiesData, savedData] = await Promise.all([
        propertyService.getAll(),
        savedPropertyService.getAll()
      ]);
      setProperties(propertiesData);
      setFilteredProperties(propertiesData);
      setSavedProperties(savedData.map(sp => sp.propertyId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const results = await propertyService.searchProperties({ location: searchQuery });
      setFilteredProperties(results);
      setSelectedProperty(null);
    } catch (err) {
      setError(err.message);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = async (propertyId) => {
    try {
      if (savedProperties.includes(propertyId)) {
        await savedPropertyService.remove(propertyId);
        setSavedProperties(prev => prev.filter(id => id !== propertyId));
        toast.success("Property removed from saved list");
      } else {
        await savedPropertyService.save(propertyId);
        setSavedProperties(prev => [...prev, propertyId]);
        toast.success("Property saved successfully!");
      }
    } catch (err) {
      toast.error("Failed to update saved properties");
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading && properties.length === 0) return <Loading />;
  if (error && properties.length === 0) return <Error message={error} onRetry={loadProperties} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
          Explore Properties on Map
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find properties by location and visualize their positions on an interactive map.
        </p>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search properties by location..."
        />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-gray-600">
            {filteredProperties.length} properties found
            {searchQuery && ` for "${searchQuery}"`}
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setShowList(!showList)}
              variant="secondary"
              icon={showList ? "Map" : "List"}
            >
              {showList ? "Show Map" : "Show List"}
            </Button>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilteredProperties(properties);
                setSelectedProperty(null);
              }}
              variant="ghost"
              icon="RotateCcw"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className={`${showList ? "lg:col-span-2" : "lg:col-span-3"} transition-all duration-300`}>
          {loading && <Loading />}
          {error && <Error message={error} onRetry={handleSearch} />}
          {!loading && !error && (
            <PropertyMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={setSelectedProperty}
            />
          )}
        </div>

        {/* Property List */}
        {showList && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                Property List
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredProperties.map((property) => (
                  <div
                    key={property.Id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedProperty?.Id === property.Id
                        ? "border-primary bg-primary/5"
                        : "border-gray-100 hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="flex gap-3">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {property.title}
                        </h4>
                        <p className="text-primary font-semibold">
                          ${property.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{property.bedrooms} bed</span>
                          <span>{property.bathrooms} bath</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveProperty(property.Id);
                        }}
                        className={`p-1 rounded transition-colors ${
                          savedProperties.includes(property.Id)
                            ? "text-accent"
                            : "text-gray-400 hover:text-accent"
                        }`}
                      >
                        <ApperIcon 
                          name="Heart" 
                          size={16} 
                          fill={savedProperties.includes(property.Id) ? "currentColor" : "none"} 
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;