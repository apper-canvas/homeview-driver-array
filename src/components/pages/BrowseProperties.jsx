import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import PropertyFilters from "@/components/organisms/PropertyFilters";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";

const BrowseProperties = () => {
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const [propertiesData, savedData] = await Promise.all([
        propertyService.getAll(),
        savedPropertyService.getAll()
      ]);
      setProperties(propertiesData);
      setSavedProperties(savedData.map(sp => sp.propertyId));
      setFilteredProperties(propertiesData);
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
      const searchFilters = { ...filters, location: searchQuery };
      const results = await propertyService.searchProperties(searchFilters);
      setFilteredProperties(applySorting(results));
    } catch (err) {
      setError(err.message);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = async (newFilters) => {
    try {
      setFilters(newFilters);
      setLoading(true);
      setError("");
      const searchFilters = { ...newFilters, location: searchQuery };
      const results = await propertyService.searchProperties(searchFilters);
      setFilteredProperties(applySorting(results));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applySorting = (propertyList) => {
    const sorted = [...propertyList];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
      case "size":
        return sorted.sort((a, b) => b.squareFeet - a.squareFeet);
      default:
        return sorted;
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setFilteredProperties(applySorting(filteredProperties));
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

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setFilteredProperties(applySorting(properties));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    setFilteredProperties(applySorting(filteredProperties));
  }, [sortBy]);

  if (loading && properties.length === 0) return <Loading />;
  if (error && properties.length === 0) return <Error message={error} onRetry={loadProperties} />;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
          Find Your Perfect Home
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing properties in your desired location with our comprehensive search and filtering tools.
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearFilters}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl shadow-lg p-6">
            <div>
              <h2 className="text-2xl font-display font-semibold text-gray-900">
                {filteredProperties.length} Properties Found
              </h2>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <p className="text-gray-600 mt-1">
                  {searchQuery && `Results for "${searchQuery}"`}
                  {Object.keys(filters).length > 0 && " with active filters"}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="size">Largest First</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <ApperIcon name="Grid3X3" size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <ApperIcon name="List" size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading && <Loading />}
          {error && <Error message={error} onRetry={handleSearch} />}
          {!loading && !error && filteredProperties.length === 0 && (
            <Empty 
              title="No properties found"
              description="Try adjusting your search criteria or filters to find more properties."
              actionText="Clear All Filters"
              onAction={clearFilters}
            />
          )}
          {!loading && !error && filteredProperties.length > 0 && (
            <PropertyGrid
              properties={filteredProperties}
              onSaveProperty={handleSaveProperty}
              savedProperties={savedProperties}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProperties;