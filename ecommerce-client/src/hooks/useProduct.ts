import { useCallback, useState } from 'react';
import { IProduct, ProductCreate, ProductUpdate } from '../models/IProduct';
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} from '../services/productService';

export const useProduct = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProductsHandler = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? new Error('Error fetching products')
          : new Error('Unknown error occured')
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductByIdHandler = useCallback(async (id: string) => {
    setIsLoading(true);

    try {
      return await fetchProductById(id);
    } catch (error) {
      setError(
        error instanceof Error
          ? new Error('Error fetching product')
          : new Error('Unknown error occured')
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProductHandler = async (payload: ProductCreate) => {
    setIsLoading(true);
    try {
      return await createProduct(payload);
    } catch (error) {
      setError(
        error instanceof Error
          ? new Error('Error creating product')
          : new Error('Unknown error occured')
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductHandler = async (id: string, payload: ProductUpdate) => {
    setIsLoading(true);
    try {
      return await updateProduct(id, payload);
    } catch (error) {
      setError(
        error instanceof Error
          ? new Error('Error updating product')
          : new Error('Unknown error occured')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProductHandler = async (id: string) => {
    setIsLoading(true);
    try {
      return await deleteProduct(id);
    } catch (error) {
      setError(
        error instanceof Error
          ? new Error('Error deleting product')
          : new Error('Unknown error occcured')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    error,
    fetchProductsHandler,
    fetchProductByIdHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
  };
};
