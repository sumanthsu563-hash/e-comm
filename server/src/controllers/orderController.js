import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getSocketIO } from '../config/socket.js';
import mongoose from 'mongoose';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  const session = await mongoose.startSession();
  let order;

  try {
    await session.withTransaction(async () => {
      const populatedItems = [];
      let calculatedItemsPrice = 0;

      for (const item of items) {
        const product = await Product.findById(item.product).session(session);
        if (!product) {
          throw new ApiError(404, `Product '${item.product}' not found`);
        }

        const reservedProduct = await Product.findOneAndUpdate(
          { _id: product._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );
        if (!reservedProduct) {
          throw new ApiError(400, `Insufficient stock for '${product.title}'`);
        }

        const itemSubtotal = product.price * item.quantity;
        calculatedItemsPrice += itemSubtotal;
        populatedItems.push({
          product: product._id,
          title: product.title,
          price: product.price,
          quantity: item.quantity,
          image: product.images?.[0]?.url || '',
          seller: product.seller,
        });
      }

      const taxPrice = Number((calculatedItemsPrice * 0.05).toFixed(2));
      const shippingPrice = calculatedItemsPrice > 100 ? 0 : 10;
      const totalAmount = Number(
        (calculatedItemsPrice + taxPrice + shippingPrice).toFixed(2)
      );

      [order] = await Order.create(
        [
          {
            user: req.user._id,
            items: populatedItems,
            shippingAddress,
            itemsPrice: calculatedItemsPrice,
            taxPrice,
            shippingPrice,
            totalAmount,
            status: 'pending',
            statusHistory: [
              {
                status: 'pending',
                changedAt: Date.now(),
                changedBy: req.user._id,
              },
            ],
            paymentInfo: { status: 'pending' },
          },
        ],
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        order,
        'Order created successfully. Ready for payment.'
      )
    );
});

// New controller: update order status and emit socket events
// New controller: update order status and emit socket events
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status: newStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const transitions = {
    paid: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
  };
  if (!transitions[order.status]?.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot change an order from '${order.status}' to '${newStatus}'`
    );
  }

  // Append to history and update status
  order.status = newStatus;
  if (newStatus === 'delivered') order.deliveredAt = new Date();
  order.statusHistory.push({
    status: newStatus,
    changedAt: Date.now(),
    changedBy: req.user._id,
  });
  await order.save();

  // Emit socket events to relevant rooms
  try {
    const io = getSocketIO();
    // Notify customer
    if (io)
      io.to(`user_${order.user}`).emit('orderStatusUpdated', {
        orderId: order._id,
        status: newStatus,
      });
    // Notify each seller involved
    const sellerIds = [
      ...new Set(order.items.map((i) => i.seller?.toString())),
    ];
    sellerIds.forEach((sellerId) => {
      if (sellerId && io)
        io.to(`seller_${sellerId}`).emit('orderStatusUpdated', {
          orderId: order._id,
          status: newStatus,
        });
    });
  } catch (err) {
    console.error('Socket.io emit error:', err);
  }

  res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
});

export const getOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  let filter = {};

  if (req.user.role === 'customer') {
    filter = { user: req.user._id };
  } else if (req.user.role === 'seller') {
    // Seller sees orders that include at least one of their items
    filter = { 'items.seller': req.user._id };
  } else if (req.user.role === 'admin') {
    // Admin sees all orders
    filter = {};
  }

  const totalOrders = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        pagination: {
          total: totalOrders,
          page,
          limit,
          totalPages: Math.ceil(totalOrders / limit),
        },
      },
      'Orders retrieved successfully'
    )
  );
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.seller', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Authorization check: Customer owner, sellers with items in order, or Admin
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  const isSellerOfItem = order.items.some(
    (item) => item.seller?._id?.toString() === req.user._id.toString()
  );

  if (!isOwner && !isAdmin && !isSellerOfItem) {
    throw new ApiError(
      403,
      'Forbidden: You do not have permission to view this order'
    );
  }

  res.status(200).json(new ApiResponse(200, order, 'Order details retrieved'));
});
