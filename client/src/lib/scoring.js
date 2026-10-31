const TIERS = [
  { min: 55, bar: 'bg-pricing-blue' },
  { min: 35, bar: 'bg-slate' },
  { min: -Infinity, bar: 'bg-hairline-silver' },
];

export const scoreTier = (score) => TIERS.find((tier) => score >= tier.min);

export const toPercent = (fraction) => Math.round(fraction * 100);
