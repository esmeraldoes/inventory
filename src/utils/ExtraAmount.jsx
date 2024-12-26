export function extractTotalAmount(description) {
    const match = description.match(/Total Amount: (\d+)/);
    return match ? parseFloat(match[1]) : null; // Returns the total amount as a number or null if not found
  }