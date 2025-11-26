import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const quantity = Math.max(1, Math.min(100000, Number(body?.quantity) || 1));

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY is not configured" }, { status: 500 });
    }

    const stripe = new Stripe(secret);

    const origin = req.nextUrl.origin;

    // Pricing logic: base CHF 69.00 per coupon, proportional discount up to 80% at 1000
    const BASE_UNIT_CENTS = 6900; // CHF 69.00
    // Only apply proportional bulk discount starting from 10 units; single-digit orders get no discount
    const eligibleForBulk = quantity >= 10;
    const effectiveQty = eligibleForBulk ? Math.min(1000, quantity) : 0;
    const discount = eligibleForBulk ? Math.min((effectiveQty / 1000) * 0.8, 0.8) : 0;
    const unitCents = Math.round(BASE_UNIT_CENTS * (1 - discount));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: { name: "OmniCheck Coupon" },
            unit_amount: unitCents,
          },
          quantity,
        },
      ],
      success_url: `${origin}/coupons/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/coupons`,
      // You can attach metadata to retrieve later in webhook
      metadata: {
        product: "ki_assistant",
        quantity: String(quantity),
        base_unit_cents: String(BASE_UNIT_CENTS),
        discount: String(discount),
        unit_cents: String(unitCents),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
