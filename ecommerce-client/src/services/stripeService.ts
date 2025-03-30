import { loadStripe } from '@stripe/stripe-js';

interface CreateCheckoutSessionParams {
  order_id: number;
  line_items: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  success_url: string;
  cancel_url: string;
}

const stripePromise = loadStripe(
  'pk_test_51R8C4xPM6gbdFklFj6fzxCwTseC9Q3KuxFbE0fdeybiy5FHyuIZ3wtLtRmNhcAC9I0B2oczXhwMqtBbIW7eGoKXj00FQRbs6qo'
);

export const initializeStripe = async () => {
  return await stripePromise;
};

export const createCheckoutSession = async (
  params: CreateCheckoutSessionParams
) => {
  const response = await fetch(
    'http://localhost:3000/create-checkout-session',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  return response.json() as Promise<{ sessionId: string }>;
};
