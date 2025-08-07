// Property service using Apper Backend

export const propertyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "amenities_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.fetchRecords('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(property => ({
        Id: property.Id,
        title: property.title_c,
        description: property.description_c,
        propertyType: property.property_type_c,
        price: property.price_c,
        address: {
          street: property.address_c || '',
          city: property.location_c || '',
          state: '',
          zipCode: ''
        },
        bedrooms: property.bedrooms_c,
        bathrooms: property.bathrooms_c,
        squareFeet: property.square_feet_c,
        amenities: property.amenities_c ? property.amenities_c.split(',') : [],
        images: property.images_c ? property.images_c.split('\n').filter(img => img.trim()) : [],
        coordinates: {
          lat: property.latitude_c || 0,
          lng: property.longitude_c || 0
        },
        location: property.location_c,
        listingDate: property.CreatedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "amenities_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.getRecordById('property_c', id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Property not found");
      }

      // Transform data to match UI expectations
      const property = response.data;
      return {
        Id: property.Id,
        title: property.title_c,
        description: property.description_c,
        propertyType: property.property_type_c,
        price: property.price_c,
        address: {
          street: property.address_c || '',
          city: property.location_c || '',
          state: '',
          zipCode: ''
        },
        bedrooms: property.bedrooms_c,
        bathrooms: property.bathrooms_c,
        squareFeet: property.square_feet_c,
        features: property.amenities_c ? property.amenities_c.split(',') : [],
        images: property.images_c ? property.images_c.split('\n').filter(img => img.trim()) : [],
        coordinates: {
          lat: property.latitude_c || 0,
          lng: property.longitude_c || 0
        },
        location: property.location_c,
        listingDate: property.CreatedOn
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching property with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async searchProperties(filters) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "amenities_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        where: []
      };

      // Build where conditions based on filters
      if (filters.priceMin) {
        params.where.push({
          FieldName: "price_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin.toString()]
        });
      }
      if (filters.priceMax) {
        params.where.push({
          FieldName: "price_c",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax.toString()]
        });
      }
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        params.where.push({
          FieldName: "property_type_c",
          Operator: "ExactMatch",
          Values: filters.propertyTypes
        });
      }
      if (filters.bedroomsMin) {
        params.where.push({
          FieldName: "bedrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedroomsMin.toString()]
        });
      }
      if (filters.bathroomsMin) {
        params.where.push({
          FieldName: "bathrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathroomsMin.toString()]
        });
      }
      if (filters.squareFeetMin) {
        params.where.push({
          FieldName: "square_feet_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.squareFeetMin.toString()]
        });
      }
      if (filters.location) {
        params.where.push({
          FieldName: "location_c",
          Operator: "Contains",
          Values: [filters.location]
        });
      }

      const response = await apperClient.fetchRecords('property_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(property => ({
        Id: property.Id,
        title: property.title_c,
        description: property.description_c,
        propertyType: property.property_type_c,
        price: property.price_c,
        address: {
          street: property.address_c || '',
          city: property.location_c || '',
          state: '',
          zipCode: ''
        },
        bedrooms: property.bedrooms_c,
        bathrooms: property.bathrooms_c,
        squareFeet: property.square_feet_c,
        amenities: property.amenities_c ? property.amenities_c.split(',') : [],
        images: property.images_c ? property.images_c.split('\n').filter(img => img.trim()) : [],
        coordinates: {
          lat: property.latitude_c || 0,
          lng: property.longitude_c || 0
        },
        location: property.location_c,
        listingDate: property.CreatedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};