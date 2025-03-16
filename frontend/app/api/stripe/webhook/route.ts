import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Use the appropriate API version
});

// The webhook endpoint that Stripe will call
export async function POST(request: Request) {
  try {
    // Get the raw request body as text for signature verification
    const text = await request.text();
    
    // Get the Stripe signature from the request header
    const signature = request.headers.get('stripe-signature') || '';
    
    // Verify the webhook event
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        text,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { message: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Forward the verified event to the backend for processing
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': signature,
      },
      body: text,
    });

    if (!backendResponse.ok) {
      console.error('Error forwarding webhook to backend:', await backendResponse.text());
      return NextResponse.json(
        { message: 'Error processing webhook' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Webhook error' },
      { status: 500 }
    );
  }
}

// Configure to accept raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
