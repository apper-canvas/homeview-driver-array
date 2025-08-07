// Saved Property service using Apper Backend

export const savedPropertyService = {
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
          { field: { Name: "property_id_c" } },
          { field: { Name: "saved_date_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('saved_property_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(savedProperty => ({
        Id: savedProperty.Id,
        propertyId: savedProperty.property_id_c?.Id || savedProperty.property_id_c,
        savedDate: savedProperty.saved_date_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching saved properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async save(propertyId) {
    try {
      // Check if already saved first
      const exists = await this.isPropertySaved(propertyId);
      if (exists) {
        throw new Error("Property is already saved");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: `Saved Property ${propertyId}`,
            property_id_c: parseInt(propertyId),
            saved_date_c: new Date().toISOString().split('T')[0]
          }
        ]
      };

      const response = await apperClient.createRecord('saved_property_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to save property ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to save property");
        }
        
        if (successfulRecords.length > 0) {
          const savedRecord = successfulRecords[0].data;
          return {
            Id: savedRecord.Id,
            propertyId: parseInt(propertyId),
            savedDate: savedRecord.saved_date_c
          };
        }
      }

      throw new Error("Failed to save property");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error saving property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async remove(propertyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First find the saved property record
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" } }
        ],
        where: [
          {
            FieldName: "property_id_c",
            Operator: "EqualTo",
            Values: [parseInt(propertyId)]
          }
        ]
      };

      const findResponse = await apperClient.fetchRecords('saved_property_c', params);

      if (!findResponse.success) {
        console.error(findResponse.message);
        throw new Error(findResponse.message);
      }

      if (!findResponse.data || findResponse.data.length === 0) {
        throw new Error("Saved property not found");
      }

      const savedRecord = findResponse.data[0];
      
      // Delete the record
      const deleteParams = {
        RecordIds: [savedRecord.Id]
      };

      const response = await apperClient.deleteRecord('saved_property_c', deleteParams);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete saved property ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to remove saved property");
        }
        
        return {
          Id: savedRecord.Id,
          propertyId: parseInt(propertyId)
        };
      }

      throw new Error("Failed to remove saved property");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing saved property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async isPropertySaved(propertyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } }
        ],
        where: [
          {
            FieldName: "property_id_c",
            Operator: "EqualTo",
            Values: [parseInt(propertyId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('saved_property_c', params);

      if (!response.success) {
        return false;
      }

      return response.data && response.data.length > 0;
    } catch (error) {
      console.error("Error checking if property is saved:", error.message);
      return false;
    }
  }
};