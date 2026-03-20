export interface Party {
  id: string;
  name: string;
}

export interface Purchase {
  id: string;
  date: string;
  partyName: string;
  yarnKg: number;
  totalCost: number;
  costPerKg: number;
}

export interface Production {
  id: string;
  date: string;
  purchaseId: string;
  yarnUsedKg: number;
  wastageKg: number;
  clothProducedMeters: number;
  costPerMeter: number;
  effectiveYarnKg: number;
  totalCost: number;
}

export interface Sale {
  id: string;
  date: string;
  partyName: string;
  metersSold: number;
  ratePerMeter: number;
  totalAmount: number;
}

const KEYS = {
  purchases: 'cloth_purchases',
  productions: 'cloth_productions',
  sales: 'cloth_sales',
  parties: 'cloth_parties',
} as const;

function get<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const uid = () => crypto.randomUUID();

// Purchases
export const getPurchases = () => get<Purchase>(KEYS.purchases);
export const addPurchase = (p: Purchase) => {
  const list = getPurchases();
  list.unshift(p);
  save(KEYS.purchases, list);
};
export const deletePurchase = (id: string) => {
  save(KEYS.purchases, getPurchases().filter(p => p.id !== id));
};

// Productions
export const getProductions = () => get<Production>(KEYS.productions);
export const addProduction = (p: Production) => {
  const list = getProductions();
  list.unshift(p);
  save(KEYS.productions, list);
};
export const deleteProduction = (id: string) => {
  save(KEYS.productions, getProductions().filter(p => p.id !== id));
};

// Sales
export const getSales = () => get<Sale>(KEYS.sales);
export const addSale = (s: Sale) => {
  const list = getSales();
  list.unshift(s);
  save(KEYS.sales, list);
};
export const deleteSale = (id: string) => {
  save(KEYS.sales, getSales().filter(s => s.id !== id));
};

// Parties
export const getParties = () => get<Party>(KEYS.parties);
export const addParty = (name: string) => {
  const list = getParties();
  if (!list.find(p => p.name.toLowerCase() === name.toLowerCase())) {
    list.push({ id: uid(), name });
    save(KEYS.parties, list);
  }
};
