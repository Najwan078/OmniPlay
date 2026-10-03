/**
 * OmniPlay Cloud Computing - Financial Architecture & Business Model Engine
 * 
 * Implements academic project financial projection, multi-revenue modeling,
 * weighted GPU tier calculations, dynamic pricing, and transaction audit management.
 */

export interface OpexBreakdown {
  facilityColocation: number; // 6 Data Centers (Jakarta, Singapore, Tokyo, Frankfurt, London, California)
  electricityPower: number;   // 12 High-TDP GPUs + AMD EPYC/Intel Xeon servers
  bandwidthPeering: number;   // Dedicated 10Gbps low-latency IX peering
  hardwareMaintenance: number;// Preventive maintenance & GPU depreciation
  cloudStorageSan: number;    // Multi-region SAN NVMe & S3 backup cold vault
  securityDdos: number;       // Cloudflare Enterprise Layer 7 & VAC Shield
  officeOperations: number;   // NOC Support, admin, and operational overhead
}

export interface GpuPricingConfig {
  rtx4070Gaming: number;  // Default: Rp59.000 / hr
  rtx4080Gaming: number;  // Default: Rp79.000 / hr
  rtx4090Gaming: number;  // Default: Rp109.000 / hr

  rtx4070Compute: number; // Default: Rp49.000 / GPU-hr
  rtx4080Compute: number; // Default: Rp69.000 / GPU-hr
  rtx4090Compute: number; // Default: Rp89.000 / GPU-hr

  // Bundles & Passes
  bundle5hDiscountPct: number;  // e.g. ~5.5% discount
  bundle10hDiscountPct: number; // e.g. ~10-13% discount
  
  dayPass4070: number; // Rp499.000
  dayPass4080: number; // Rp699.000
  dayPass4090: number; // Rp899.000

  // Dynamic Pricing
  peakMarkupPct: number;    // +15% (17:00 - 23:00)
  offPeakDiscountPct: number;// -10% (23:00 - 08:00)

  // Subscriptions
  subProMonthly: number;    // Rp699.000 / mo
  subUltraMonthly: number;  // Rp1.199.000 / mo

  // Premium Add-ons
  addonPriorityQueue: number;   // Rp15.000 / session
  addonExtraPlaytime: number;   // Rp20.000 / hr
  addonCloudStorage: number;    // Rp25.000 / mo
  addonPremiumSupport: number;  // Rp49.000 / mo

  // Cost Control
  idleTimeoutMinutes: number;   // Default 10 min
  autoStopIdle: boolean;
  preventOverbooking: boolean;
  nearestNodeRouting: boolean;

  // Convenience group objects
  addOns: {
    priorityQueue: number;
    extraPlaytime: number;
    extraCloudStorage: number;
    premiumSupport: number;
  };
  cloudCompute: {
    'RTX 4070': number;
    'RTX 4080': number;
    'RTX 4090': number;
  };
}

export interface FinancialConfig {
  initialInvestment: number; // Rp1.320.000.000
  opex: OpexBreakdown;
  pricing: GpuPricingConfig;
}

export interface CloudCenterNode {
  id: string;
  location: string;
  country: string;
  flag: string;
  gpuModel: 'RTX 4070' | 'RTX 4080' | 'RTX 4090';
  gpuCount: number;
  cpuSpec: string;
  nvmeCapacity: string;
}

export const OMNIPLAY_FLEET: CloudCenterNode[] = [
  { id: 'JK-01', location: 'Jakarta', country: 'Indonesia', flag: '🇮🇩', gpuModel: 'RTX 4070', gpuCount: 2, cpuSpec: 'AMD EPYC 7763', nvmeCapacity: '2.4 TB Gen5' },
  { id: 'SG-01', location: 'Singapore', country: 'Singapore', flag: '🇸🇬', gpuModel: 'RTX 4080', gpuCount: 2, cpuSpec: 'Intel Xeon Plat 8380', nvmeCapacity: '3.8 TB Gen5' },
  { id: 'TY-01', location: 'Tokyo', country: 'Japan', flag: '🇯🇵', gpuModel: 'RTX 4090', gpuCount: 2, cpuSpec: 'AMD EPYC 9654 Genoa', nvmeCapacity: '4.2 TB Gen5' },
  { id: 'EU-02', location: 'Frankfurt', country: 'Germany', flag: '🇩🇪', gpuModel: 'RTX 4080', gpuCount: 2, cpuSpec: 'AMD EPYC 7763', nvmeCapacity: '4.0 TB Gen5' },
  { id: 'EU-01', location: 'London', country: 'United Kingdom', flag: '🇬🇧', gpuModel: 'RTX 4090', gpuCount: 2, cpuSpec: 'Intel Xeon Plat 8480+', nvmeCapacity: '6.0 TB Gen5' },
  { id: 'US-01', location: 'California', country: 'United States', flag: '🇺🇸', gpuModel: 'RTX 4090', gpuCount: 2, cpuSpec: 'AMD EPYC 9654 Genoa', nvmeCapacity: '8.0 TB Gen5' },
];

export const TOTAL_GPUS = OMNIPLAY_FLEET.reduce((sum, n) => sum + n.gpuCount, 0); // 12 GPUs
export const MONTHLY_HOURS_PER_GPU = 24 * 30; // 720 hours
export const TOTAL_THEORETICAL_CAPACITY = TOTAL_GPUS * MONTHLY_HOURS_PER_GPU; // 8,640 GPU-hours/month

export const DEFAULT_OPEX: OpexBreakdown = {
  facilityColocation: 120_000_000,
  electricityPower: 85_000_000,
  bandwidthPeering: 65_000_000,
  hardwareMaintenance: 42_000_000,
  cloudStorageSan: 28_000_000,
  securityDdos: 24_000_000,
  officeOperations: 35_000_000,
};

export const DEFAULT_PRICING: GpuPricingConfig = {
  rtx4070Gaming: 59_000,
  rtx4080Gaming: 79_000,
  rtx4090Gaming: 109_000,

  rtx4070Compute: 49_000,
  rtx4080Compute: 69_000,
  rtx4090Compute: 89_000,

  bundle5hDiscountPct: 5.5,
  bundle10hDiscountPct: 12.0,

  dayPass4070: 499_000,
  dayPass4080: 699_000,
  dayPass4090: 899_000,

  peakMarkupPct: 15,
  offPeakDiscountPct: 10,

  subProMonthly: 699_000,
  subUltraMonthly: 1_199_000,

  addonPriorityQueue: 15_000,
  addonExtraPlaytime: 20_000,
  addonCloudStorage: 25_000,
  addonPremiumSupport: 49_000,

  idleTimeoutMinutes: 10,
  autoStopIdle: true,
  preventOverbooking: true,
  nearestNodeRouting: true,

  addOns: {
    priorityQueue: 15_000,
    extraPlaytime: 20_000,
    extraCloudStorage: 25_000,
    premiumSupport: 49_000,
  },
  cloudCompute: {
    'RTX 4070': 49_000,
    'RTX 4080': 69_000,
    'RTX 4090': 89_000,
  },
};

export const DEFAULT_FINANCIAL_CONFIG: FinancialConfig = {
  initialInvestment: 1_320_000_000, // ± Rp1.320.000.000
  opex: DEFAULT_OPEX,
  pricing: DEFAULT_PRICING,
};

export interface RegionalFinancialResult {
  nodeId: string;
  location: string;
  flag: string;
  gpuModel: string;
  gpuCount: number;
  capacityHours: number;
  soldHours: number;
  utilizationPct: number;
  gamingRevenue: number;
  computeRevenue: number;
  otherRevenueShare: number;
  totalRevenue: number;
  allocatedOpex: number;
  operatingProfit: number;
  marginPct: number;
}

export interface SimulationResult {
  scenarioName: string;
  utilizationRate: number; // e.g. 0.75 for 75%
  soldCapacityHours: number; // 6,480 hrs at 75%
  
  // Hours breakdown
  gamingHours: number;  // ~55% of total capacity = 4,752 hrs
  computeHours: number; // ~20% of total capacity = 1,728 hrs
  reservedHours: number;// ~25% buffer = 2,160 hrs

  // Revenue Streams
  gamingRevenue: number;
  computeRevenue: number;
  subscriptionRevenue: number;
  addonRevenue: number;
  totalMonthlyRevenue: number;

  // GPU Tier Breakdown
  gpuTierRevenue: {
    rtx4070: { count: number; hours: number; gamingRev: number; computeRev: number; totalRev: number };
    rtx4080: { count: number; hours: number; gamingRev: number; computeRev: number; totalRev: number };
    rtx4090: { count: number; hours: number; gamingRev: number; computeRev: number; totalRev: number };
  };

  // Cost & Profitability
  monthlyOpex: number;
  operatingProfit: number;
  operatingMarginPct: number;
  revenuePerGpuHour: number;
  breakEvenRevenue: number;
  breakEvenUtilizationPct: number;

  annualRevenue: number;
  annualOperatingProfit: number;

  // Regional breakdown
  regions: RegionalFinancialResult[];
}

export interface TransactionRecord {
  id: string;
  user: string;
  itemTitle: string;
  category: 'Gaming' | 'Compute' | 'Subscription' | 'Add-on';
  nodeId: string;
  nodeName: string;
  gpuTier: string;
  durationHours: number;
  amountIdr: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  rentalStatus: 'ACTIVE' | 'COMPLETED' | 'PROVISIONED';
  isDemo: boolean;
  date: string;
  metadata?: Record<string, any>;
}

const CONFIG_STORAGE_KEY = 'omniplay_financial_config_v2';
const TRANSACTIONS_STORAGE_KEY = 'omniplay_transactions_v2';

/**
 * Load persisted financial configuration or fallback to defaults
 */
export function getFinancialConfig(): FinancialConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        initialInvestment: parsed.initialInvestment || DEFAULT_FINANCIAL_CONFIG.initialInvestment,
        opex: { ...DEFAULT_OPEX, ...(parsed.opex || {}) },
        pricing: { ...DEFAULT_PRICING, ...(parsed.pricing || {}) },
      };
    }
  } catch (e) {
    console.warn('Error reading financial config from storage:', e);
  }
  return DEFAULT_FINANCIAL_CONFIG;
}

/**
 * Save updated financial configuration to storage
 */
export function saveFinancialConfig(config: FinancialConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('omni:financial_config_updated'));
  } catch (e) {
    console.error('Error saving financial config:', e);
  }
}

/**
 * Reset financial configuration to default academic estimates
 */
export function resetFinancialConfig(): FinancialConfig {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  window.dispatchEvent(new Event('omni:financial_config_updated'));
  return DEFAULT_FINANCIAL_CONFIG;
}

/**
 * Calculate total monthly OPEX
 */
export function getTotalOpex(opex: OpexBreakdown): number {
  return (
    opex.facilityColocation +
    opex.electricityPower +
    opex.bandwidthPeering +
    opex.hardwareMaintenance +
    opex.cloudStorageSan +
    opex.securityDdos +
    opex.officeOperations
  );
}

/**
 * Calculate Financial Simulation across all revenue streams & GPU tiers
 */
export function runFinancialSimulation(
  config: FinancialConfig = getFinancialConfig(),
  utilizationRate: number = 0.75, // Default Base Scenario: 75%
  scenarioName: string = 'Base Scenario (75% Utilization)'
): SimulationResult {
  const { opex, pricing } = config;
  const totalMonthlyOpex = getTotalOpex(opex);

  // Capacity calculations
  const totalCapacity = TOTAL_THEORETICAL_CAPACITY; // 8,640 hrs
  const soldCapacityHours = Math.round(totalCapacity * utilizationRate);

  // Allocation targets:
  // In Base (75%): Gaming is 55% of capacity (4,752h), Compute is 20% (1,728h), Reserved is 25% (2,160h).
  // Scaled proportionally for other utilization rates.
  const gamingShareOfCapacity = (55 / 75) * utilizationRate;
  const computeShareOfCapacity = (20 / 75) * utilizationRate;

  const gamingHours = Math.round(totalCapacity * gamingShareOfCapacity);
  const computeHours = Math.round(totalCapacity * computeShareOfCapacity);
  const reservedHours = totalCapacity - gamingHours - computeHours;

  // GPU Tier Distribution:
  // RTX 4070: 2 GPUs (2/12 = 16.6667%)
  // RTX 4080: 4 GPUs (4/12 = 33.3333%)
  // RTX 4090: 6 GPUs (6/12 = 50.0000%)
  const g4070Ratio = 2 / 12;
  const g4080Ratio = 4 / 12;
  const g4090Ratio = 6 / 12;

  // Gaming Hours per GPU Tier
  const gamingHours4070 = Math.round(gamingHours * g4070Ratio);
  const gamingHours4080 = Math.round(gamingHours * g4080Ratio);
  const gamingHours4090 = Math.round(gamingHours * g4090Ratio);

  // Compute Hours per GPU Tier
  const computeHours4070 = Math.round(computeHours * g4070Ratio);
  const computeHours4080 = Math.round(computeHours * g4080Ratio);
  const computeHours4090 = Math.round(computeHours * g4090Ratio);

  // Hourly Revenue Calculations
  const gamingRev4070 = gamingHours4070 * pricing.rtx4070Gaming;
  const gamingRev4080 = gamingHours4080 * pricing.rtx4080Gaming;
  const gamingRev4090 = gamingHours4090 * pricing.rtx4090Gaming;
  const totalGamingRevenue = gamingRev4070 + gamingRev4080 + gamingRev4090;

  const computeRev4070 = computeHours4070 * pricing.rtx4070Compute;
  const computeRev4080 = computeHours4080 * pricing.rtx4080Compute;
  const computeRev4090 = computeHours4090 * pricing.rtx4090Compute;
  const totalComputeRevenue = computeRev4070 + computeRev4080 + computeRev4090;

  // Recurring Subscriptions (OmniPlay Pro: 50 subs, OmniPlay Ultra: 20 subs in base scenario, scaled with utilization)
  const subScale = utilizationRate / 0.75;
  const proSubscribers = Math.round(50 * subScale);
  const ultraSubscribers = Math.round(20 * subScale);
  const subscriptionRevenue = (proSubscribers * pricing.subProMonthly) + (ultraSubscribers * pricing.subUltraMonthly);

  // Premium Add-ons
  const priorityQueueSessions = Math.round(400 * subScale);
  const extraPlaytimeHours = Math.round(350 * subScale);
  const extraStorageUsers = Math.round(200 * subScale);
  const premiumSupportUsers = Math.round(80 * subScale);

  const addonRevenue = (
    priorityQueueSessions * pricing.addonPriorityQueue +
    extraPlaytimeHours * pricing.addonExtraPlaytime +
    extraStorageUsers * pricing.addonCloudStorage +
    premiumSupportUsers * pricing.addonPremiumSupport
  );

  // Total Revenue & Profitability
  const totalMonthlyRevenue = totalGamingRevenue + totalComputeRevenue + subscriptionRevenue + addonRevenue;
  const operatingProfit = totalMonthlyRevenue - totalMonthlyOpex;
  const operatingMarginPct = totalMonthlyRevenue > 0 ? (operatingProfit / totalMonthlyRevenue) * 100 : 0;
  const revenuePerGpuHour = soldCapacityHours > 0 ? totalMonthlyRevenue / soldCapacityHours : 0;

  // Break-even Calculations
  // Total potential revenue at 100% capacity:
  const maxGamingRev = (Math.round(totalCapacity * (55 / 75)) * g4070Ratio * pricing.rtx4070Gaming) +
                       (Math.round(totalCapacity * (55 / 75)) * g4080Ratio * pricing.rtx4080Gaming) +
                       (Math.round(totalCapacity * (55 / 75)) * g4090Ratio * pricing.rtx4090Gaming);
  const maxComputeRev = (Math.round(totalCapacity * (20 / 75)) * g4070Ratio * pricing.rtx4070Compute) +
                        (Math.round(totalCapacity * (20 / 75)) * g4080Ratio * pricing.rtx4080Compute) +
                        (Math.round(totalCapacity * (20 / 75)) * g4090Ratio * pricing.rtx4090Compute);
  const maxHourlyRev = maxGamingRev + maxComputeRev;
  const baseFixedRev = (50 * pricing.subProMonthly) + (20 * pricing.subUltraMonthly) +
                       (400 * pricing.addonPriorityQueue + 350 * pricing.addonExtraPlaytime + 200 * pricing.addonCloudStorage + 80 * pricing.addonPremiumSupport);
  
  const breakEvenUtilizationPct = maxHourlyRev > 0
    ? Math.max(0, Math.min(100, ((totalMonthlyOpex - baseFixedRev) / maxHourlyRev) * 100))
    : 48.0;

  // Regional Breakdown
  const opexPerGpu = totalMonthlyOpex / TOTAL_GPUS;
  const regions: RegionalFinancialResult[] = OMNIPLAY_FLEET.map(node => {
    const nodeCapacity = node.gpuCount * MONTHLY_HOURS_PER_GPU;
    const nodeSoldHours = Math.round(nodeCapacity * utilizationRate);
    const nodeGamingHours = Math.round(nodeSoldHours * (55 / 75));
    const nodeComputeHours = Math.round(nodeSoldHours * (20 / 75));

    let gamingRate = pricing.rtx4070Gaming;
    let computeRate = pricing.rtx4070Compute;
    if (node.gpuModel === 'RTX 4080') {
      gamingRate = pricing.rtx4080Gaming;
      computeRate = pricing.rtx4080Compute;
    } else if (node.gpuModel === 'RTX 4090') {
      gamingRate = pricing.rtx4090Gaming;
      computeRate = pricing.rtx4090Compute;
    }

    const gamingRev = nodeGamingHours * gamingRate;
    const computeRev = nodeComputeHours * computeRate;
    // Shared proportional revenue from subs & add-ons
    const otherShare = Math.round((subscriptionRevenue + addonRevenue) * (node.gpuCount / TOTAL_GPUS));
    const totalRegRev = gamingRev + computeRev + otherShare;
    const allocatedOpex = Math.round(opexPerGpu * node.gpuCount);
    const regProfit = totalRegRev - allocatedOpex;
    const regMargin = totalRegRev > 0 ? (regProfit / totalRegRev) * 100 : 0;

    return {
      nodeId: node.id,
      location: node.location,
      flag: node.flag,
      gpuModel: node.gpuModel,
      gpuCount: node.gpuCount,
      capacityHours: nodeCapacity,
      soldHours: nodeSoldHours,
      utilizationPct: utilizationRate * 100,
      gamingRevenue: gamingRev,
      computeRevenue: computeRev,
      otherRevenueShare: otherShare,
      totalRevenue: totalRegRev,
      allocatedOpex,
      operatingProfit: regProfit,
      marginPct: regMargin,
    };
  });

  return {
    scenarioName,
    utilizationRate,
    soldCapacityHours,
    gamingHours,
    computeHours,
    reservedHours,
    gamingRevenue: totalGamingRevenue,
    computeRevenue: totalComputeRevenue,
    subscriptionRevenue,
    addonRevenue,
    totalMonthlyRevenue,
    gpuTierRevenue: {
      rtx4070: {
        count: 2,
        hours: gamingHours4070 + computeHours4070,
        gamingRev: gamingRev4070,
        computeRev: computeRev4070,
        totalRev: gamingRev4070 + computeRev4070,
      },
      rtx4080: {
        count: 4,
        hours: gamingHours4080 + computeHours4080,
        gamingRev: gamingRev4080,
        computeRev: computeRev4080,
        totalRev: gamingRev4080 + computeRev4080,
      },
      rtx4090: {
        count: 6,
        hours: gamingHours4090 + computeHours4090,
        gamingRev: gamingRev4090,
        computeRev: computeRev4090,
        totalRev: gamingRev4090 + computeRev4090,
      },
    },
    monthlyOpex: totalMonthlyOpex,
    operatingProfit,
    operatingMarginPct,
    revenuePerGpuHour,
    breakEvenRevenue: totalMonthlyOpex,
    breakEvenUtilizationPct,
    annualRevenue: totalMonthlyRevenue * 12,
    annualOperatingProfit: operatingProfit * 12,
    regions,
  };
}

/**
 * Standard Scenario Suite (Conservative 50%, Base 75%, High Demand 90%)
 */
export function getStandardScenarios(config: FinancialConfig = getFinancialConfig()) {
  return [
    runFinancialSimulation(config, 0.50, 'Conservative (50% Utilization)'),
    runFinancialSimulation(config, 0.60, 'Moderate (60% Utilization)'),
    runFinancialSimulation(config, 0.70, 'Target Low (70% Utilization)'),
    runFinancialSimulation(config, 0.75, 'Base Scenario (75% Utilization)'),
    runFinancialSimulation(config, 0.80, 'High Target (80% Utilization)'),
    runFinancialSimulation(config, 0.90, 'High Demand (90% Utilization)'),
    runFinancialSimulation(config, 1.00, 'Max Theoretical (100% Utilization)'),
  ];
}

/**
 * Compute Dynamic Price Multiplier based on time of day (17:00-23:00 Peak, 23:00-08:00 Off-Peak)
 */
export function getDynamicPricingStatus(date: Date = new Date(), config: GpuPricingConfig = DEFAULT_PRICING): {
  period: 'PEAK' | 'NORMAL' | 'OFF_PEAK';
  label: string;
  periodLabel: string;
  multiplier: number;
  dynamicMultiplier: number;
  percentageText: string;
  markupPercent: number;
  description: string;
  isPeak: boolean;
  isOffPeak: boolean;
} {
  const hour = date.getHours();
  if (hour >= 17 && hour < 23) {
    const mult = 1 + config.peakMarkupPct / 100;
    return {
      period: 'PEAK',
      label: 'Peak Hours (17:00 - 23:00)',
      periodLabel: 'Peak Hours (17:00 - 23:00)',
      multiplier: mult,
      dynamicMultiplier: mult,
      percentageText: `+${config.peakMarkupPct}%`,
      markupPercent: config.peakMarkupPct,
      description: 'High concurrent demand surcharge to balance node routing.',
      isPeak: true,
      isOffPeak: false,
    };
  }
  if (hour >= 23 || hour < 8) {
    const mult = 1 - config.offPeakDiscountPct / 100;
    return {
      period: 'OFF_PEAK',
      label: 'Off-Peak Hours (23:00 - 08:00)',
      periodLabel: 'Off-Peak Hours (23:00 - 08:00)',
      multiplier: mult,
      dynamicMultiplier: mult,
      percentageText: `-${config.offPeakDiscountPct}%`,
      markupPercent: -config.offPeakDiscountPct,
      description: 'Night discount to maximize cloud resource utilization.',
      isPeak: false,
      isOffPeak: true,
    };
  }
  return {
    period: 'NORMAL',
    label: 'Standard Hours (08:00 - 17:00)',
    periodLabel: 'Standard Hours (08:00 - 17:00)',
    multiplier: 1.0,
    dynamicMultiplier: 1.0,
    percentageText: '0%',
    markupPercent: 0,
    description: 'Standard baseline hourly rate.',
    isPeak: false,
    isOffPeak: false,
  };
}

/**
 * Calculate Cloud Pass Bundle Price
 */
export function calculateCloudPassPrice(
  gpuModel: 'RTX 4070' | 'RTX 4080' | 'RTX 4090',
  durationHours: number, // 1, 5, 10, or 24 (Day Pass)
  applyDynamicPricing: boolean = true,
  config: GpuPricingConfig = DEFAULT_PRICING
): {
  basePrice: number;
  basePriceIdr: number;
  discountAmount: number;
  discountIdr: number;
  finalPrice: number;
  finalPriceIdr: number;
  isDayPass: boolean;
  isBundle: boolean;
  dynamicMultiplier: number;
  periodLabel: string;
} {
  const dynamicStatus = getDynamicPricingStatus(new Date(), config);
  const dynMultiplier = applyDynamicPricing ? dynamicStatus.multiplier : 1.0;

  // Day Pass (24h fixed pricing per prompt Section 6)
  if (durationHours === 24) {
    let dayRate = config.dayPass4070;
    if (gpuModel === 'RTX 4080') dayRate = config.dayPass4080;
    if (gpuModel === 'RTX 4090') dayRate = config.dayPass4090;
    const standardSum = (gpuModel === 'RTX 4070' ? config.rtx4070Gaming : gpuModel === 'RTX 4080' ? config.rtx4080Gaming : config.rtx4090Gaming) * 24;
    const finalVal = Math.round(dayRate * (applyDynamicPricing && dynamicStatus.period === 'PEAK' ? 1.05 : 1.0));
    return {
      basePrice: standardSum,
      basePriceIdr: standardSum,
      discountAmount: standardSum - dayRate,
      discountIdr: standardSum - dayRate,
      finalPrice: finalVal,
      finalPriceIdr: finalVal,
      isDayPass: true,
      isBundle: false,
      dynamicMultiplier: dynMultiplier,
      periodLabel: dynamicStatus.label,
    };
  }

  // 10 Hours Bundle (Section 5)
  if (durationHours === 10) {
    let bundle10 = 529_000;
    if (gpuModel === 'RTX 4080') bundle10 = 699_000;
    if (gpuModel === 'RTX 4090') bundle10 = 949_000;
    const standardSum = (gpuModel === 'RTX 4070' ? config.rtx4070Gaming : gpuModel === 'RTX 4080' ? config.rtx4080Gaming : config.rtx4090Gaming) * 10;
    const finalVal = Math.round(bundle10 * dynMultiplier);
    return {
      basePrice: standardSum,
      basePriceIdr: standardSum,
      discountAmount: standardSum - bundle10,
      discountIdr: standardSum - bundle10,
      finalPrice: finalVal,
      finalPriceIdr: finalVal,
      isDayPass: false,
      isBundle: true,
      dynamicMultiplier: dynMultiplier,
      periodLabel: dynamicStatus.label,
    };
  }

  // 5 Hours Bundle (Section 5)
  if (durationHours === 5) {
    let bundle5 = 279_000;
    if (gpuModel === 'RTX 4080') bundle5 = 369_000;
    if (gpuModel === 'RTX 4090') bundle5 = 499_000;
    const standardSum = (gpuModel === 'RTX 4070' ? config.rtx4070Gaming : gpuModel === 'RTX 4080' ? config.rtx4080Gaming : config.rtx4090Gaming) * 5;
    const finalVal = Math.round(bundle5 * dynMultiplier);
    return {
      basePrice: standardSum,
      basePriceIdr: standardSum,
      discountAmount: standardSum - bundle5,
      discountIdr: standardSum - bundle5,
      finalPrice: finalVal,
      finalPriceIdr: finalVal,
      isDayPass: false,
      isBundle: true,
      dynamicMultiplier: dynMultiplier,
      periodLabel: dynamicStatus.label,
    };
  }

  // Standard Hourly Rate
  let singleHourRate = config.rtx4070Gaming;
  if (gpuModel === 'RTX 4080') singleHourRate = config.rtx4080Gaming;
  if (gpuModel === 'RTX 4090') singleHourRate = config.rtx4090Gaming;

  const basePrice = singleHourRate * durationHours;
  const finalPrice = Math.round(basePrice * dynMultiplier);

  return {
    basePrice,
    basePriceIdr: basePrice,
    discountAmount: 0,
    discountIdr: 0,
    finalPrice,
    finalPriceIdr: finalPrice,
    isDayPass: false,
    isBundle: false,
    dynamicMultiplier: dynMultiplier,
    periodLabel: dynamicStatus.label,
  };
}

/**
 * Transaction Audit Repository
 */
export function getStoredTransactions(): TransactionRecord[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading transactions:', e);
  }

  // Seed baseline realistic simulation & audit transactions (Clearly marked as DEMO / SIMULATION)
  const initialSeeds: TransactionRecord[] = [
    {
      id: 'OMNI-TX-984210',
      user: 'AlphaGamer',
      itemTitle: 'EA SPORTS FC 25',
      category: 'Gaming',
      nodeId: 'JK-01',
      nodeName: 'Jakarta Edge (JK-01)',
      gpuTier: 'RTX 4070 (Tier 1)',
      durationHours: 5,
      amountIdr: 279_000,
      paymentMethod: 'QRIS Instant',
      paymentStatus: 'PAID',
      rentalStatus: 'ACTIVE',
      isDemo: true,
      date: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'OMNI-TX-984209',
      user: 'VortexAI_Lab',
      itemTitle: 'LLM Fine-Tuning & Llama-3 Checkpoint',
      category: 'Compute',
      nodeId: 'TY-01',
      nodeName: 'Tokyo Ultra (TY-01)',
      gpuTier: 'RTX 4090 (Tier 3)',
      durationHours: 12,
      amountIdr: 1_068_000,
      paymentMethod: 'Credit Card (Visa)',
      paymentStatus: 'PAID',
      rentalStatus: 'ACTIVE',
      isDemo: true,
      date: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'OMNI-TX-984208',
      user: 'CyberSamurai',
      itemTitle: 'Cyberpunk 2077: Phantom Liberty',
      category: 'Gaming',
      nodeId: 'SG-01',
      nodeName: 'Singapore Premium (SG-01)',
      gpuTier: 'RTX 4080 (Tier 2)',
      durationHours: 10,
      amountIdr: 699_000,
      paymentMethod: 'PayPal Express',
      paymentStatus: 'PAID',
      rentalStatus: 'COMPLETED',
      isDemo: true,
      date: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 'OMNI-TX-984207',
      user: 'RenderStudio_EU',
      itemTitle: 'Blender 4.2 Cycles 8K Film Sequence',
      category: 'Compute',
      nodeId: 'EU-02',
      nodeName: 'Frankfurt Central (EU-02)',
      gpuTier: 'RTX 4080 (Tier 2)',
      durationHours: 8,
      amountIdr: 552_000,
      paymentMethod: 'Global Wire Transfer',
      paymentStatus: 'PAID',
      rentalStatus: 'COMPLETED',
      isDemo: true,
      date: new Date(Date.now() - 3600000 * 28).toISOString(),
    },
    {
      id: 'OMNI-TX-984206',
      user: 'NeoMatrix',
      itemTitle: 'OmniPlay Pro Monthly Membership',
      category: 'Subscription',
      nodeId: 'GLOBAL',
      nodeName: 'OmniPlay Global Network',
      gpuTier: 'Tier 1 & Tier 2 Priority',
      durationHours: 720,
      amountIdr: 699_000,
      paymentMethod: 'Credit Card (Mastercard)',
      paymentStatus: 'PAID',
      rentalStatus: 'ACTIVE',
      isDemo: true,
      date: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: 'OMNI-TX-984205',
      user: 'SpeedDemon',
      itemTitle: 'Black Myth: Wukong (24h Day Pass)',
      category: 'Gaming',
      nodeId: 'US-01',
      nodeName: 'California Ultra (US-01)',
      gpuTier: 'RTX 4090 (Tier 3)',
      durationHours: 24,
      amountIdr: 899_000,
      paymentMethod: 'Apple Pay',
      paymentStatus: 'PAID',
      rentalStatus: 'COMPLETED',
      isDemo: true,
      date: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
  ];

  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(initialSeeds));
  } catch (e) {
    console.warn('Error seeding initial transactions:', e);
  }

  return initialSeeds;
}

/**
 * Record a real transaction executed via the user rental / payment flow
 */
export function recordLiveTransaction(tx: Omit<TransactionRecord, 'id' | 'isDemo' | 'date'>): TransactionRecord {
  const newTx: TransactionRecord = {
    ...tx,
    id: `OMNI-TX-${Math.floor(100000 + Math.random() * 900000)}`,
    isDemo: false, // LIVE real user transaction
    date: new Date().toISOString(),
  };

  const list = getStoredTransactions();
  const updated = [newTx, ...list];
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('omni:transactions_updated'));
  } catch (e) {
    console.error('Error recording transaction:', e);
  }
  return newTx;
}
