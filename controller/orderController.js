import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export const newOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      itemsPrice,
      orderItems,
      paymentInfo,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await orderModel.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user.id,
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in creating order",
      error: error.message,
    });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting single order",
      error: error.message,
    });
  }
};

export const myOrders = async (req, res) => {
  try {
    const order = await orderModel.find({ user: req.user.id });

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting my orders",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    if (!orders) {
      return res
        .status(400)
        .json({ success: false, message: "order not found" });
    }

    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount = totalAmount + order.totalPrice;
    });

    res.status(200).json({ success: true, totalAmount, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting my orders",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "You have already delivered this order",
      });
    }
    order.orderItems.forEach(async (o) => {
      if (status === "Shipped") {
        const product = await productModel.findById(o.product);
        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }
        product.stock = product.stock - o.quantity;
        await product.save();
      }
    });
    order.orderStatus = status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
    }
    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in updating order status",
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndDelete(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in delete order",
      error: error.message,
    });
  }
};
