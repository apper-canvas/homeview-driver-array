import propertiesData from "@/services/mockData/properties.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getAll() {
    await delay(300);
    return [...propertiesData];
  },

  async getById(id) {
    await delay(200);
    const property = propertiesData.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  },

  async searchProperties(filters) {
    await delay(400);
    let filtered = [...propertiesData];

    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType));
    }
    if (filters.bedroomsMin) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    if (filters.squareFeetMin) {
      filtered = filtered.filter(p => p.squareFeet >= filters.squareFeetMin);
    }
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(p => 
        p.address.city.toLowerCase().includes(location) ||
        p.address.state.toLowerCase().includes(location) ||
        p.title.toLowerCase().includes(location)
      );
    }

    return filtered;
  }
};