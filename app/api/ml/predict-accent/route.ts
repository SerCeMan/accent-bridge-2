import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { apiHost } from '../../../../services/paths';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')

  const response = await fetch(`${apiHost}/synthesize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authHeader}`,
    },
    body: req.body,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response
}