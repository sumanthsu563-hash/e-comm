import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getRazorpayInstance,
  isMockPaymentAllowed,
  isRazorpayConfigured,
  verifyRazorpaySignature,
} from '../config/razorpay.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Ensure customer owns order
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Forbidden: You do not own this order');
  }

  if (order.status !== 'pending') {
    throw new ApiError(400, 'Only pending orders can be paid');
  }

  // Amount in smallest currency unit (paise for INR)
  const amountInPaise = Math.round(order.totalAmount * 100);

  if (isRazorpayConfigured()) {
    const razorpay = getRazorpayInstance();
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_order_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    };

    const rzpOrder = await razorpay.orders.create(options);

    order.paymentInfo.razorpayOrderId = rzpOrder.id;
    await order.save({ validateBeforeSave: false });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          razorpayOrderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
        'Razorpay order created'
      )
    );
  }

  if (!isMockPaymentAllowed()) {
    throw new ApiError(503, 'Payments are unavailable until Razorpay is configured');
  }

  // Mock payment support exists only for automated tests.
  const mockRzpOrderId = `order_mock_${Date.now()}`;
  order.paymentInfo.razorpayOrderId = mockRzpOrderId;
  await order.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        razorpayOrderId: mockRzpOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_id',
        isMock: true,
      },
      'Razorpay order created (simulation mode)'
    )
  );
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    req.body;

  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You do not own this order');
  }

  if (order.status !== 'pending') {
    throw new ApiError(400, 'Only pending orders can be paid');
  }

  if (order.paymentInfo?.razorpayOrderId !== razorpayOrderId) {
    throw new ApiError(400, 'Payment order does not match this order');
  }

  const isValid = verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValid) {
    order.paymentInfo.status = 'failed';
    await order.save({ validateBeforeSave: false });
    throw new ApiError(400, 'Payment signature verification failed');
  }

  // Update order status to paid
  order.status = 'paid';
  order.paidAt = new Date();
  order.paymentInfo = {
    id: razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    status: 'completed',
  };

  await order.save({ validateBeforeSave: false });

  // Send confirmation email (non-blocking)
  sendOrderConfirmationEmail({ order, user: order.user });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        'Payment verified successfully and order marked as paid'
      )
    );
});
