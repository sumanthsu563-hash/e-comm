import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  notifications: 0 // number of unseen status updates
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
      state.notifications = 0; // reset when list refreshed
    },
    addOrder(state, action) {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus(state, action) {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o._id === orderId);
      if (order) {
        order.status = status;
      }
      state.notifications += 1;
    },
    clearNotifications(state) {
      state.notifications = 0;
    }
  }
});

export const { setOrders, addOrder, updateOrderStatus, clearNotifications } = orderSlice.actions;
export default orderSlice.reducer;
