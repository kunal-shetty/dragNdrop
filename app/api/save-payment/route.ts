import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      payment_id,
      signature,
      name,
      email,
      phone,
      plan,
      amount,
      deviceId
    } = body;

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RZP_SECRET!)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Supabase server client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVER KEY
    );

    // Store in Supabase
    const { error } = await supabase.from("payments").insert({
      order_id,
      payment_id,
      signature,
      name,
      email,
      phone,
      plan,
      amount,
      deviceId
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
