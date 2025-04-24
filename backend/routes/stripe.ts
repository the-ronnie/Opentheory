import { Router, Request, Response } from "express";
const router = Router();
import * as dotenv from 'dotenv';
dotenv.config();

// Use direct string from environment variable to ensure it's loaded
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { priceId, userId, email, name, phone } = req.body;

    console.log("Price ID:", priceId);
    console.log("User ID:", userId);
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("Phone:", phone);

    // Determine price based on plan type
    let amount = 0;
    let description = '';
    
    if (priceId === 'monthly') {
      amount = 49 * 100; // $49 in cents
      description = 'Monthly subscription with full access';
    } else if (priceId === 'yearly') {
      amount = 499 * 100; // $499 in cents
      description = 'Yearly subscription with full access (15% savings)';
    } else {
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    const session = await stripe.checkout.sessions.create({

      customer_email: email,
      client_reference_id: userId,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${priceId.charAt(0).toUpperCase() + priceId.slice(1)} Subscription`,
            description: description,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/dashboard',
      cancel_url: 'http://localhost:3000/pricing',
      metadata: {
        userId: userId,
        planType: priceId
      }
    });
    console.log("Session ID:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});


router.get('/status/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    // Retrieve the session to check its payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Return payment status and details
    res.json({
      id: session.id,
      status: session.payment_status,
      customer: session.customer_details,
      amountTotal: session.amount_total,
      currency: session.currency,
      metadata: session.metadata
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});


export default router;