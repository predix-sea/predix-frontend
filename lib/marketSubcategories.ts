export interface Subcategory {
  value: string;
  labelKey: string;
}

export const SUBCATEGORIES_BY_CATEGORY: Record<string, Subcategory[]> = {
  politics: [
    { value: '', labelKey: 'subcategory.all' },
    { value: 'thailand', labelKey: 'subcategory.thailand' },
    { value: 'indonesia', labelKey: 'subcategory.indonesia' },
    { value: 'philippines', labelKey: 'subcategory.philippines' },
    { value: 'singapore', labelKey: 'subcategory.singapore' },
    { value: 'malaysia', labelKey: 'subcategory.malaysia' },
    { value: 'vietnam', labelKey: 'subcategory.vietnam' },
    { value: 'myanmar', labelKey: 'subcategory.myanmar' },
    { value: 'global-elections', labelKey: 'subcategory.globalElections' },
  ],
  macro: [
    { value: '', labelKey: 'subcategory.all' },
    { value: 'gdp', labelKey: 'subcategory.gdp' },
    { value: 'rates', labelKey: 'subcategory.rates' },
    { value: 'inflation', labelKey: 'subcategory.inflation' },
    { value: 'fx', labelKey: 'subcategory.fx' },
  ],
  crypto: [
    { value: '', labelKey: 'subcategory.all' },
    { value: 'btc', labelKey: 'subcategory.btc' },
    { value: 'eth', labelKey: 'subcategory.eth' },
    { value: 'defi', labelKey: 'subcategory.defi' },
    { value: 'regulation', labelKey: 'subcategory.regulation' },
  ],
  sports: [
    { value: '', labelKey: 'subcategory.all' },
    { value: 'football', labelKey: 'subcategory.football' },
    { value: 'basketball', labelKey: 'subcategory.basketball' },
    { value: 'worldcup', labelKey: 'subcategory.worldcup' },
  ],
  elections: [
    { value: '', labelKey: 'subcategory.all' },
    { value: 'sea', labelKey: 'subcategory.sea' },
    { value: 'local', labelKey: 'subcategory.local' },
  ],
};

export function getSubcategories(category: string): Subcategory[] {
  return SUBCATEGORIES_BY_CATEGORY[category] ?? [{ value: '', labelKey: 'subcategory.all' }];
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}
