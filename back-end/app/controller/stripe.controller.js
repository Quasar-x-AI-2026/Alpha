import Stripe from "stripe";

// Create a Stripe Checkout Session
export async function createCheckoutSession(req, res) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return res.status(400).json({
        isSuccess: false,
        message: "Stripe not configured",
      });
    }

    const stripe = new Stripe(secret);

    const {
      providerId,
      renterId,
      spotIndex,
      from,
      to,
      vehicleNo,
      ratePerHour,
    } = req.body || {};

    if (!providerId || !renterId || !from || !to || !ratePerHour) {
      return res.status(400).json({
        isSuccess: false,
        message: "Missing required fields",
      });
    }

    // Compute hours between from and to
    const start = new Date(from);
    const end = new Date(to);
    const ms = end - start;
    if (!isFinite(ms) || ms <= 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid time range",
      });
    }
    const hours = Math.ceil(ms / (1000 * 60 * 60));

    // Convert rupee per hour to smallest currency unit (paise)
    const unitAmount = Math.max(1, Math.round(Number(ratePerHour) * 100) * hours);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Parking Space (${vehicleNo || "Vehicle"})`,
              metadata: {
                providerId,
                renterId,
                spotIndex: String(spotIndex ?? ""),
                from,
                to,
              },
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/rent-space/dashboard/booked`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/rent-space/dashboard`,
      metadata: {
        providerId,
        renterId,
        spotIndex: String(spotIndex ?? ""),
        from,
        to,
        vehicleNo: vehicleNo || "",
      },
    });

    return res.json({ isSuccess: true, id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Payment session creation failed",
    });
  }
}
