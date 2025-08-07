import savedPropertiesData from "@/services/mockData/savedProperties.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const savedPropertyService = {
  async getAll() {
    await delay(200);
    return [...savedPropertiesData];
  },

  async save(propertyId) {
    await delay(300);
    const exists = savedPropertiesData.find(sp => sp.propertyId === propertyId);
    if (exists) {
      return { ...exists };
    }

    const newId = Math.max(...savedPropertiesData.map(sp => sp.Id), 0) + 1;
    const newSavedProperty = {
      Id: newId,
      propertyId: propertyId,
      savedDate: new Date().toISOString().split('T')[0]
    };

    savedPropertiesData.push(newSavedProperty);
    return { ...newSavedProperty };
  },

  async remove(propertyId) {
    await delay(300);
    const index = savedPropertiesData.findIndex(sp => sp.propertyId === propertyId);
    if (index > -1) {
      const removed = savedPropertiesData.splice(index, 1)[0];
      return { ...removed };
    }
    throw new Error("Saved property not found");
  },

  async isPropertySaved(propertyId) {
    await delay(100);
    return savedPropertiesData.some(sp => sp.propertyId === propertyId);
  }
};