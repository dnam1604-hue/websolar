import api from './api';

export const stationService = {
  // Lấy tất cả trạm sạc
  getAll: async (status = null) => {
    try {
      const params = status ? { status } : {};
      const response = await api.get('/stations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  },

  // Lấy trạm sạc theo ID
  getById: async (id) => {
    try {
      const response = await api.get(`/stations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching station by ID:', error);
      throw error;
    }
  },

  // Tạo trạm sạc mới
  create: async (stationData) => {
    try {
      const response = await api.post('/stations', stationData);
      return response.data;
    } catch (error) {
      console.error('Error creating station:', error);
      throw error;
    }
  },

  // Cập nhật trạm sạc
  update: async (id, stationData) => {
    try {
      const response = await api.put(`/stations/${id}`, stationData);
      return response.data;
    } catch (error) {
      console.error('Error updating station:', error);
      throw error;
    }
  },

  // Xóa trạm sạc
  delete: async (id) => {
    try {
      const response = await api.delete(`/stations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting station:', error);
      throw error;
    }
  }
};

