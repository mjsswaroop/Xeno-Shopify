import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    immediate = true,
    onSuccess,
    onError,
    transform
  } = options;

  const execute = async (customEndpoint = endpoint, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(customEndpoint, config);
      let result = response.data;
      
      if (transform) {
        result = transform(result);
      }
      
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      console.error(`API Error for ${customEndpoint}:`, err);
      setError(err.response?.data?.error || err.message);
      
      if (onError) {
        onError(err);
      } else {
        toast.error(err.response?.data?.error || 'Failed to fetch data');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && endpoint) {
      execute();
    }
  }, [endpoint, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: () => execute()
  };
};

export const useApiMutation = (endpoint, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    method = 'POST',
    onSuccess,
    onError,
    successMessage,
    transform
  } = options;

  const execute = async (data = {}, customEndpoint = endpoint, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (method.toUpperCase()) {
        case 'POST':
          response = await api.post(customEndpoint, data, config);
          break;
        case 'PUT':
          response = await api.put(customEndpoint, data, config);
          break;
        case 'PATCH':
          response = await api.patch(customEndpoint, data, config);
          break;
        case 'DELETE':
          response = await api.delete(customEndpoint, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      let result = response.data;
      
      if (transform) {
        result = transform(result);
      }
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      console.error(`API Mutation Error for ${customEndpoint}:`, err);
      setError(err.response?.data?.error || err.message);
      
      if (onError) {
        onError(err);
      } else {
        toast.error(err.response?.data?.error || 'Operation failed');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error
  };
};