const ORDER_PREFIX = "KP";
const SUFFIX_LENGTH = 6;
const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateOrderNumber(): string {
  const now = new Date();

  // Format date as YYYYMMDD using the server's current date.
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;

  // Generate a short uppercase alphanumeric suffix for human-friendly IDs.
  const suffix = Array.from({ length: SUFFIX_LENGTH }, () => {
    const index = Math.floor(Math.random() * ALPHANUMERIC.length);
    return ALPHANUMERIC[index];
  }).join("");

  return `${ORDER_PREFIX}-${datePart}-${suffix}`;
}
