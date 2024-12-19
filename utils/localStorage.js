export const getOrders = () => {
  if (typeof window === "undefined") return [];
  const orders = localStorage.getItem("orders");
  return orders ? JSON.parse(orders) : [];
};

export const saveOrder = (order) => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const updateOrder = (updatedOrder) => {
  const orders = getOrders();
  const index = orders.findIndex((order) => order.id === updatedOrder.id);
  if (index !== -1) {
    orders[index] = updatedOrder;
    localStorage.setItem("orders", JSON.stringify(orders));
  }
};

export const deleteOrder = (id) => {
  const orders = getOrders();
  const updatedOrders = orders.filter((order) => order.id !== id);
  localStorage.setItem("orders", JSON.stringify(updatedOrders));
};
