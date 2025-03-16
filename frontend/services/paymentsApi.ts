import { api } from './api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface CheckoutSessionRequest {
  priceId: string;
  returnUrl: string;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface CustomerPortalRequest {
  returnUrl: string;
}

export interface CustomerPortalResponse {
  url: string;
}

// Payments API slice
export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => '/stripe/plans',
      providesTags: ['Subscription'],
    }),
    
    createCheckoutSession: builder.mutation<CheckoutSessionResponse, CheckoutSessionRequest>({
      query: (body) => ({
        url: '/stripe/checkout',
        method: 'POST',
        body,
      }),
    }),
    
    createCustomerPortal: builder.mutation<CustomerPortalResponse, CustomerPortalRequest>({
      query: (body) => ({
        url: '/stripe/portal',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useCreateCheckoutSessionMutation,
  useCreateCustomerPortalMutation,
} = paymentsApi;
