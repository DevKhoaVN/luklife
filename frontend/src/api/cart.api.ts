import apiClient from "./axios";

// Get cart by user ID
export const getCart = async (userId: number) => {
  const response = await apiClient.post(`/cart`, {
    'user_id': userId
  });
  return response.data;
};



// Add item to cart
export const addToCart = async (data: {
  variantId: number;
  quantity: number;
  cartId: number;
  price:number
}) => {

  const body = {
    variant_id : data.variantId,
    quantity: data.quantity,
    cart_id: data.cartId,
    price: data.price
  }
  const response = await apiClient.post('/cart/items',body );

  return response.data;
};

// Update cart item quantity
export const updateCartQuantity = async (data: {
  cartId: number;
  variantId: number,
  price: number,
  quantity: number;
}) => {
  const response = await apiClient.put(`/cart`, {
    quantity: data.quantity,
    variant_id: data.variantId,
    cart_id: data.cartId,
    price: data.price
  });
  return response.data;
};

// Remove item from cart
export const deleteItemFromCart = async (cartId: number, variantId: number) => {
  const response = await apiClient.post(`/cart/delete`, {
  cart_id: cartId,
  variant_id: variantId
  });
  return response.data;
};


