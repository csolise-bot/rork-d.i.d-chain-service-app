import { MotorcycleSpec, WheelRecommendation } from '@/constants/types';

/**
 * Extract engine displacement (CC) from model name.
 * Finds all digit sequences and returns the largest one,
 * which is typically the engine size (e.g. "CRF450R" → 450, "690 Enduro R" → 690).
 */
function extractCcFromModel(model: string): number | undefined {
  const numbers = model.match(/\d+/g);
  if (!numbers) return undefined;
  return Math.max(...numbers.map(Number));
}

function yearRange(
  startYear: number,
  endYear: number,
  make: string,
  model: string,
  frontSprocket: number,
  rearSprocket: number,
  chainSize: string,
  chainLength: number,
  recommendedChain: string,
  recommendedChainUrl: string,
  secondaryChain?: string,
  secondaryChainUrl?: string,
  cc?: number,
): MotorcycleSpec[] {
  const effectiveCc = cc ?? extractCcFromModel(model);
  const specs: MotorcycleSpec[] = [];
  for (let year = startYear; year <= endYear; year++) {
    const spec: MotorcycleSpec = { year, make, model, frontSprocket, rearSprocket, chainSize, chainLength, recommendedChain, recommendedChainUrl };
    if (secondaryChain && secondaryChainUrl) {
      spec.secondaryChain = secondaryChain;
      spec.secondaryChainUrl = secondaryChainUrl;
    }
    if (effectiveCc != null) {
      spec.cc = effectiveCc;
    }
    specs.push(spec);
  }
  return specs;
}

type WheelApplication = {
  make: string;
  model: string;
  startYear: number;
  endYear: number;
  recommendations: WheelRecommendation[];
};

const currentApplicationYear = 2026;

const normalizeModelName = (model: string): string => model.toUpperCase().replace(/[^A-Z0-9]/g, '');

const isModelMatch = (bikeModel: string, applicationModel: string): boolean => {
  const normalizedBikeModel = normalizeModelName(bikeModel);
  const normalizedApplicationModel = normalizeModelName(applicationModel.replace(/ Models?/gi, ''));

  if (applicationModel.includes('/')) {
    const prefixMatch = applicationModel.match(/^([A-Z]+)\s+/i);
    const prefix = prefixMatch ? normalizeModelName(prefixMatch[1]) : '';
    return applicationModel
      .replace(/ Models?/gi, '')
      .split('/')
      .map(part => `${prefix}${normalizeModelName(part)}`)
      .some(model => model === normalizedBikeModel);
  }

  if (/\bModels?\b/i.test(applicationModel)) {
    return normalizedBikeModel.includes(normalizedApplicationModel);
  }

  return normalizedBikeModel === normalizedApplicationModel;
};

const wheelApplications: WheelApplication[] = [
  { make: 'Honda', model: 'CR125R', startYear: 2002, endYear: 2007, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01H' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x1.85', productCodes: [{ label: 'Original Black', code: '19X185VB01H' }, { label: 'Original Silver', code: '19X185VS01H' }, { label: 'ST-X Black', code: '19X185STB01H' }] },
  ] },
  { make: 'Honda', model: 'CR250R', startYear: 2002, endYear: 2007, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01H' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: '19X215VB01H' }, { label: 'Original Silver', code: '19X215VS01H' }, { label: 'ST-X Black', code: '19X215STB01H' }] },
  ] },
  { make: 'Honda', model: 'CRF250R', startYear: 2004, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01H' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x1.85', productCodes: [{ label: 'Original Black', code: '19X185VB01H' }, { label: 'Original Silver', code: '19X185VS01H' }, { label: 'ST-X Black', code: '19X185STB01H' }] },
  ] },
  { make: 'Honda', model: 'CRF250R', startYear: 2014, endYear: currentApplicationYear, recommendations: [
    { type: 'Ace Wheelset', position: 'Front', productCodes: [{ label: 'Wheelset', code: 'ACESET-HONDA' }] },
    { type: 'Ace Wheelset', position: 'Rear', productCodes: [{ label: 'Wheelset', code: 'ACESET-HONDA' }] },
  ] },
  { make: 'Honda', model: 'CRF250X', startYear: 2004, endYear: 2017, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01H' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: '18X215VB01H' }, { label: 'Original Silver', code: '18X215VS01H' }, { label: 'ST-X Black', code: '18X215STB01H' }] },
  ] },
  { make: 'Honda', model: 'CRF450R', startYear: 2004, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01H' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: '19X215VB01H' }, { label: 'Original Silver', code: '19X215VS01H' }, { label: 'ST-X Black', code: '19X215STB01H' }] },
  ] },
  { make: 'Honda', model: 'CRF450R', startYear: 2013, endYear: currentApplicationYear, recommendations: [
    { type: 'Ace Wheelset', position: 'Front', productCodes: [{ label: 'Wheelset', code: 'ACESET-HONDA' }] },
    { type: 'Ace Wheelset', position: 'Rear', productCodes: [{ label: 'Wheelset', code: 'ACESET-HONDA' }] },
  ] },
  { make: 'Honda', model: 'CRF450X', startYear: 2005, endYear: 2017, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01H' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: '18X215VB01H' }, { label: 'Original Silver', code: '18X215VS01H' }, { label: 'ST-X Black', code: '18X215STB01H' }] },
  ] },
  { make: 'Honda', model: 'CR500R', startYear: 2002, endYear: 2007, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01H' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: '19X215VB01H' }, { label: 'Original Silver', code: '19X215VS01H' }, { label: 'ST-X Black', code: '19X215STB01H' }] },
  ] },
  { make: 'Yamaha', model: 'YZ80/85', startYear: 1974, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '19x1.40', productCodes: [{ label: 'Original Black', code: '19X140VB01Y' }, { label: 'Original Silver', code: '19X140VS01Y' }, { label: 'ST-X Black', code: '19X140STB01Y' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '16x1.85', productCodes: [{ label: 'Original Black', code: '16X185VB01Y' }, { label: 'Original Silver', code: '16X185VS01Y' }, { label: 'ST-X Black', code: '16X185STB01Y' }] },
  ] },
  { make: 'Yamaha', model: 'YZ125', startYear: 1996, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01Y' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x1.85', productCodes: [{ label: 'Original Black', code: 'U19X185VBK' }, { label: 'Original Silver', code: 'U19X185VSL' }, { label: 'ST-X Black', code: '19X185STB01Y' }] },
  ] },
  { make: 'Yamaha', model: 'YZ250', startYear: 1996, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01Y' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01Y' }] },
  ] },
  { make: 'Yamaha', model: 'YZ250F', startYear: 2001, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01Y' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x1.85', productCodes: [{ label: 'Original Black', code: 'U19X185VBK' }, { label: 'Original Silver', code: 'U19X185VSL' }, { label: 'ST-X Black', code: '19X185STB01Y' }] },
  ] },
  { make: 'Yamaha', model: 'YZ250F', startYear: 2022, endYear: currentApplicationYear, recommendations: [
    { type: 'Ace Wheelset', position: 'Front', productCodes: [{ label: 'Wheelset', code: 'ACESET-YAMAHA' }] },
    { type: 'Ace Wheelset', position: 'Rear', productCodes: [{ label: 'Wheelset', code: 'ACESET-YAMAHA' }] },
  ] },
  { make: 'Yamaha', model: 'WR250F', startYear: 2004, endYear: 2025, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01Y' }] },
  ] },
  { make: 'Yamaha', model: 'YZ400/426F', startYear: 1998, endYear: 2002, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01Y' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01Y' }] },
  ] },
  { make: 'Yamaha', model: 'WR400/426F', startYear: 1998, endYear: 2002, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01Y' }] },
  ] },
  { make: 'Yamaha', model: 'YZ450F', startYear: 2003, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01Y' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01Y' }] },
  ] },
  { make: 'Yamaha', model: 'YZ450F', startYear: 2021, endYear: currentApplicationYear, recommendations: [
    { type: 'Ace Wheelset', position: 'Front', productCodes: [{ label: 'Wheelset', code: 'ACESET-YAMAHA' }] },
    { type: 'Ace Wheelset', position: 'Rear', productCodes: [{ label: 'Wheelset', code: 'ACESET-YAMAHA' }] },
  ] },
  { make: 'Yamaha', model: 'WR450F', startYear: 2003, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01Y' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: '18X215VB01Y' }, { label: 'Original Silver', code: '18X215VS01Y' }, { label: 'ST-X Black', code: '18X215STB01Y' }] },
  ] },
  { make: 'Suzuki', model: 'RM125', startYear: 1996, endYear: 2008, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01S' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x1.85', productCodes: [{ label: 'Original Black', code: 'U19X185VBK' }, { label: 'Original Silver', code: 'U19X185VSL' }, { label: 'ST-X Black', code: '19X185STB01S' }] },
  ] },
  { make: 'Suzuki', model: 'RM250', startYear: 1996, endYear: 2008, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01S' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01S' }] },
  ] },
  { make: 'Suzuki', model: 'RM-Z250', startYear: 2004, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01S' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x1.85', productCodes: [{ label: 'Original Black', code: 'U19X185VBK' }, { label: 'Original Silver', code: 'U19X185VSL' }, { label: 'ST-X Black', code: '19X185STB01S' }] },
  ] },
  { make: 'Suzuki', model: 'RM-Z450', startYear: 2005, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01S' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01S' }] },
  ] },
  { make: 'Suzuki', model: 'RM-X450Z', startYear: 2010, endYear: 2011, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01S' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }] },
  ] },
  { make: 'Suzuki', model: 'DR-Z250', startYear: 2001, endYear: 2007, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01S' }] },
  ] },
  { make: 'Kawasaki', model: 'KX125', startYear: 2000, endYear: 2008, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01K' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x1.85', productCodes: [{ label: 'Original Black', code: 'U19X185VBK' }, { label: 'Original Silver', code: 'U19X185VSL' }, { label: 'ST-X Black', code: '19X185STB01K' }] },
  ] },
  { make: 'Kawasaki', model: 'KX250', startYear: 1997, endYear: 2008, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01K' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01K' }] },
  ] },
  { make: 'Kawasaki', model: 'KX250F', startYear: 2004, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01K' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x1.85', productCodes: [{ label: 'Original Black', code: 'U19X185VBK' }, { label: 'Original Silver', code: 'U19X185VSL' }, { label: 'ST-X Black', code: '19X185STB01K' }] },
  ] },
  { make: 'Kawasaki', model: 'KLX250S', startYear: 1998, endYear: 2018, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01K' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: '18X215VB01K' }, { label: 'Original Silver', code: '18X215VS01K' }] },
  ] },
  { make: 'Kawasaki', model: 'KX450F', startYear: 2006, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01K' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01K' }] },
  ] },
  { make: 'Kawasaki', model: 'KLX450R', startYear: 2008, endYear: 2014, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01K' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }] },
  ] },
  { make: 'Kawasaki', model: 'KX500', startYear: 1995, endYear: 2004, recommendations: [
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01K' }] },
  ] },
  { make: 'KTM', model: 'SX Models', startYear: 1996, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01T' }] },
  ] },
  { make: 'KTM', model: 'SX-F Models', startYear: 1996, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01T' }] },
  ] },
  { make: 'KTM', model: 'EXC Models', startYear: 1996, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }, { label: 'ST-X Black', code: '18X215STB01T' }] },
  ] },
  { make: 'KTM', model: 'XC Models', startYear: 1996, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }, { label: 'ST-X Black', code: '18X215STB01T' }] },
  ] },
  { make: 'KTM', model: 'XC-F Models', startYear: 1996, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }, { label: 'ST-X Black', code: '18X215STB01T' }] },
  ] },
  { make: 'KTM', model: 'XC-W Models', startYear: 1996, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }, { label: 'ST-X Black', code: '18X215STB01T' }] },
  ] },
  { make: 'KTM', model: 'SX-F Models', startYear: 2019, endYear: 2022, recommendations: [
    { type: 'Ace Wheelset', position: 'Front', productCodes: [{ label: 'Wheelset', code: 'ACESET-KTM22' }], notes: '25mm Collar' },
    { type: 'Ace Wheelset', position: 'Rear', productCodes: [{ label: 'Wheelset', code: 'ACESET-KTM22' }], notes: '25mm Collar' },
  ] },
  { make: 'KTM', model: 'SX-F Models', startYear: 2023, endYear: currentApplicationYear, recommendations: [
    { type: 'Ace Wheelset', position: 'Front', productCodes: [{ label: 'Wheelset', code: 'ACESET-KTM23' }], notes: '22mm Collar' },
    { type: 'Ace Wheelset', position: 'Rear', productCodes: [{ label: 'Wheelset', code: 'ACESET-KTM23' }], notes: '22mm Collar' },
  ] },
  { make: 'Husqvarna', model: 'TC 125/250', startYear: 2014, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01T' }] },
  ] },
  { make: 'Husqvarna', model: 'FC 250/350/450', startYear: 2014, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '19x2.15', productCodes: [{ label: 'Original Black', code: 'U19X215VBK' }, { label: 'Original Silver', code: 'U19X215VSL' }, { label: 'ST-X Black', code: '19X215STB01T' }] },
  ] },
  { make: 'Husqvarna', model: 'TE 125/250/300', startYear: 2014, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }, { label: 'ST-X Black', code: '18X215STB01T' }] },
  ] },
  { make: 'Husqvarna', model: 'FE 250/350/350S', startYear: 2014, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }, { label: 'ST-X Black', code: '18X215STB01T' }] },
  ] },
  { make: 'Husqvarna', model: 'FE 450', startYear: 2014, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }, { label: 'ST-X Black', code: '18X215STB01T' }] },
  ] },
  { make: 'Husqvarna', model: 'FE 501/501S', startYear: 2014, endYear: 2026, recommendations: [
    { type: 'DirtStar Rim', position: 'Front', rimSize: '21x1.60', productCodes: [{ label: 'Original Black', code: 'U21X160VBK' }, { label: 'Original Silver', code: 'U21X160VSL' }, { label: 'ST-X Black', code: '21X160STB01T' }] },
    { type: 'DirtStar Rim', position: 'Rear', rimSize: '18x2.15', productCodes: [{ label: 'Original Black', code: 'U18X215VBK' }, { label: 'Original Silver', code: 'U18X215VSL' }, { label: 'ST-X Black', code: '18X215STB01T' }] },
  ] },
];

export function getWheelRecommendations(year: number, make: string, model: string): WheelRecommendation[] {
  const recommendations = wheelApplications
    .filter(application => application.make === make && year >= application.startYear && year <= application.endYear && isModelMatch(model, application.model))
    .flatMap(application => application.recommendations);

  return recommendations.filter((recommendation, index, list) => {
    const key = `${recommendation.type}-${recommendation.position}-${recommendation.rimSize ?? ''}-${recommendation.productCodes.map(product => product.code).join('|')}-${recommendation.notes ?? ''}`;
    return list.findIndex(item => `${item.type}-${item.position}-${item.rimSize ?? ''}-${item.productCodes.map(product => product.code).join('|')}-${item.notes ?? ''}` === key) === index;
  });
}

export const motorcycleDatabase: MotorcycleSpec[] = [
  // ============================================================
  // YAMAHA
  // ============================================================

  // Yamaha YZ250F
  ...yearRange(2004, 2009, 'Yamaha', 'YZ250F', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2010, 2011, 'Yamaha', 'YZ250F', 13, 49, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2012, 2025, 'Yamaha', 'YZ250F', 13, 50, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Yamaha YZ450F
  ...yearRange(2003, 2009, 'Yamaha', 'YZ450F', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2010, 2013, 'Yamaha', 'YZ450F', 13, 48, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2014, 2025, 'Yamaha', 'YZ450F', 13, 49, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Yamaha YZ125 (428 chain)
  ...yearRange(2004, 2022, 'Yamaha', 'YZ125', 13, 48, '428', 126, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Yamaha YZ250 (2-stroke)
  ...yearRange(2005, 2025, 'Yamaha', 'YZ250', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Yamaha YZ85
  ...yearRange(2002, 2025, 'Yamaha', 'YZ85', 14, 47, '428', 118, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Yamaha YZ65
  ...yearRange(2018, 2025, 'Yamaha', 'YZ65', 14, 48, '420', 124, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Yamaha YZ250X (2-stroke enduro)
  ...yearRange(2016, 2025, 'Yamaha', 'YZ250X', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Yamaha YZ125X (2-stroke enduro)
  ...yearRange(2020, 2025, 'Yamaha', 'YZ125X', 13, 48, '428', 126, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Yamaha YZ250FX
  ...yearRange(2015, 2025, 'Yamaha', 'YZ250FX', 13, 50, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Yamaha YZ450FX
  ...yearRange(2016, 2025, 'Yamaha', 'YZ450FX', 13, 49, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Yamaha WR250F
  ...yearRange(2001, 2014, 'Yamaha', 'WR250F', 13, 50, '520', 114, 'DID 520ERVT', 'https://www.didchain.com/products/520ervt', 'DID 520VX3', 'https://www.didchain.com/products/520vx3'),
  ...yearRange(2015, 2025, 'Yamaha', 'WR250F', 13, 50, '520', 114, 'DID 520ERVT', 'https://www.didchain.com/products/520ervt', 'DID 520VX3', 'https://www.didchain.com/products/520vx3'),

  // Yamaha WR450F
  ...yearRange(2003, 2011, 'Yamaha', 'WR450F', 13, 50, '520', 114, 'DID 520ERVT', 'https://www.didchain.com/products/520ervt', 'DID 520VX3', 'https://www.didchain.com/products/520vx3'),
  ...yearRange(2012, 2025, 'Yamaha', 'WR450F', 13, 49, '520', 114, 'DID 520ERVT', 'https://www.didchain.com/products/520ervt', 'DID 520VX3', 'https://www.didchain.com/products/520vx3'),

  // Yamaha WR250R
  ...yearRange(2008, 2020, 'Yamaha', 'WR250R', 13, 43, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Yamaha TT-R230
  ...yearRange(2005, 2025, 'Yamaha', 'TT-R230', 13, 43, '428', 118, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Yamaha TT-R125
  ...yearRange(2000, 2025, 'Yamaha', 'TT-R125', 14, 54, '428', 118, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Yamaha TT-R110
  ...yearRange(2008, 2025, 'Yamaha', 'TT-R110', 14, 37, '420', 86, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Yamaha TT-R50
  ...yearRange(2006, 2025, 'Yamaha', 'TT-R50', 13, 38, '420', 76, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Yamaha XT250
  ...yearRange(2008, 2025, 'Yamaha', 'XT250', 15, 45, '428', 126, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Yamaha TW200
  ...yearRange(1987, 2025, 'Yamaha', 'TW200', 14, 50, '428', 126, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Yamaha YZF-R6 (599cc)
  ...yearRange(2006, 2021, 'Yamaha', 'YZF-R6', 16, 45, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 599),

  // Yamaha YZF-R7 (689cc)
  ...yearRange(2021, 2025, 'Yamaha', 'YZF-R7', 16, 43, '525', 108, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 689),

  // Yamaha YZF-R1 (998cc)
  ...yearRange(2004, 2008, 'Yamaha', 'YZF-R1', 17, 45, '530', 116, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 998),
  ...yearRange(2009, 2014, 'Yamaha', 'YZF-R1', 17, 47, '530', 120, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 998),
  ...yearRange(2015, 2024, 'Yamaha', 'YZF-R1', 16, 41, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Yamaha YZF-R3 (321cc)
  ...yearRange(2015, 2025, 'Yamaha', 'YZF-R3', 14, 43, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 321),

  // Yamaha YZF-R125
  ...yearRange(2008, 2025, 'Yamaha', 'YZF-R125', 14, 48, '428', 132, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Yamaha MT-10 (998cc)
  ...yearRange(2016, 2025, 'Yamaha', 'MT-10', 16, 43, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Yamaha MT-09 (847cc)
  ...yearRange(2014, 2025, 'Yamaha', 'MT-09', 16, 45, '525', 110, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 847),

  // Yamaha MT-07 (689cc)
  ...yearRange(2015, 2025, 'Yamaha', 'MT-07', 16, 43, '525', 108, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 689),

  // Yamaha MT-03 (321cc)
  ...yearRange(2020, 2025, 'Yamaha', 'MT-03', 14, 43, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 321),

  // Yamaha MT-125
  ...yearRange(2020, 2025, 'Yamaha', 'MT-125', 14, 48, '428', 132, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Yamaha XSR900 (847cc)
  ...yearRange(2016, 2025, 'Yamaha', 'XSR900', 16, 45, '525', 110, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 847),

  // Yamaha XSR700 (689cc)
  ...yearRange(2018, 2024, 'Yamaha', 'XSR700', 16, 43, '525', 108, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 689),

  // Yamaha NIKEN (847cc)
  ...yearRange(2018, 2025, 'Yamaha', 'NIKEN', 16, 43, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 847),

  // Yamaha Tracer 9 (889cc)
  ...yearRange(2021, 2025, 'Yamaha', 'Tracer 9', 16, 45, '525', 110, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 889),

  // Yamaha Tracer 7 (689cc)
  ...yearRange(2021, 2025, 'Yamaha', 'Tracer 7', 16, 43, '525', 108, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 689),

  // Yamaha Tenere 700 (689cc)
  ...yearRange(2019, 2025, 'Yamaha', 'Tenere 700', 16, 46, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 689),

  // Yamaha FZ-09 (847cc - pre MT-09 name)
  ...yearRange(2014, 2017, 'Yamaha', 'FZ-09', 16, 45, '525', 110, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 847),

  // Yamaha FZ-07 (689cc - pre MT-07 name)
  ...yearRange(2015, 2017, 'Yamaha', 'FZ-07', 16, 43, '525', 108, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 689),

  // Yamaha FZ6R (600cc)
  ...yearRange(2009, 2017, 'Yamaha', 'FZ6R', 16, 46, '520', 116, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 600),

  // Yamaha FZ-10 (998cc - pre MT-10 name)
  ...yearRange(2016, 2017, 'Yamaha', 'FZ-10', 16, 43, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // ============================================================
  // HONDA
  // ============================================================

  // Honda CRF250R
  ...yearRange(2004, 2009, 'Honda', 'CRF250R', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2010, 2021, 'Honda', 'CRF250R', 13, 49, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2022, 2025, 'Honda', 'CRF250R', 13, 50, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Honda CRF250RX
  ...yearRange(2019, 2021, 'Honda', 'CRF250RX', 13, 49, '520', 116, 'DID 520ERVT', 'https://www.didchain.com/products/520ervt', 'DID 520ERT3', 'https://www.didchain.com/products/520ert3'),
  ...yearRange(2022, 2025, 'Honda', 'CRF250RX', 13, 50, '520', 114, 'DID 520ERVT', 'https://www.didchain.com/products/520ervt', 'DID 520ERT3', 'https://www.didchain.com/products/520ert3'),

  // Honda CRF450R
  ...yearRange(2004, 2016, 'Honda', 'CRF450R', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2017, 2025, 'Honda', 'CRF450R', 13, 49, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Honda CRF450RX
  ...yearRange(2017, 2025, 'Honda', 'CRF450RX', 13, 49, '520', 114, 'DID 520ERVT', 'https://www.didchain.com/products/520ervt', 'DID 520VX3', 'https://www.didchain.com/products/520vx3'),

  // Honda CRF450X
  ...yearRange(2005, 2017, 'Honda', 'CRF450X', 13, 50, '520', 116, 'DID 520ERVT', 'https://www.didchain.com/products/520ervt', 'DID 520VX3', 'https://www.didchain.com/products/520vx3'),
  ...yearRange(2019, 2025, 'Honda', 'CRF450X', 13, 49, '520', 114, 'DID 520ERVT', 'https://www.didchain.com/products/520ervt', 'DID 520VX3', 'https://www.didchain.com/products/520vx3'),

  // Honda CRF450RL (dual sport)
  ...yearRange(2021, 2025, 'Honda', 'CRF450RL', 13, 42, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Honda CRF250F (trail)
  ...yearRange(2019, 2025, 'Honda', 'CRF250F', 13, 40, '520', 104, 'DID 520VX3', 'https://www.didchain.com/products/520vx3'),

  // Honda CRF150R
  ...yearRange(2007, 2025, 'Honda', 'CRF150R', 15, 50, '420', 130, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Honda CRF150F
  ...yearRange(2003, 2025, 'Honda', 'CRF150F', 13, 47, '428', 118, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Honda CRF125F
  ...yearRange(2014, 2025, 'Honda', 'CRF125F', 14, 54, '428', 118, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Honda CRF110F
  ...yearRange(2013, 2025, 'Honda', 'CRF110F', 14, 37, '420', 86, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Honda CRF50F
  ...yearRange(2004, 2025, 'Honda', 'CRF50F', 14, 37, '420', 75, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Honda CRF300L
  ...yearRange(2021, 2025, 'Honda', 'CRF300L', 13, 38, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Honda CRF300L Rally
  ...yearRange(2021, 2025, 'Honda', 'CRF300L Rally', 13, 38, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Honda CRF250L
  ...yearRange(2013, 2020, 'Honda', 'CRF250L', 14, 40, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Honda CRF250L Rally
  ...yearRange(2017, 2020, 'Honda', 'CRF250L Rally', 14, 40, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Honda XR650L
  ...yearRange(1993, 2025, 'Honda', 'XR650L', 15, 45, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Honda CBR600RR (599cc)
  ...yearRange(2003, 2006, 'Honda', 'CBR600RR', 16, 42, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 599),
  ...yearRange(2007, 2024, 'Honda', 'CBR600RR', 16, 42, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 599),

  // Honda CBR1000RR (998cc)
  ...yearRange(2004, 2007, 'Honda', 'CBR1000RR', 16, 42, '530', 114, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 998),
  ...yearRange(2008, 2016, 'Honda', 'CBR1000RR', 16, 42, '530', 116, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 998),
  ...yearRange(2017, 2019, 'Honda', 'CBR1000RR', 16, 42, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Honda CBR1000RR-R (999cc)
  ...yearRange(2020, 2025, 'Honda', 'CBR1000RR-R', 16, 40, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 999),

  // Honda CBR650R (649cc)
  ...yearRange(2019, 2025, 'Honda', 'CBR650R', 15, 42, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 649),

  // Honda CBR650F (649cc)
  ...yearRange(2014, 2018, 'Honda', 'CBR650F', 15, 42, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 649),

  // Honda CB650R (649cc)
  ...yearRange(2019, 2025, 'Honda', 'CB650R', 15, 42, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 649),

  // Honda CB650F (649cc)
  ...yearRange(2014, 2018, 'Honda', 'CB650F', 15, 42, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 649),

  // Honda CBR500R (471cc)
  ...yearRange(2013, 2025, 'Honda', 'CBR500R', 15, 41, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 471),

  // Honda CB500F (471cc)
  ...yearRange(2013, 2025, 'Honda', 'CB500F', 15, 41, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 471),

  // Honda CB500X (471cc)
  ...yearRange(2013, 2025, 'Honda', 'CB500X', 15, 41, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 471),

  // Honda CBR300R (286cc)
  ...yearRange(2015, 2025, 'Honda', 'CBR300R', 14, 36, '520', 104, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 286),

  // Honda CB300R (286cc)
  ...yearRange(2019, 2025, 'Honda', 'CB300R', 14, 36, '520', 104, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 286),

  // Honda CB300F (286cc)
  ...yearRange(2015, 2018, 'Honda', 'CB300F', 14, 36, '520', 104, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 286),

  // Honda CB125R
  ...yearRange(2021, 2025, 'Honda', 'CB125R', 14, 40, '428', 130, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Honda CB1000R (998cc)
  ...yearRange(2018, 2025, 'Honda', 'CB1000R', 16, 44, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Honda CB1100 (1140cc)
  ...yearRange(2013, 2021, 'Honda', 'CB1100', 18, 39, '530', 110, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 1140),

  // Honda Rebel 500 (471cc)
  ...yearRange(2017, 2025, 'Honda', 'Rebel 500', 15, 40, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 471),

  // Honda Rebel 1100 (1084cc)
  ...yearRange(2021, 2025, 'Honda', 'Rebel 1100', 16, 42, '525', 114, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1084),

  // Honda Rebel 300 (286cc)
  ...yearRange(2017, 2025, 'Honda', 'Rebel 300', 14, 36, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 286),

  // Honda Africa Twin CRF1100L (1084cc)
  ...yearRange(2020, 2025, 'Honda', 'Africa Twin CRF1100L', 16, 42, '525', 124, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1084),

  // Honda Africa Twin CRF1000L (998cc)
  ...yearRange(2016, 2019, 'Honda', 'Africa Twin CRF1000L', 16, 42, '525', 122, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Honda NC750X (745cc)
  ...yearRange(2014, 2025, 'Honda', 'NC750X', 17, 43, '520', 116, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 745),

  // Honda NC700X (670cc)
  ...yearRange(2012, 2013, 'Honda', 'NC700X', 17, 43, '520', 116, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 670),

  // Honda Grom (MSX125)
  ...yearRange(2014, 2025, 'Honda', 'Grom', 15, 34, '420', 106, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Honda Monkey 125
  ...yearRange(2019, 2025, 'Honda', 'Monkey 125', 14, 31, '420', 100, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Honda Trail 125
  ...yearRange(2021, 2025, 'Honda', 'Trail 125', 14, 39, '420', 100, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Honda Super Cub C125
  ...yearRange(2019, 2025, 'Honda', 'Super Cub C125', 14, 39, '420', 96, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Honda Navi
  ...yearRange(2022, 2025, 'Honda', 'Navi', 14, 38, '420', 90, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Honda VFR800 (782cc)
  ...yearRange(2002, 2017, 'Honda', 'VFR800', 16, 43, '530', 110, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 782),

  // Honda CTX700 (670cc)
  ...yearRange(2014, 2018, 'Honda', 'CTX700', 17, 43, '520', 116, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 670),

  // Honda CBR250R (249cc)
  ...yearRange(2011, 2013, 'Honda', 'CBR250R', 14, 38, '520', 104, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 249),

  // Honda CRF450RWE
  ...yearRange(2019, 2025, 'Honda', 'CRF450RWE', 13, 49, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Honda Hornet 750 (755cc)
  ...yearRange(2023, 2026, 'Honda', 'Hornet 750', 16, 45, '520', 114, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 755),

  // Honda Hornet 1000 (1000cc)
  ...yearRange(2025, 2026, 'Honda', 'Hornet 1000', 15, 45, '525', 120, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 1000),

  // Honda NX500 (471cc)
  ...yearRange(2024, 2026, 'Honda', 'NX500', 15, 41, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 471),

  // Honda CL500 (471cc)
  ...yearRange(2023, 2026, 'Honda', 'CL500', 15, 41, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 471),

  // Honda Transalp 750 (755cc)
  ...yearRange(2023, 2026, 'Honda', 'Transalp 750', 16, 45, '520', 126, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 755),

  // ============================================================
  // KAWASAKI
  // ============================================================

  // Kawasaki KX250F
  ...yearRange(2004, 2018, 'Kawasaki', 'KX250F', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Kawasaki KX250
  ...yearRange(2019, 2025, 'Kawasaki', 'KX250', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Kawasaki KX250X
  ...yearRange(2022, 2025, 'Kawasaki', 'KX250X', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Kawasaki KX450F
  ...yearRange(2006, 2011, 'Kawasaki', 'KX450F', 13, 50, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2012, 2018, 'Kawasaki', 'KX450F', 13, 49, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Kawasaki KX450
  ...yearRange(2019, 2025, 'Kawasaki', 'KX450', 13, 49, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Kawasaki KX450X
  ...yearRange(2022, 2025, 'Kawasaki', 'KX450X', 13, 50, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Kawasaki KX450SR
  ...yearRange(2022, 2025, 'Kawasaki', 'KX450SR', 13, 49, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Kawasaki KX112
  ...yearRange(2022, 2025, 'Kawasaki', 'KX112', 13, 50, '428', 120, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Kawasaki KX85
  ...yearRange(2001, 2025, 'Kawasaki', 'KX85', 13, 47, '428', 120, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Kawasaki KX65
  ...yearRange(2000, 2025, 'Kawasaki', 'KX65', 14, 47, '420', 110, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Kawasaki KX100
  ...yearRange(2014, 2021, 'Kawasaki', 'KX100', 14, 50, '428', 120, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Kawasaki KLX300R
  ...yearRange(2020, 2025, 'Kawasaki', 'KLX300R', 13, 43, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Kawasaki KLX300
  ...yearRange(2021, 2025, 'Kawasaki', 'KLX300', 13, 42, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Kawasaki KLX300SM
  ...yearRange(2021, 2025, 'Kawasaki', 'KLX300SM', 13, 40, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Kawasaki KLX250
  ...yearRange(2009, 2025, 'Kawasaki', 'KLX250', 14, 42, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Kawasaki KLX230R
  ...yearRange(2020, 2025, 'Kawasaki', 'KLX230R', 13, 43, '520', 104, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Kawasaki KLX230
  ...yearRange(2020, 2025, 'Kawasaki', 'KLX230', 13, 43, '520', 104, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Kawasaki KLX230SM
  ...yearRange(2022, 2025, 'Kawasaki', 'KLX230SM', 14, 40, '520', 102, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Kawasaki KLX140R
  ...yearRange(2021, 2025, 'Kawasaki', 'KLX140R', 13, 47, '428', 116, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Kawasaki KLX110R
  ...yearRange(2002, 2025, 'Kawasaki', 'KLX110R', 14, 37, '420', 86, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Kawasaki KLR650
  ...yearRange(1987, 2025, 'Kawasaki', 'KLR650', 15, 43, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Kawasaki ZX-10R (998cc)
  ...yearRange(2004, 2010, 'Kawasaki', 'ZX-10R', 17, 39, '525', 110, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),
  ...yearRange(2011, 2015, 'Kawasaki', 'ZX-10R', 17, 39, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),
  ...yearRange(2016, 2020, 'Kawasaki', 'ZX-10R', 17, 39, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),
  ...yearRange(2021, 2025, 'Kawasaki', 'ZX-10R', 17, 41, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Kawasaki ZX-6R (636cc)
  ...yearRange(2003, 2006, 'Kawasaki', 'ZX-6R', 15, 40, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 636),
  ...yearRange(2007, 2012, 'Kawasaki', 'ZX-6R', 15, 43, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 636),
  ...yearRange(2013, 2024, 'Kawasaki', 'ZX-6R', 15, 43, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 636),

  // Kawasaki ZX-4RR (399cc)
  ...yearRange(2023, 2025, 'Kawasaki', 'ZX-4RR', 14, 46, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 399),

  // Kawasaki ZX-4R (399cc)
  ...yearRange(2023, 2025, 'Kawasaki', 'ZX-4R', 14, 46, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 399),

  // Kawasaki ZX-25R (249cc)
  ...yearRange(2020, 2025, 'Kawasaki', 'ZX-25R', 14, 50, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 249),

  // Kawasaki ZX-14R (1441cc)
  ...yearRange(2006, 2022, 'Kawasaki', 'ZX-14R', 17, 40, '530', 114, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 1441),

  // Kawasaki Z H2 (998cc)
  ...yearRange(2020, 2025, 'Kawasaki', 'Z H2', 17, 39, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Kawasaki Ninja 400 (399cc)
  ...yearRange(2018, 2025, 'Kawasaki', 'Ninja 400', 14, 42, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 399),

  // Kawasaki Ninja 300 (296cc)
  ...yearRange(2013, 2017, 'Kawasaki', 'Ninja 300', 14, 42, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 296),

  // Kawasaki Ninja 250R (249cc)
  ...yearRange(2008, 2012, 'Kawasaki', 'Ninja 250R', 14, 42, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 249),

  // Kawasaki Ninja 650 (649cc)
  ...yearRange(2006, 2025, 'Kawasaki', 'Ninja 650', 15, 46, '520', 114, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 649),

  // Kawasaki Ninja 1000 / Ninja 1000SX (1043cc)
  ...yearRange(2011, 2019, 'Kawasaki', 'Ninja 1000', 15, 41, '525', 112, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1043),
  ...yearRange(2020, 2025, 'Kawasaki', 'Ninja 1000SX', 15, 41, '525', 112, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1043),

  // Kawasaki Z900 (948cc)
  ...yearRange(2017, 2025, 'Kawasaki', 'Z900', 15, 44, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 948),

  // Kawasaki Z900RS (948cc)
  ...yearRange(2018, 2025, 'Kawasaki', 'Z900RS', 15, 44, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 948),

  // Kawasaki Z1000 (1043cc)
  ...yearRange(2010, 2022, 'Kawasaki', 'Z1000', 15, 42, '525', 112, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1043),

  // Kawasaki Z650 (649cc)
  ...yearRange(2017, 2025, 'Kawasaki', 'Z650', 15, 46, '520', 114, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 649),

  // Kawasaki Z400 (399cc)
  ...yearRange(2019, 2025, 'Kawasaki', 'Z400', 14, 42, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 399),

  // Kawasaki Versys 650 (649cc)
  ...yearRange(2007, 2025, 'Kawasaki', 'Versys 650', 15, 46, '520', 114, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 649),

  // Kawasaki Versys 1000 (1043cc)
  ...yearRange(2012, 2025, 'Kawasaki', 'Versys 1000', 16, 44, '525', 114, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1043),

  // Kawasaki Versys-X 300 (296cc)
  ...yearRange(2017, 2025, 'Kawasaki', 'Versys-X 300', 14, 42, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 296),

  // Kawasaki Vulcan S 650 (649cc)
  ...yearRange(2015, 2025, 'Kawasaki', 'Vulcan S 650', 15, 46, '520', 120, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 649),

  // Kawasaki W800 (773cc)
  ...yearRange(2019, 2025, 'Kawasaki', 'W800', 15, 37, '520', 104, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 773),

  // Kawasaki Z125 Pro
  ...yearRange(2017, 2025, 'Kawasaki', 'Z125 Pro', 14, 30, '420', 100, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Kawasaki Eliminator 500 (451cc)
  ...yearRange(2023, 2025, 'Kawasaki', 'Eliminator 500', 15, 42, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 451),

  // ============================================================
  // SUZUKI
  // ============================================================

  // Suzuki RM-Z250
  ...yearRange(2005, 2009, 'Suzuki', 'RM-Z250', 13, 48, '520', 114, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2010, 2020, 'Suzuki', 'RM-Z250', 13, 49, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Suzuki RM-Z450
  ...yearRange(2005, 2020, 'Suzuki', 'RM-Z450', 13, 49, '520', 116, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Suzuki RM85
  ...yearRange(2002, 2025, 'Suzuki', 'RM85', 14, 47, '428', 118, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Suzuki RM65
  ...yearRange(2003, 2005, 'Suzuki', 'RM65', 14, 47, '420', 110, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Suzuki GSX-R600 (599cc)
  ...yearRange(2001, 2005, 'Suzuki', 'GSX-R600', 16, 43, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 599),
  ...yearRange(2006, 2022, 'Suzuki', 'GSX-R600', 16, 43, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 599),

  // Suzuki GSX-R750 (750cc)
  ...yearRange(2000, 2005, 'Suzuki', 'GSX-R750', 17, 42, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 750),
  ...yearRange(2006, 2010, 'Suzuki', 'GSX-R750', 17, 43, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 750),
  ...yearRange(2011, 2022, 'Suzuki', 'GSX-R750', 17, 45, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 750),

  // Suzuki GSX-R1000 (998cc)
  ...yearRange(2001, 2008, 'Suzuki', 'GSX-R1000', 17, 42, '530', 114, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 998),
  ...yearRange(2009, 2016, 'Suzuki', 'GSX-R1000', 17, 43, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),
  ...yearRange(2017, 2024, 'Suzuki', 'GSX-R1000', 17, 44, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Suzuki Hayabusa GSX1300R (1340cc)
  ...yearRange(1999, 2007, 'Suzuki', 'Hayabusa GSX1300R', 18, 43, '530', 114, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 1340),
  ...yearRange(2008, 2020, 'Suzuki', 'Hayabusa GSX1300R', 18, 43, '530', 116, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 1340),
  ...yearRange(2021, 2025, 'Suzuki', 'Hayabusa GSX1300R', 17, 44, '530', 116, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 1340),

  // Suzuki GSX-S1000 (998cc)
  ...yearRange(2016, 2021, 'Suzuki', 'GSX-S1000', 17, 44, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),
  ...yearRange(2022, 2025, 'Suzuki', 'GSX-S1000', 17, 44, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Suzuki GSX-S1000GT (998cc)
  ...yearRange(2022, 2025, 'Suzuki', 'GSX-S1000GT', 17, 44, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Suzuki GSX-S750 (749cc)
  ...yearRange(2017, 2022, 'Suzuki', 'GSX-S750', 15, 43, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 749),

  // Suzuki GSX-8S (776cc)
  ...yearRange(2023, 2025, 'Suzuki', 'GSX-8S', 14, 46, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 776),

  // Suzuki GSX-8R (776cc)
  ...yearRange(2024, 2025, 'Suzuki', 'GSX-8R', 14, 46, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 776),

  // Suzuki Katana (998cc)
  ...yearRange(2020, 2025, 'Suzuki', 'Katana', 17, 44, '525', 114, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 998),

  // Suzuki SV650 (645cc)
  ...yearRange(1999, 2002, 'Suzuki', 'SV650', 15, 45, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 645),
  ...yearRange(2003, 2012, 'Suzuki', 'SV650', 15, 46, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 645),
  ...yearRange(2017, 2025, 'Suzuki', 'SV650', 15, 46, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 645),

  // Suzuki V-Strom 650 (645cc)
  ...yearRange(2004, 2025, 'Suzuki', 'V-Strom 650', 15, 47, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 645),

  // Suzuki V-Strom 1050 (1037cc)
  ...yearRange(2020, 2025, 'Suzuki', 'V-Strom 1050', 17, 42, '525', 118, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1037),

  // Suzuki V-Strom 800 (776cc)
  ...yearRange(2023, 2025, 'Suzuki', 'V-Strom 800', 14, 46, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 776),

  // Suzuki V-Strom 1000 (1037cc)
  ...yearRange(2014, 2019, 'Suzuki', 'V-Strom 1000', 17, 42, '525', 118, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1037),

  // Suzuki DR-Z400SM
  ...yearRange(2005, 2024, 'Suzuki', 'DR-Z400SM', 15, 44, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Suzuki DR-Z400S
  ...yearRange(2000, 2024, 'Suzuki', 'DR-Z400S', 15, 44, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Suzuki DR-Z400E
  ...yearRange(2000, 2024, 'Suzuki', 'DR-Z400E', 14, 47, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // Suzuki DR-Z125
  ...yearRange(2003, 2024, 'Suzuki', 'DR-Z125', 14, 57, '428', 128, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Suzuki DR650SE
  ...yearRange(1996, 2025, 'Suzuki', 'DR650SE', 15, 42, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525VO', 'https://www.didchain.com/products/525vo'),

  // Suzuki DR200SE
  ...yearRange(1996, 2025, 'Suzuki', 'DR200SE', 14, 42, '428', 126, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Suzuki GSX250R
  ...yearRange(2018, 2022, 'Suzuki', 'GSX250R', 14, 46, '428', 132, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Suzuki Bandit 1250 (1255cc)
  ...yearRange(2007, 2016, 'Suzuki', 'Bandit 1250', 17, 42, '530', 112, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 1255),

  // Suzuki GSX-S125
  ...yearRange(2017, 2022, 'Suzuki', 'GSX-S125', 14, 44, '428', 132, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Suzuki GSX-R125
  ...yearRange(2017, 2022, 'Suzuki', 'GSX-R125', 14, 44, '428', 132, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Suzuki TU250X
  ...yearRange(2009, 2019, 'Suzuki', 'TU250X', 14, 40, '428', 128, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // ============================================================
  // KTM
  // ============================================================

  // KTM 85 SX
  ...yearRange(2004, 2025, 'KTM', '85 SX', 14, 46, '428', 120, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // KTM 65 SX
  ...yearRange(2004, 2025, 'KTM', '65 SX', 14, 47, '420', 110, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // KTM 50 SX
  ...yearRange(2004, 2025, 'KTM', '50 SX', 11, 44, '415', 96, 'DID 415ERZ', 'https://www.didchain.com/products/415erz'),

  // KTM 125 SX
  ...yearRange(2004, 2025, 'KTM', '125 SX', 13, 50, '520', 118, 'DID 520DZ2', 'https://www.didchain.com/products/520dz2', 'DID 520ERT3', 'https://www.didchain.com/products/520ert3'),

  // KTM 150 SX
  ...yearRange(2009, 2022, 'KTM', '150 SX', 13, 50, '520', 118, 'DID 520DZ2', 'https://www.didchain.com/products/520dz2', 'DID 520ERT3', 'https://www.didchain.com/products/520ert3'),

  // KTM 250 SX (2-stroke)
  ...yearRange(2004, 2025, 'KTM', '250 SX', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 300 SX
  ...yearRange(2024, 2025, 'KTM', '300 SX', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 250 SX-F
  ...yearRange(2004, 2010, 'KTM', '250 SX-F', 13, 48, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2011, 2025, 'KTM', '250 SX-F', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 350 SX-F
  ...yearRange(2011, 2025, 'KTM', '350 SX-F', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 450 SX-F
  ...yearRange(2007, 2019, 'KTM', '450 SX-F', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),
  ...yearRange(2020, 2025, 'KTM', '450 SX-F', 13, 49, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 450 SMR
  ...yearRange(2021, 2025, 'KTM', '450 SMR', 14, 44, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 250 XC (2-stroke)
  ...yearRange(2006, 2025, 'KTM', '250 XC', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 300 XC (2-stroke)
  ...yearRange(2006, 2025, 'KTM', '300 XC', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 250 XC-F
  ...yearRange(2007, 2025, 'KTM', '250 XC-F', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 350 XC-F
  ...yearRange(2012, 2025, 'KTM', '350 XC-F', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 450 XC-F
  ...yearRange(2008, 2025, 'KTM', '450 XC-F', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // KTM 250 XC-W TPI (2-stroke)
  ...yearRange(2018, 2025, 'KTM', '250 XC-W TPI', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 300 XC-W TPI (2-stroke)
  ...yearRange(2018, 2025, 'KTM', '300 XC-W TPI', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 150 XC-W
  ...yearRange(2017, 2019, 'KTM', '150 XC-W', 14, 50, '520', 118, 'DID 520DZ2', 'https://www.didchain.com/products/520dz2', 'DID 520ERT3', 'https://www.didchain.com/products/520ert3'),

  // KTM 200 EXC
  ...yearRange(2000, 2016, 'KTM', '200 EXC', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 250 EXC (2-stroke)
  ...yearRange(2006, 2018, 'KTM', '250 EXC', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 250 EXC TPI
  ...yearRange(2018, 2025, 'KTM', '250 EXC TPI', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 250 EXC-F
  ...yearRange(2007, 2025, 'KTM', '250 EXC-F', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 300 EXC TPI
  ...yearRange(2018, 2025, 'KTM', '300 EXC TPI', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 300 EXC (2-stroke, pre-TPI)
  ...yearRange(2006, 2017, 'KTM', '300 EXC', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 350 EXC-F
  ...yearRange(2012, 2025, 'KTM', '350 EXC-F', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 450 EXC-F
  ...yearRange(2012, 2025, 'KTM', '450 EXC-F', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 500 EXC-F
  ...yearRange(2012, 2025, 'KTM', '500 EXC-F', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM 150 EXC TPI
  ...yearRange(2020, 2023, 'KTM', '150 EXC TPI', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // KTM Duke 125
  ...yearRange(2011, 2025, 'KTM', 'Duke 125', 14, 45, '428', 136, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // KTM Duke 200 (200cc)
  ...yearRange(2012, 2025, 'KTM', 'Duke 200', 14, 42, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 200),

  // KTM Duke 250 (249cc)
  ...yearRange(2017, 2025, 'KTM', 'Duke 250', 14, 44, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 249),

  // KTM RC 125
  ...yearRange(2014, 2025, 'KTM', 'RC 125', 14, 45, '428', 136, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // KTM RC 200 (200cc)
  ...yearRange(2014, 2025, 'KTM', 'RC 200', 14, 42, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 200),

  // KTM RC 390 (373cc)
  ...yearRange(2015, 2025, 'KTM', 'RC 390', 15, 44, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 373),

  // KTM Duke 390 (373cc)
  ...yearRange(2014, 2025, 'KTM', 'Duke 390', 15, 44, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 373),

  // KTM 390 Adventure (373cc)
  ...yearRange(2020, 2025, 'KTM', '390 Adventure', 15, 44, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 373),

  // KTM 690 Duke (690cc)
  ...yearRange(2008, 2019, 'KTM', '690 Duke', 16, 40, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 690),

  // KTM 790 Duke (799cc)
  ...yearRange(2018, 2023, 'KTM', '790 Duke', 16, 44, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 799),

  // KTM 890 Duke R (889cc)
  ...yearRange(2020, 2025, 'KTM', '890 Duke R', 16, 44, '520', 118, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 889),

  // KTM 890 Duke (889cc)
  ...yearRange(2021, 2025, 'KTM', '890 Duke', 16, 44, '520', 118, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 889),

  // KTM 990 Duke (947cc)
  ...yearRange(2023, 2025, 'KTM', '990 Duke', 16, 44, '520', 118, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 947),

  // KTM 690 Enduro R
  ...yearRange(2008, 2025, 'KTM', '690 Enduro R', 15, 45, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // KTM 690 SMC R
  ...yearRange(2014, 2025, 'KTM', '690 SMC R', 16, 42, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // KTM 790 Adventure
  ...yearRange(2019, 2021, 'KTM', '790 Adventure', 16, 44, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x'),

  // KTM 890 Adventure
  ...yearRange(2021, 2025, 'KTM', '890 Adventure', 16, 44, '520', 118, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 'DID 520ERV7', 'https://www.didchain.com/products/520erv7'),

  // KTM 890 Adventure R
  ...yearRange(2021, 2025, 'KTM', '890 Adventure R', 16, 44, '520', 118, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 'DID 520ERV7', 'https://www.didchain.com/products/520erv7'),

  // KTM 1290 Super Duke R (1301cc)
  ...yearRange(2014, 2025, 'KTM', '1290 Super Duke R', 17, 40, '525', 118, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1301),

  // KTM 1390 Super Duke R (1350cc)
  ...yearRange(2024, 2025, 'KTM', '1390 Super Duke R', 17, 40, '525', 118, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1350),

  // KTM 1290 Super Adventure (1301cc)
  ...yearRange(2015, 2025, 'KTM', '1290 Super Adventure', 17, 42, '525', 120, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1301),

  // KTM 1290 Super Adventure S (1301cc)
  ...yearRange(2017, 2025, 'KTM', '1290 Super Adventure S', 17, 42, '525', 120, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1301),

  // KTM 1090 Adventure (1050cc)
  ...yearRange(2017, 2019, 'KTM', '1090 Adventure', 17, 42, '525', 118, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1050),

  // KTM 1190 Adventure (1195cc)
  ...yearRange(2013, 2016, 'KTM', '1190 Adventure', 17, 42, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 1195),

  // KTM RC 8C (889cc)
  ...yearRange(2022, 2025, 'KTM', 'RC 8C', 16, 40, '520', 112, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 889),

  // ============================================================
  // HUSQVARNA
  // ============================================================

  // Husqvarna TC 50
  ...yearRange(2017, 2025, 'Husqvarna', 'TC 50', 11, 44, '415', 96, 'DID 415ERZ', 'https://www.didchain.com/products/415erz'),

  // Husqvarna TC 65
  ...yearRange(2017, 2025, 'Husqvarna', 'TC 65', 14, 47, '420', 110, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // Husqvarna TC 85
  ...yearRange(2014, 2025, 'Husqvarna', 'TC 85', 14, 46, '428', 120, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // Husqvarna TC 125
  ...yearRange(2014, 2025, 'Husqvarna', 'TC 125', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Husqvarna TC 250
  ...yearRange(2014, 2025, 'Husqvarna', 'TC 250', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Husqvarna FC 250
  ...yearRange(2014, 2025, 'Husqvarna', 'FC 250', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Husqvarna FC 350
  ...yearRange(2014, 2025, 'Husqvarna', 'FC 350', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Husqvarna FC 450
  ...yearRange(2014, 2025, 'Husqvarna', 'FC 450', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Husqvarna FC 450 Rockstar Edition
  ...yearRange(2020, 2025, 'Husqvarna', 'FC 450 Rockstar', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Husqvarna FX 350
  ...yearRange(2017, 2025, 'Husqvarna', 'FX 350', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Husqvarna FX 450
  ...yearRange(2017, 2025, 'Husqvarna', 'FX 450', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // Husqvarna TX 300i
  ...yearRange(2019, 2025, 'Husqvarna', 'TX 300i', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Husqvarna TE 150i
  ...yearRange(2020, 2025, 'Husqvarna', 'TE 150i', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Husqvarna TE 250i
  ...yearRange(2018, 2025, 'Husqvarna', 'TE 250i', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Husqvarna TE 300i
  ...yearRange(2018, 2025, 'Husqvarna', 'TE 300i', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Husqvarna FE 250
  ...yearRange(2014, 2025, 'Husqvarna', 'FE 250', 13, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Husqvarna FE 350
  ...yearRange(2014, 2025, 'Husqvarna', 'FE 350', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Husqvarna FE 450
  ...yearRange(2014, 2025, 'Husqvarna', 'FE 450', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Husqvarna FE 501
  ...yearRange(2014, 2025, 'Husqvarna', 'FE 501', 14, 48, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Husqvarna 701 Supermoto (693cc)
  ...yearRange(2016, 2025, 'Husqvarna', '701 Supermoto', 15, 45, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 693),

  // Husqvarna 701 Enduro (693cc)
  ...yearRange(2016, 2025, 'Husqvarna', '701 Enduro', 15, 45, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 693),

  // Husqvarna Norden 901 (889cc)
  ...yearRange(2022, 2025, 'Husqvarna', 'Norden 901', 16, 44, '520', 118, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 889),

  // Husqvarna Svartpilen 701 (693cc)
  ...yearRange(2019, 2025, 'Husqvarna', 'Svartpilen 701', 15, 45, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 693),

  // Husqvarna Vitpilen 701 (693cc)
  ...yearRange(2018, 2020, 'Husqvarna', 'Vitpilen 701', 15, 45, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 693),

  // Husqvarna Vitpilen 401 (373cc)
  ...yearRange(2018, 2020, 'Husqvarna', 'Vitpilen 401', 15, 44, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 373),

  // Husqvarna Svartpilen 401 (373cc)
  ...yearRange(2018, 2025, 'Husqvarna', 'Svartpilen 401', 15, 44, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 373),

  // Husqvarna Svartpilen 125
  ...yearRange(2021, 2023, 'Husqvarna', 'Svartpilen 125', 14, 44, '428', 136, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // Husqvarna Vitpilen 125
  ...yearRange(2021, 2023, 'Husqvarna', 'Vitpilen 125', 14, 44, '428', 136, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // ============================================================
  // GASGAS
  // ============================================================

  // GasGas MC 50
  ...yearRange(2021, 2025, 'GasGas', 'MC 50', 11, 44, '415', 96, 'DID 415ERZ', 'https://www.didchain.com/products/415erz'),

  // GasGas MC 65
  ...yearRange(2021, 2025, 'GasGas', 'MC 65', 14, 47, '420', 110, 'DID 420NZ3', 'https://www.didchain.com/products/420nz3'),

  // GasGas MC 85
  ...yearRange(2021, 2025, 'GasGas', 'MC 85', 14, 46, '428', 120, 'DID 428NZ', 'https://www.didchain.com/products/428nz', 'DID 428HD', 'https://www.didchain.com/products/428hd'),

  // GasGas MC 125
  ...yearRange(2021, 2025, 'GasGas', 'MC 125', 13, 50, '520', 118, 'DID 520DZ2', 'https://www.didchain.com/products/520dz2', 'DID 520ERT3', 'https://www.didchain.com/products/520ert3'),

  // GasGas MC 250 (2-stroke)
  ...yearRange(2021, 2025, 'GasGas', 'MC 250', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // GasGas MC 250F
  ...yearRange(2021, 2025, 'GasGas', 'MC 250F', 13, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // GasGas MC 350F
  ...yearRange(2022, 2025, 'GasGas', 'MC 350F', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // GasGas MC 450F
  ...yearRange(2021, 2025, 'GasGas', 'MC 450F', 14, 50, '520', 118, 'DID 520ERT3', 'https://www.didchain.com/products/520ert3', 'DID 520DZ2', 'https://www.didchain.com/products/520dz2'),

  // GasGas EX 250F
  ...yearRange(2021, 2025, 'GasGas', 'EX 250F', 13, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // GasGas EX 350F
  ...yearRange(2022, 2025, 'GasGas', 'EX 350F', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // GasGas EX 450F
  ...yearRange(2021, 2025, 'GasGas', 'EX 450F', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // GasGas EC 200
  ...yearRange(2021, 2025, 'GasGas', 'EC 200', 13, 48, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // GasGas EC 250
  ...yearRange(2021, 2025, 'GasGas', 'EC 250', 13, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // GasGas EC 300
  ...yearRange(2021, 2025, 'GasGas', 'EC 300', 13, 48, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // GasGas EC 350F
  ...yearRange(2022, 2025, 'GasGas', 'EC 350F', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // GasGas SM 700
  ...yearRange(2022, 2025, 'GasGas', 'SM 700', 15, 45, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // GasGas ES 700
  ...yearRange(2023, 2025, 'GasGas', 'ES 700', 15, 45, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo'),

  // ============================================================
  // BETA
  // ============================================================

  // Beta RR 125 (2-stroke)
  ...yearRange(2018, 2025, 'Beta', 'RR 125', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR 200 (2-stroke)
  ...yearRange(2019, 2025, 'Beta', 'RR 200', 13, 48, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR 250 (2-stroke)
  ...yearRange(2013, 2025, 'Beta', 'RR 250', 13, 48, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR 300 (2-stroke)
  ...yearRange(2013, 2025, 'Beta', 'RR 300', 13, 48, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR 350
  ...yearRange(2011, 2025, 'Beta', 'RR 350', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR 390
  ...yearRange(2015, 2025, 'Beta', 'RR 390', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR 430
  ...yearRange(2015, 2025, 'Beta', 'RR 430', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR 480
  ...yearRange(2015, 2025, 'Beta', 'RR 480', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR-S 350
  ...yearRange(2017, 2025, 'Beta', 'RR-S 350', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR-S 390
  ...yearRange(2017, 2025, 'Beta', 'RR-S 390', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR-S 430
  ...yearRange(2017, 2025, 'Beta', 'RR-S 430', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta RR-S 480
  ...yearRange(2017, 2025, 'Beta', 'RR-S 480', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta X-Trainer 300
  ...yearRange(2015, 2025, 'Beta', 'X-Trainer 300', 13, 48, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Beta X-Trainer 250
  ...yearRange(2022, 2025, 'Beta', 'X-Trainer 250', 13, 48, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // ============================================================
  // CFMOTO
  // ============================================================

  // CFMoto 700CL-X (693cc)
  ...yearRange(2022, 2025, 'CFMoto', '700CL-X', 16, 43, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 693),

  // CFMoto 700CL-X Sport (693cc)
  ...yearRange(2023, 2025, 'CFMoto', '700CL-X Sport', 16, 43, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 693),

  // CFMoto 700CL-X Heritage (693cc)
  ...yearRange(2022, 2025, 'CFMoto', '700CL-X Heritage', 16, 43, '525', 112, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 693),

  // CFMoto 700CL-X Adventure (693cc)
  ...yearRange(2022, 2025, 'CFMoto', '700CL-X Adventure', 16, 43, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 693),

  // CFMoto 450SS (449cc)
  ...yearRange(2024, 2025, 'CFMoto', '450SS', 14, 46, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 449),

  // CFMoto 450SR (449cc)
  ...yearRange(2024, 2025, 'CFMoto', '450SR', 14, 46, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 449),

  // CFMoto 450NK (449cc)
  ...yearRange(2024, 2025, 'CFMoto', '450NK', 14, 46, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 449),

  // CFMoto 450CL-C (449cc)
  ...yearRange(2024, 2025, 'CFMoto', '450CL-C', 14, 42, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 449),

  // CFMoto 450MT (449cc)
  ...yearRange(2024, 2025, 'CFMoto', '450MT', 14, 46, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 449),

  // CFMoto 650NK (649cc)
  ...yearRange(2017, 2025, 'CFMoto', '650NK', 15, 43, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 649),

  // CFMoto 650GT (649cc)
  ...yearRange(2019, 2025, 'CFMoto', '650GT', 15, 43, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 649),

  // CFMoto 650MT (649cc)
  ...yearRange(2019, 2025, 'CFMoto', '650MT', 15, 43, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 649),

  // CFMoto 800MT (799cc)
  ...yearRange(2022, 2025, 'CFMoto', '800MT', 16, 44, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 799),

  // CFMoto 300NK (292cc)
  ...yearRange(2018, 2025, 'CFMoto', '300NK', 14, 42, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 292),

  // CFMoto 300SR (292cc)
  ...yearRange(2020, 2025, 'CFMoto', '300SR', 14, 42, '520', 108, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 292),

  // CFMoto 300CL-X (292cc)
  ...yearRange(2023, 2025, 'CFMoto', '300CL-X', 14, 38, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 292),

  // ============================================================
  // DUCATI
  // ============================================================

  // Ducati Panigale 899 (898cc)
  ...yearRange(2014, 2015, 'Ducati', 'Panigale 899', 15, 44, '520', 106, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 898),

  // Ducati Panigale 959 (955cc)
  ...yearRange(2016, 2019, 'Ducati', 'Panigale 959', 15, 43, '520', 106, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 955),

  // Ducati Panigale 1199 (1199cc)
  ...yearRange(2012, 2014, 'Ducati', 'Panigale 1199', 15, 39, '525', 104, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1199),

  // Ducati Panigale 1299 (1285cc)
  ...yearRange(2015, 2018, 'Ducati', 'Panigale 1299', 15, 39, '525', 104, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1285),

  // Ducati Panigale V2 (955cc)
  ...yearRange(2020, 2025, 'Ducati', 'Panigale V2', 15, 43, '520', 106, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 955),

  // Ducati Panigale V4 (1103cc)
  ...yearRange(2018, 2025, 'Ducati', 'Panigale V4', 16, 41, '525', 114, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1103),

  // Ducati Streetfighter V4 (1103cc)
  ...yearRange(2020, 2025, 'Ducati', 'Streetfighter V4', 15, 42, '525', 116, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1103),

  // Ducati Streetfighter V2 (955cc)
  ...yearRange(2022, 2025, 'Ducati', 'Streetfighter V2', 15, 45, '520', 106, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 955),

  // Ducati Monster 821 (821cc)
  ...yearRange(2014, 2020, 'Ducati', 'Monster 821', 15, 46, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 821),

  // Ducati Monster 937 (937cc)
  ...yearRange(2021, 2025, 'Ducati', 'Monster 937', 15, 46, '520', 106, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 937),

  // Ducati Monster 1200 (1198cc)
  ...yearRange(2014, 2021, 'Ducati', 'Monster 1200', 15, 42, '525', 108, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1198),

  // Ducati Hypermotard 950 (937cc)
  ...yearRange(2019, 2024, 'Ducati', 'Hypermotard 950', 15, 45, '520', 106, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 937),

  // Ducati Scrambler 800 (803cc)
  ...yearRange(2015, 2024, 'Ducati', 'Scrambler 800', 15, 46, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 803),

  // Ducati Scrambler 1100 (1079cc)
  ...yearRange(2018, 2023, 'Ducati', 'Scrambler 1100', 15, 41, '525', 106, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1079),

  // Ducati SuperSport 950 (937cc)
  ...yearRange(2021, 2025, 'Ducati', 'SuperSport 950', 15, 43, '520', 106, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 937),

  // Ducati Multistrada 1260 (1262cc)
  ...yearRange(2018, 2020, 'Ducati', 'Multistrada 1260', 15, 43, '525', 110, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1262),

  // Ducati Multistrada V4 (1158cc)
  ...yearRange(2021, 2025, 'Ducati', 'Multistrada V4', 16, 42, '525', 124, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1158),

  // Ducati Multistrada V2 (937cc)
  ...yearRange(2022, 2025, 'Ducati', 'Multistrada V2', 15, 43, '520', 110, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 937),

  // Ducati DesertX (937cc)
  ...yearRange(2022, 2025, 'Ducati', 'DesertX', 15, 46, '520', 114, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 937),

  // Ducati Diavel V4 (1158cc)
  ...yearRange(2023, 2025, 'Ducati', 'Diavel V4', 17, 42, '525', 120, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1158),

  // ============================================================
  // BMW
  // ============================================================

  // BMW S1000RR (999cc)
  ...yearRange(2010, 2018, 'BMW', 'S1000RR', 17, 44, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 999),
  ...yearRange(2019, 2022, 'BMW', 'S1000RR', 17, 45, '525', 120, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 999),
  ...yearRange(2023, 2025, 'BMW', 'S1000RR', 17, 46, '525', 122, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 999),

  // BMW M1000RR (999cc)
  ...yearRange(2021, 2025, 'BMW', 'M1000RR', 17, 45, '525', 120, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 999),

  // BMW S1000R (999cc)
  ...yearRange(2014, 2025, 'BMW', 'S1000R', 17, 45, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 999),

  // BMW S1000XR (999cc)
  ...yearRange(2015, 2025, 'BMW', 'S1000XR', 17, 45, '525', 118, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 999),

  // BMW F900R (895cc)
  ...yearRange(2020, 2025, 'BMW', 'F900R', 17, 46, '525', 120, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 895),

  // BMW F900XR (895cc)
  ...yearRange(2020, 2025, 'BMW', 'F900XR', 17, 46, '525', 120, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 895),

  // BMW F850GS (853cc)
  ...yearRange(2018, 2025, 'BMW', 'F850GS', 17, 44, '525', 122, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 853),

  // BMW F750GS (853cc)
  ...yearRange(2018, 2025, 'BMW', 'F750GS', 17, 44, '525', 122, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 853),

  // BMW G310R (313cc)
  ...yearRange(2017, 2025, 'BMW', 'G310R', 16, 40, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 313),

  // BMW G310GS (313cc)
  ...yearRange(2017, 2025, 'BMW', 'G310GS', 16, 40, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 313),

  // ============================================================
  // APRILIA
  // ============================================================

  // Aprilia RSV4 (999cc)
  ...yearRange(2009, 2025, 'Aprilia', 'RSV4', 16, 42, '525', 110, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 999),

  // Aprilia Tuono V4 (1077cc)
  ...yearRange(2011, 2025, 'Aprilia', 'Tuono V4', 16, 42, '525', 110, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1077),

  // Aprilia RS 660 (659cc)
  ...yearRange(2021, 2025, 'Aprilia', 'RS 660', 15, 43, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 659),

  // Aprilia Tuono 660 (659cc)
  ...yearRange(2021, 2025, 'Aprilia', 'Tuono 660', 15, 43, '520', 110, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 659),

  // Aprilia Tuareg 660 (659cc)
  ...yearRange(2022, 2025, 'Aprilia', 'Tuareg 660', 15, 44, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 659),

  // Aprilia Shiver 900 (896cc)
  ...yearRange(2017, 2022, 'Aprilia', 'Shiver 900', 16, 44, '525', 108, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 896),

  // Aprilia Dorsoduro 900 (896cc)
  ...yearRange(2017, 2022, 'Aprilia', 'Dorsoduro 900', 16, 44, '525', 108, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 896),

  // Aprilia RS 125
  ...yearRange(2006, 2012, 'Aprilia', 'RS 125', 13, 60, '428', 134, 'DID 428VX', 'https://www.didchain.com/products/428vx', 'DID 428NZ', 'https://www.didchain.com/products/428nz'),

  // ============================================================
  // TRIUMPH
  // ============================================================

  // Triumph Street Triple 765 (765cc)
  ...yearRange(2017, 2025, 'Triumph', 'Street Triple 765', 16, 47, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 765),

  // Triumph Daytona 765 (765cc)
  ...yearRange(2020, 2025, 'Triumph', 'Daytona 765', 16, 47, '525', 116, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 765),

  // Triumph Speed Triple 1200 (1160cc)
  ...yearRange(2021, 2025, 'Triumph', 'Speed Triple 1200', 16, 44, '525', 112, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1160),

  // Triumph Speed Triple 1050 (1050cc)
  ...yearRange(2011, 2020, 'Triumph', 'Speed Triple 1050', 18, 42, '530', 106, 'DID 530VX3', 'https://www.didchain.com/products/530vx3', 'DID 530ZVM-X2', 'https://www.didchain.com/products/530zvm-x2', 1050),

  // Triumph Trident 660 (660cc)
  ...yearRange(2021, 2025, 'Triumph', 'Trident 660', 15, 47, '520', 112, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', 660),

  // Triumph Speed 400 (398cc)
  ...yearRange(2023, 2025, 'Triumph', 'Speed 400', 14, 41, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 398),

  // Triumph Scrambler 400 X (398cc)
  ...yearRange(2024, 2025, 'Triumph', 'Scrambler 400 X', 14, 41, '520', 106, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 398),

  // Triumph Tiger 900 (888cc)
  ...yearRange(2020, 2025, 'Triumph', 'Tiger 900', 16, 50, '525', 122, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 888),

  // Triumph Tiger 850 Sport (888cc)
  ...yearRange(2021, 2025, 'Triumph', 'Tiger 850 Sport', 16, 50, '525', 122, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 888),

  // Triumph Tiger 1200 (1160cc)
  ...yearRange(2022, 2025, 'Triumph', 'Tiger 1200', 17, 45, '525', 122, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1160),

  // Triumph Bonneville T120 (1200cc)
  ...yearRange(2016, 2025, 'Triumph', 'Bonneville T120', 17, 37, '525', 100, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1200),

  // Triumph Bonneville T100 (900cc)
  ...yearRange(2017, 2025, 'Triumph', 'Bonneville T100', 17, 41, '520', 102, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 900),

  // Triumph Street Twin (900cc)
  ...yearRange(2016, 2024, 'Triumph', 'Street Twin', 17, 41, '520', 102, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 900),

  // Triumph Street Scrambler (900cc)
  ...yearRange(2017, 2025, 'Triumph', 'Street Scrambler', 17, 41, '520', 102, 'DID 520ZVM-X', 'https://www.didchain.com/products/520zvm-x', undefined, undefined, 900),

  // Triumph Thruxton 1200 (1200cc)
  ...yearRange(2016, 2021, 'Triumph', 'Thruxton 1200', 18, 42, '525', 100, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1200),

  // Triumph Scrambler 1200 (1200cc)
  ...yearRange(2019, 2025, 'Triumph', 'Scrambler 1200', 16, 46, '525', 114, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1200),

  // ============================================================
  // INDIAN
  // ============================================================

  // Indian FTR 1200 (1203cc)
  ...yearRange(2019, 2021, 'Indian', 'FTR 1200', 17, 49, '525', 118, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1203),

  // Indian FTR S (1203cc)
  ...yearRange(2022, 2025, 'Indian', 'FTR S', 17, 45, '525', 114, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1203),

  // Indian FTR R Carbon (1203cc)
  ...yearRange(2022, 2024, 'Indian', 'FTR R Carbon', 17, 45, '525', 114, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1203),

  // Indian FTR Rally (1203cc)
  ...yearRange(2022, 2023, 'Indian', 'FTR Rally', 17, 49, '525', 116, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1203),

  // Indian FTR Sport (1203cc)
  ...yearRange(2022, 2025, 'Indian', 'FTR Sport', 17, 45, '525', 114, 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', undefined, undefined, 1203),

  // ============================================================
  // SHERCO
  // ============================================================

  // Sherco SE-R 250
  ...yearRange(2014, 2025, 'Sherco', 'SE-R 250', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Sherco SE-R 300
  ...yearRange(2014, 2025, 'Sherco', 'SE-R 300', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // Sherco SEF-R 450
  ...yearRange(2015, 2025, 'Sherco', 'SEF-R 450', 14, 50, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520ERVT', 'https://www.didchain.com/products/520ervt'),

  // ============================================================
  // ROYAL ENFIELD
  // ============================================================

  // Royal Enfield Continental GT 650 (648cc)
  ...yearRange(2018, 2025, 'Royal Enfield', 'Continental GT 650', 15, 38, '525', 106, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 648),

  // Royal Enfield Interceptor 650 (648cc)
  ...yearRange(2018, 2025, 'Royal Enfield', 'Interceptor 650', 15, 38, '525', 106, 'DID 525VX3', 'https://www.didchain.com/products/525vx3', 'DID 525ZVM-X2', 'https://www.didchain.com/products/525zvm-x2', 648),

  // Royal Enfield Himalayan 450 (452cc)
  ...yearRange(2024, 2025, 'Royal Enfield', 'Himalayan 450', 15, 48, '520', 118, 'DID 520VX3', 'https://www.didchain.com/products/520vx3', 'DID 520VO', 'https://www.didchain.com/products/520vo', 452),
];

export const chainPitchMap: Record<string, number> = {
  '415': 12.70,
  '420': 12.70,
  '428': 12.70,
  '520': 15.875,
  '525': 15.875,
  '530': 15.875,
  '532': 15.875,
  '630': 19.05,
};

export function getUniqueMakes(): string[] {
  const makes = new Set(motorcycleDatabase.map(m => m.make));
  return Array.from(makes).sort();
}

export function getModelsForMake(make: string): string[] {
  const models = new Set(
    motorcycleDatabase.filter(m => m.make === make).map(m => m.model)
  );
  return Array.from(models).sort();
}

export function getYearsForMakeModel(make: string, model: string): number[] {
  const years = new Set(
    motorcycleDatabase
      .filter(m => m.make === make && m.model === model)
      .map(m => m.year)
  );
  return Array.from(years).sort((a, b) => b - a);
}

export function getSpec(year: number, make: string, model: string): MotorcycleSpec | undefined {
  return motorcycleDatabase.find(
    m => m.year === year && m.make === make && m.model === model
  );
}

export function calculateGearingRatio(front: number, rear: number): number {
  return Math.round((rear / front) * 1000) / 1000;
}

/**
 * Returns dynamic street chain recommendations based on CC displacement and chain size.
 * These rules apply to street bikes only; off-road/dirt bikes use hardcoded values.
 * Returns null if the CC/chain combination doesn't match a street recommendation rule.
 */
export function getStreetChainRecommendations(cc: number, chainSize: string): {
  recommendedChain: string;
  recommendedChainUrl: string;
  secondaryChain?: string;
  secondaryChainUrl?: string;
} | null {
  if (chainSize === '520') {
    if (cc >= 850) {
      return {
        recommendedChain: 'DID 520ZVM-X',
        recommendedChainUrl: 'https://www.didchain.com/products/520zvm-x',
      };
    }
    if (cc >= 600 && cc <= 849) {
      return {
        recommendedChain: 'DID 520VX3',
        recommendedChainUrl: 'https://www.didchain.com/products/520vx3',
        secondaryChain: 'DID 520ZVM-X',
        secondaryChainUrl: 'https://www.didchain.com/products/520zvm-x',
      };
    }
    return null;
  }

  if (chainSize === '525') {
    if (cc >= 1001) {
      return {
        recommendedChain: 'DID 525ZVM-X2',
        recommendedChainUrl: 'https://www.didchain.com/products/525zvm-x2',
      };
    }
    if (cc >= 450 && cc <= 1000) {
      return {
        recommendedChain: 'DID 525VX3',
        recommendedChainUrl: 'https://www.didchain.com/products/525vx3',
        secondaryChain: 'DID 525ZVM-X2',
        secondaryChainUrl: 'https://www.didchain.com/products/525zvm-x2',
      };
    }
    return null;
  }

  if (chainSize === '530') {
    if (cc >= 700 && cc <= 1100) {
      return {
        recommendedChain: 'DID 530VX3',
        recommendedChainUrl: 'https://www.didchain.com/products/530vx3',
        secondaryChain: 'DID 530ZVM-X2',
        secondaryChainUrl: 'https://www.didchain.com/products/530zvm-x2',
      };
    }
    return null;
  }

  return null;
}

export function estimateChainLength(
  originalFront: number,
  originalRear: number,
  originalLength: number,
  newFront: number,
  newRear: number,
): number {
  const sprocketDiff = ((newFront - originalFront) + (newRear - originalRear)) / 2;
  const estimatedLength = originalLength + Math.round(sprocketDiff);
  return estimatedLength % 2 === 0 ? estimatedLength : estimatedLength + 1;
}
