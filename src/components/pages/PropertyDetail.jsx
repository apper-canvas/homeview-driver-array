import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PropertyStats from "@/components/molecules/PropertyStats";
import ImageGallery from "@/components/molecules/ImageGallery";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");
      const [propertyData, savedStatus] = await Promise.all([
        propertyService.getById(id),
        savedPropertyService.isPropertySaved(parseInt(id))
      ]);
      setProperty(propertyData);
      setIsSaved(savedStatus);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = async () => {
    try {
      if (isSaved) {
        await savedPropertyService.remove(parseInt(id));
        setIsSaved(false);
        toast.success("Property removed from saved list");
      } else {
        await savedPropertyService.save(parseInt(id));
        setIsSaved(true);
        toast.success("Property saved successfully!");
      }
    } catch (err) {
      toast.error("Failed to update saved properties");
    }
  };

  const handleScheduleTour = () => {
    toast.success("Tour request sent! An agent will contact you soon.");
  };

  const handleContactAgent = () => {
    setShowContactForm(true);
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProperty} />;
  if (!property) return <Error message="Property not found" />;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        icon="ArrowLeft"
        className="mb-4"
      >
        Back to Properties
      </Button>

      {/* Property Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">{property.propertyType}</Badge>
              <span className="text-sm text-gray-500">
                Listed on {new Date(property.listingDate).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <ApperIcon name="MapPin" size={20} />
              <span className="text-lg">
                {property.address.street}
                {property.address.unit && `, ${property.address.unit}`}
                <br />
                {property.address.city}, {property.address.state} {property.address.zipCode}
              </span>
            </div>
            <div className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
              ${property.price.toLocaleString()}
            </div>
            <PropertyStats
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              squareFeet={property.squareFeet}
              className="text-lg"
            />
          </div>
          
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <Button
              onClick={handleSaveProperty}
              variant={isSaved ? "accent" : "secondary"}
              icon="Heart"
              className="w-full lg:w-48"
            >
              {isSaved ? "Saved" : "Save Property"}
            </Button>
            <Button
              onClick={handleScheduleTour}
              variant="primary"
              icon="Calendar"
              className="w-full lg:w-48"
            >
              Schedule Tour
            </Button>
            <Button
              onClick={handleContactAgent}
              variant="secondary"
              icon="Phone"
              className="w-full lg:w-48"
            >
              Contact Agent
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Image Gallery */}
        <div className="lg:col-span-2">
          <ImageGallery images={property.images} title={property.title} />
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
              About This Property
            </h3>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Key Features
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {property.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Property Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Property Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Property Type</span>
                <span className="font-medium">{property.propertyType}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Bedrooms</span>
                <span className="font-medium">{property.bedrooms}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Bathrooms</span>
                <span className="font-medium">{property.bathrooms}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Square Feet</span>
                <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Price per sq ft</span>
                <span className="font-medium">
                  ${Math.round(property.price / property.squareFeet).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold">Contact Agent</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="I'm interested in this property..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowContactForm(false);
                    toast.success("Message sent! An agent will contact you soon.");
                  }}
                  variant="primary"
                  className="flex-1"
                >
                  Send Message
                </Button>
                <Button
                  onClick={() => setShowContactForm(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;