import axios from 'axios';
import { handleRequest } from './baseService';
import { IOrder, IOrderItem } from '../models/IOrder';

// Create new order
export const createOrder = async (orderData: {
  customer_id: number;
  order_items: IOrderItem[];
}): Promise<{ id: number; message: string }> => {
  const payload = {
    ...orderData,
    payment_status: 'unpaid',
    payment_id: null,
    order_status: 'pending',
  };

  return handleRequest(axios.post('http://localhost:3000/orders', payload));
};

// Update order with Stripe session ID
export const updateOrderWithSessionId = async (
  orderId: number,
  sessionId: string
): Promise<{ message: string }> => {
  return handleRequest(
    axios.patch(`http://localhost:3000/orders/${orderId}`, {
      payment_id: sessionId,
    })
  );
};

// Fetch order by payment ID
export const getOrderByPaymentId = async (
  paymentId: string
): Promise<IOrder> => {
  return handleRequest(
    axios.get(`http://localhost:3000/orders/payment/${paymentId}`)
  );
};
