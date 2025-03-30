import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Validate essential env variables
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
if (!accessTokenSecret) {
  throw new Error(
    'ACCESS_TOKEN_SECRET is not defined in environment variables'
  );
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
import productRouter from './routes/products';
import customerRouter from './routes/customers';
import orderRouter from './routes/orders';
import orderItemRouter from './routes/orderItems';
import authRouter from './routes/auth';
import stripe from 'stripe';
const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/products', productRouter);
app.use('/customers', customerRouter);
app.use('/orders', orderRouter);
app.use('/order-items', orderItemRouter);
app.use('/auth', authRouter);

app.post(
  '/stripe/create-checkout-session',
  async (req: Request, res: Response) => {
    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.body.line_items,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      });

      res.json({ checkout_url: session.url });
    } catch (error) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: 'Checkout creation failed' });
    }
  }
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
});
