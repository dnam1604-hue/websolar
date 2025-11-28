import api from './api';

export const contactService = {
  // Lấy tất cả liên hệ (cho admin)
  getAll: async (status = null, type = null) => {
    try {
      const params = {};
      if (status) params.status = status;
      if (type) params.type = type;
      
      const response = await api.get('/contacts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Lấy liên hệ theo ID
  getById: async (id) => {
    try {
      const response = await api.get(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact by ID:', error);
      throw error;
    }
  },

  // Tạo liên hệ mới (public endpoint)
  create: async (contactData) => {
    try {
      const response = await api.post('/contacts', contactData);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái liên hệ (cho admin)
  update: async (id, contactData) => {
    try {
      const response = await api.put(`/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Xóa liên hệ
  delete: async (id) => {
    try {
      const response = await api.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
};

