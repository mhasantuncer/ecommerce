import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51R8C4xPM6gbdFklFj6fzxCwTseC9Q3KuxFbE0fdeybiy5FHyuIZ3wtLtRmNhcAC9I0B2oczXhwMqtBbIW7eGoKXj00FQRbs6qo'
);

export const initializeStripe = async () => {
  return await stripePromise;
};

export const createCheckoutSession = async (
  cartItems: Array<{
    name: string;
    price: number;
    quantity: number;
  }>
) => {
  const response = await fetch(
    'http://localhost:3000/stripe/create-checkout-session',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: 'sek',
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const { checkout_url } = await response.json();
  return checkout_url;
};
