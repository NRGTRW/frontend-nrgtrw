export const addToCartHandler = async (item) => {
  const response = await fetch("/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart.");
  }
};
