import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/newsService';
import { stationService } from '../services/stationService';
import { productService } from '../services/productService';

const CmsContext = createContext();

export const CmsProvider = ({ children }) => {
  const [cmsData, setCmsData] = useState({
    news: [],
    stations: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [newsResponse, stationsResponse, productsResponse] = await Promise.all([
        newsService.getAll('published'),
        stationService.getAll(),
        productService.getAll('active')
      ]);

      setCmsData({
        news: newsResponse.data || [],
        stations: stationsResponse.data || [],
        products: productsResponse.data || [],
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Lỗi khi tải dữ liệu');
      console.error('Error loading CMS data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNews = useCallback(async (entry) => {
    try {
      setLoading(true);
      const response = await newsService.create(entry);
      if (response.success) {
        // Reload news after creation
        const newsResponse = await newsService.getAll('published');
        setCmsData((prev) => ({
          ...prev,
          news: newsResponse.data || [],
        }));
      }
      return response;
    } catch (error) {
      setError(error.response?.data?.error || 'Lỗi khi thêm tin tức');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addStation = useCallback(async (entry) => {
    try {
      setLoading(true);
      const response = await stationService.create(entry);
      if (response.success) {
        // Reload stations after creation
        const stationsResponse = await stationService.getAll();
        setCmsData((prev) => ({
          ...prev,
          stations: stationsResponse.data || [],
        }));
      }
      return response;
    } catch (error) {
      setError(error.response?.data?.error || 'Lỗi khi thêm trạm sạc');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (entry) => {
    try {
      setLoading(true);
      const response = await productService.create(entry);
      if (response.success) {
        // Reload products after creation
        const productsResponse = await productService.getAll();
        setCmsData((prev) => ({
          ...prev,
          products: productsResponse.data || [],
        }));
      }
      return response;
    } catch (error) {
      setError(error.response?.data?.error || 'Lỗi khi thêm sản phẩm');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, [loadData]);

  const value = useMemo(
    () => ({
      cmsData,
      loading,
      error,
      addNews,
      addStation,
      addProduct,
      loadData,
    }),
    [cmsData, loading, error, addNews, addStation, addProduct, loadData]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
};

export const useCms = () => useContext(CmsContext);

