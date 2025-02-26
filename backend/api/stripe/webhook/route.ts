import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '../../../lib/payments/stripe';
import { Request, Response } from 'express';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function handleWebhook(req: Request, res: Response) {
  const payload = req.body;
  const signature = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).json({ error: 'Webhook signature verification failed.' });
  }

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
