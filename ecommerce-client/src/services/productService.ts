import axios from 'axios';
import { handleRequest } from './baseService';
import { IProduct, ProductCreate, ProductUpdate } from '../models/IProduct';

const BASE_URL = 'http://localhost:3000/products';

export const fetchAllProducts = async (): Promise<IProduct[]> => {
  return await handleRequest<IProduct[]>(axios.get(BASE_URL));
};

export const fetchProductById = async (id: string): Promise<IProduct> => {
  return await handleRequest<IProduct>(axios.get(`${BASE_URL}/${id}`));
};

export const createProduct = async (payload: ProductCreate) => {
  return await handleRequest(axios.post(BASE_URL, payload));
};

export const updateProduct = async (id: string, payload: ProductUpdate) => {
  return await handleRequest(axios.patch(`${BASE_URL}/${id}`, payload));
};

export const deleteProduct = async (id: string): Promise<void> => {
  return await handleRequest<void>(axios.delete(`${BASE_URL}/${id}`));
};
