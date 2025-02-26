'use server';

import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '../auth/middleware';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ team: team, priceId: priceId, req: formData });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  return { url: portalSession.url };
});