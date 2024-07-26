import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseClient } from '../../../services/supabase';

export const runtime = 'edge';

function customerOrId(customer: any) {
  if (typeof customer === 'string') {
    return customer
  }
  return customer.id
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }
  const signingSecret = process.env.STRIPE_SIGNING_SECRET as string;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  let event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, signingSecret);
  } catch (error) {
    console.log(error);
    return new Response('Webhook Error', { status: 400 });
  }

  const supabase = supabaseClient;

  switch (event.type) {
    case 'customer.subscription.created':
      await supabase
        .from('profiles')
        .update({
          plan: 'premium',
        })
        .eq('stripe_customer', customerOrId(event.data.object.customer));
      break;
    case 'customer.subscription.deleted':
      await supabase
        .from('profiles')
        .update({
          plan: 'free',
        })
        .eq('stripe_customer', customerOrId(event.data.object.customer));
      break;
  }
}