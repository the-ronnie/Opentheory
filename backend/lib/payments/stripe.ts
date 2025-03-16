// import Stripe from 'stripe';
// import { Team } from '../db/schema';
// import {
//   getTeamByStripeCustomerId,
//   getUser,
//   updateTeamSubscription
// } from '../db/queries';

// let stripe: any;

// try {
//   if (process.env.STRIPE_SECRET_KEY) {
//     stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//       apiVersion: '2025-01-27.acacia'
//     });
//   } else {
//     console.warn('⚠️ STRIPE_SECRET_KEY not found in environment variables. Stripe functionality will be disabled.');
//     // Create a mock Stripe object with no-op functions
//     stripe = {
//       checkout: { sessions: { create: async () => ({ url: '#' }) } },
//       webhooks: { constructEvent: () => ({ type: 'mock', data: { object: {} } }) },
//       billingPortal: {
//         configurations: { list: async () => ({ data: [] }), create: async () => ({}) },
//         sessions: { create: async () => ({}) }
//       },
//       products: { retrieve: async () => ({}), list: async () => ({ data: [] }) },
//       prices: { list: async () => ({ data: [] }) }
//     };
//   }
// } catch (error) {
//   console.error('Failed to initialize Stripe:', error);
//   // Same mock object as above
//   stripe = {
//     checkout: { sessions: { create: async () => ({ url: '#' }) } },
//     webhooks: { constructEvent: () => ({ type: 'mock', data: { object: {} } }) },
//     billingPortal: {
//       configurations: { list: async () => ({ data: [] }), create: async () => ({}) },
//       sessions: { create: async () => ({}) }
//     },
//     products: { retrieve: async () => ({}), list: async () => ({ data: [] }) },
//     prices: { list: async () => ({ data: [] }) }
//   };
// }

// export { stripe };

// // Modify other functions to handle possible missing Stripe functionality
// export async function createCheckoutSession({
//   team,
//   priceId,
//   req
// }: {
//   team: Team | null;
//   priceId: string;
//   req: any;
// }) {
//   if (!process.env.STRIPE_SECRET_KEY) {
//     console.warn('Stripe functionality disabled: Cannot create checkout session');
//     return '#';
//   }
  
//   const user = await getUser(req);

//   if (!team || !user) {
//     throw new Error('Team or user not found');
//   }

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1
//         }
//       ],
//       mode: 'subscription',
//       success_url: `${process.env.BASE_URL || 'http://localhost:3000'}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.BASE_URL || 'http://localhost:3000'}/pricing`,
//       customer: team.stripeCustomerId || undefined,
//       client_reference_id: user.id.toString(),
//       allow_promotion_codes: true,
//       subscription_data: {
//         trial_period_days: 14
//       }
//     });

//     return session.url;
//   } catch (error) {
//     console.error('Stripe checkout session creation failed:', error);
//     return '#';
//   }
// }

// // Make similar changes to other exported functions
// export async function createCustomerPortalSession(team: Team) {
//   if (!process.env.STRIPE_SECRET_KEY) {
//     console.warn('Stripe functionality disabled: Cannot create customer portal session');
//     return { url: '#' };
//   }
  
//   // Rest of the function...
//   // Add try/catch blocks to handle errors gracefully
//   try {
//     // existing code...
//     if (!team.stripeCustomerId || !team.stripeProductId) {
//       throw new Error('Team Stripe customer or product ID not found');
//     }

//     let configuration: any;
//     const configurations = await stripe.billingPortal.configurations.list();
    
//     // ... rest of the existing function
    
//     return stripe.billingPortal.sessions.create({
//       customer: team.stripeCustomerId,
//       return_url: `${process.env.BASE_URL || 'http://localhost:3000'}/dashboard`,
//       configuration: configuration.id
//     });
//   } catch (error) {
//     console.error('Stripe portal session creation failed:', error);
//     return { url: '#' };
//   }
// }

// export async function handleSubscriptionChange(
//   subscription: any
// ) {
//   if (!process.env.STRIPE_SECRET_KEY) {
//     console.warn('Stripe functionality disabled: Cannot handle subscription change');
//     return;
//   }
  
//   try {
//     const customerId = subscription.customer as string;
//     const subscriptionId = subscription.id;
//     const status = subscription.status;

//     const team = await getTeamByStripeCustomerId(customerId);

//     if (!team) {
//       console.error('Team not found for Stripe customer:', customerId);
//       return;
//     }

//     if (status === 'active' || status === 'trialing') {
//       const plan = subscription.items.data[0]?.plan;
//       await updateTeamSubscription(team.id, {
//         stripeSubscriptionId: subscriptionId,
//         stripeProductId: plan?.product as string,
//         planName: (plan?.product as any).name,
//         subscriptionStatus: status
//       });
//     } else if (status === 'canceled' || status === 'unpaid') {
//       await updateTeamSubscription(team.id, {
//         stripeSubscriptionId: null,
//         stripeProductId: null,
//         planName: null,
//         subscriptionStatus: status
//       });
//     }
//   } catch (error) {
//     console.error('Error handling subscription change:', error);
//   }
// }

// export async function getStripePrices() {
//   if (!process.env.STRIPE_SECRET_KEY) {
//     console.warn('Stripe functionality disabled: Cannot get prices');
//     return [];
//   }
  
//   try {
//     const prices = await stripe.prices.list({
//       expand: ['data.product'],
//       active: true,
//       type: 'recurring'
//     });

//     return prices.data.map((price: any) => ({
//       id: price.id,
//       productId:
//         typeof price.product === 'string' ? price.product : price.product.id,
//       unitAmount: price.unit_amount,
//       currency: price.currency,
//       interval: price.recurring?.interval,
//       trialPeriodDays: price.recurring?.trial_period_days
//     }));
//   } catch (error) {
//     console.error('Error getting Stripe prices:', error);
//     return [];
//   }
// }

// export async function getStripeProducts() {
//   if (!process.env.STRIPE_SECRET_KEY) {
//     console.warn('Stripe functionality disabled: Cannot get products');
//     return [];
//   }
  
//   try {
//     const products = await stripe.products.list({
//       active: true,
//       expand: ['data.default_price']
//     });

//     return products.data.map((product: any) => ({
//       id: product.id,
//       name: product.name,
//       description: product.description,
//       defaultPriceId:
//         typeof product.default_price === 'string'
//           ? product.default_price
//           : product.default_price?.id
//     }));
//   } catch (error) {
//     console.error('Error getting Stripe products:', error);
//     return [];
//   }
// }