import express from "express";
import { isAdmin, verifyToken } from "../middleware/verifyToken.js";
import {
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  myOrders,
  newOrder,
  updateOrderStatus,
} from "../controller/orderController.js";

const router = express.Router();

router.post("/order/new", verifyToken, newOrder);
router.get("/order/:id", verifyToken, getSingleOrder);
router.get("/myorders", verifyToken, myOrders);

router.get("/orders", verifyToken, isAdmin, getAllOrders);
router.put("/update/:id", verifyToken, isAdmin, updateOrderStatus);
router.delete("/delete/:id", verifyToken, isAdmin, deleteOrder);

export default router;
