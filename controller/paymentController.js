import stripePackage from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = stripePackage(
  "sk_test_51OI90iLfNKSoVgPIvqYjkyAGf6E56vVSIM1GQ3SUp30KiqA2yEO7rSpwKTzjf3r1fFfUFhDLh9M3jBtRYtcA9LNW00QicaDPcO"
);

export const processPayment = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      description: "Payment for your order",
    });

    res
      .status(200)
      .json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

export const sendStripeApiKey = async (req, res) => {
  try {
    res
      .status(200)
      .json({ success: true, stripeApiKey: process.env.STRIPE_API_KEY });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};
