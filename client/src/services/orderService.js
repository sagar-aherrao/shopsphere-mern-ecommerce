import api from "./api";

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

export const createOrder = async (
  orderData
) => {
  const response = await api.post(
    "/orders",
    orderData
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get My Orders
|--------------------------------------------------------------------------
*/

export const getMyOrders = async () => {
  const response = await api.get(
    "/orders/my-orders"
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Single Order
|--------------------------------------------------------------------------
*/

export const getOrderById = async (
  orderId
) => {
  const response = await api.get(
    `/orders/${orderId}`
  );

  return response.data;
};