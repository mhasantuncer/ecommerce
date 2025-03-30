// src/services/stripeWebhookService.ts
import { updateOrder } from './orderService';

interface StripeCheckoutSessionCompletedEvent {
  type: 'checkout.session.completed';
  data: {
    object: {
      id: string;
      metadata: {
        order_id: string;
      };
    };
  };
}

export const handleStripeWebhook = async (
  event: StripeCheckoutSessionCompletedEvent
) => {
  const session = event.data.object;
  const orderId = parseInt(session.metadata.order_id, 10);

  try {
    // Update order status to "paid"
    await updateOrder(orderId, {
      payment_status: 'paid',
      payment_id: session.id,
      order_status: 'processing',
    });

    return { success: true };
  } catch (error) {
    console.error('Webhook processing failed:', error);
    throw error;
  }
};
