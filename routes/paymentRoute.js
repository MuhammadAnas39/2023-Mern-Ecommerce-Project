import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {
  processPayment,
  sendStripeApiKey,
} from "../controller/paymentController.js";

router.post("/payment/process", verifyToken, processPayment);
router.get("/stripeapikey", verifyToken, sendStripeApiKey);

export default router;
