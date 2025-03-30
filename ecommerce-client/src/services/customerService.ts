// src/services/customerService.ts
import axios from 'axios';
import { ICustomer, CustomerCreate } from '../models/ICustomer';

const API_BASE_URL = 'http://localhost:3000';

// Check if customer exists by email
export const getCustomerByEmail = async (
  email: string
): Promise<ICustomer | null> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/customers/email/${email}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; // Customer not found
    }
    throw error; // Re-throw other errors
  }
};

// Create new customer (without password)
export const createCustomer = async (
  customerData: CustomerCreate
): Promise<ICustomer> => {
  try {
    // Remove password field if empty (since it's optional in your API)
    const { password, ...data } = customerData;
    const payload = password ? customerData : data;

    const response = await axios.post(`${API_BASE_URL}/customers`, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

// Update customer (optional - for future use)
export const updateCustomer = async (
  id: number,
  customerData: Partial<CustomerCreate>
): Promise<ICustomer> => {
  const response = await axios.patch(
    `${API_BASE_URL}/customers/${id}`,
    customerData
  );
  return response.data;
};

// Customer service with all methods
export const customerService = {
  getByEmail: getCustomerByEmail,
  create: createCustomer,
  update: updateCustomer,
};
