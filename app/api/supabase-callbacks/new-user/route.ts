import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseClient } from '../../../../services/supabase';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  if (req.nextUrl.searchParams.get('secret') !== process.env.API_ROUTE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const jsonBody = await req.json();
  const customer = await stripe.customers.create({
    email: jsonBody.record.email,
  });

  const { data, error } = await supabaseClient
    .from('profiles')
    .update({
      stripe_customer: customer.id,
    })
    .eq('id', jsonBody.record.id);
  if (error) {
    return NextResponse.json({ error: 'error updating profile' });
  }
  return NextResponse.json({ message: `stripe customer created: ${customer.id}` });
}