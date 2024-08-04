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

  // find the price, assume there is always one
  const price = (await stripe.prices.list()).data[0]

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    setup_intent_data: {
    },
    //line items
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/settings`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/settings`,
  });
  const intent = session.payment_intent
  const url = session.url
  if (!intent && !url) {
    return new Response('Error creating session', { status: 500 });
  }
  return new Response(JSON.stringify({ intent: intent, url: url }));
}
