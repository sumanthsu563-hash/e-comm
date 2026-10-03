import { createSlice } from '@reduxjs/toolkit';

let initialCartItems = [];
try {
  const saved = localStorage.getItem('cartItems');
  if (saved) initialCartItems = JSON.parse(saved);
} catch (e) {
  initialCartItems = [];
}

let initialShippingAddress = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  phone: ''
};
try {
  const savedAddress = localStorage.getItem('shippingAddress');
  if (savedAddress) initialShippingAddress = JSON.parse(savedAddress);
} catch (e) {
  // Keep default
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: initialCartItems,
    shippingAddress: initialShippingAddress
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.product === product._id
      );

      const maxStock = product.stock || 10;
      const imageUrl =
        product.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30';

      if (existingItemIndex > -1) {
        const newQty = state.cartItems[existingItemIndex].quantity + quantity;
        state.cartItems[existingItemIndex].quantity = Math.min(newQty, maxStock);
      } else {
        state.cartItems.push({
          product: product._id,
          title: product.title,
          price: product.price,
          image: imageUrl,
          stock: maxStock,
          seller: product.seller?._id || product.seller,
          sellerName: product.seller?.name || 'Verified Seller',
          quantity: Math.min(quantity, maxStock)
        });
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== productId
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.product === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  saveShippingAddress,
  clearCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartTotalCount = (state) =>
  state.cart.cartItems.reduce((acc, item) => acc + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

export default cartSlice.reducer;
