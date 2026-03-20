export const costPerKg = (totalCost: number, kg: number) =>
  kg > 0 ? totalCost / kg : 0;

export const costPerMeter = (totalCost: number, meters: number) =>
  meters > 0 ? totalCost / meters : 0;

export const effectiveYarn = (totalKg: number, wastageKg: number) =>
  Math.max(0, totalKg - wastageKg);

export const formatINR = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
