/**
 * Xử lý URL ảnh - hỗ trợ cả relative path và absolute URL
 * @param {string} imageUrl - URL ảnh (có thể là relative path hoặc absolute URL)
 * @returns {string} - URL đầy đủ để hiển thị ảnh
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // Nếu đã là absolute URL (http/https), trả về nguyên vẹn
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Nếu là relative path (bắt đầu bằng /), thêm base URL
  if (imageUrl.startsWith('/')) {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseURL}${imageUrl}`;
  }
  
  // Trường hợp khác, trả về nguyên vẹn
  return imageUrl;
};

