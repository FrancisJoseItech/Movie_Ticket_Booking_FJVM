const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Show = require("../model/showModel");

const createCheckoutSession = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    const show = await Show.findById(showId).populate("movieId");
    if (!show) return res.status(404).json({ message: "Show not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `🎬 ${show.movieId.title}`,
            },
            unit_amount: show.price * 100,
          },
          quantity: seats.length,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?showId=${showId}&seats=${seats.join(",")}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
    });

    console.log("✅ Stripe session created:", session.id);
    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("❌ Stripe session error:", err.message);
    res.status(500).json({ message: "Failed to create Stripe session" });
  }
};

module.exports = { createCheckoutSession };
