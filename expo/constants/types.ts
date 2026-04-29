export interface MotorcycleSpec {
  year: number;
  make: string;
  model: string;
  frontSprocket: number;
  rearSprocket: number;
  chainSize: string;
  chainLength: number;
  recommendedChain: string;
  recommendedChainUrl: string;
  secondaryChain?: string;
  secondaryChainUrl?: string;
}

export interface GearingResult {
  frontSprocket: number;
  rearSprocket: number;
  chainSize: string;
  chainLength: number;
  gearingRatio: number;
  originalGearingRatio: number;
  originalChainLength: number;
  ratioChange: number;
}

export interface WheelRecommendation {
  type: 'DirtStar Rim' | 'Ace Wheelset';
  position: 'Front' | 'Rear';
  rimSize?: string;
  productCodes: { label: string; code: string }[];
  notes?: string;
}

export interface WearResult {
  measuredLength: number;
  nominalLength: number;
  wearPercentage: number;
  needsReplacement: boolean;
  threshold: number;
  chainType: 'sealed' | 'non-sealed';
}

export type ChainType = 'sealed' | 'non-sealed';
