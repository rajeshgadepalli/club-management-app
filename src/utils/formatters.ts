
export const formatQuantity = (quantity: number): string => {
  return `${quantity} cans`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const getFullName = (
  firstName: string | null,
  lastName: string | null
): string => {
  const trimmedFirstName = firstName ? firstName.trim() : "";
  const trimmedLastName = lastName ? lastName.trim() : "";

  return `${trimmedFirstName} ${trimmedLastName}`.trim();
};
