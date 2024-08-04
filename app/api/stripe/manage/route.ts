import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const body = await req.json();

  const customerId = body.stripe_customer_id;
  if (!customerId) {
    return new Response('customerId is required', { status: 400 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/settings`,
    customer: customerId,
  });
  return new Response(JSON.stringify({ url: portalSession.url }));
}