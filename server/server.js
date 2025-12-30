import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import Stripe from "stripe";


const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// 🔐 Stripe (SECRET KEY — never in frontend)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ===============================
// 1️⃣ Create Stripe Checkout Session
// ===============================
app.post("/create-checkout-session", async (req, res) => {
  try {
    const PRICE_USD = 3; // 👈 server-controlled price
    const amount = PRICE_USD * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Photo Download",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
    success_url: "https://berlin-365.vercel.app/?session_id={CHECKOUT_SESSION_ID}",
cancel_url: "https://berlin-365.vercel.app/",

    });

    console.log("✅ Stripe session created:", session.id);

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 2️⃣ Secure download (after payment)
// ===============================
app.get("/download", async (req, res) => {
  try {
    const { session_id, url } = req.query;

    if (!session_id || !url) {
      return res.status(403).send("Payment required");
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(403).send("Payment not verified");
    }

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=photo.jpg"
    );

    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("❌ Download error:", err.message);
    res.status(500).send("Download failed");
  }
});
app.get("/", (req, res) => {
  res.send("Berlin-365 backend is live 🚀");
});

// ===============================
// 3️⃣ Start server
// ===============================
const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
