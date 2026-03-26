export interface ChainSpec {
  chain: string;
  category: string;
  pinLength: number;
  pinDia: number;
  plateThicknessIn: number;
  plateThicknessOut: number;
  weight: number;
  tensileStrength: number;
  seal: string;
  chainLifeIndex: number;
  masterLinkZJ: string;
  masterLinkFJ: string;
  masterLinkRJ: string;
  maxCC: number;
  group: string;
  buyUrl: string;
}

export interface ChainApplication {
  category: string;
  chain: string;
  maxCC: number;
  buyUrl: string;
}

export const chainBuyLinks: Record<string, string> = {
  '415ERZ': 'https://www.didchain.com/products/415erz-1',
  '420NZ3': 'https://www.didchain.com/products/420nz3',
  '428NZ': 'https://www.didchain.com/products/428nz',
  '520ERS3': 'https://www.didchain.com/products/520ers3',
  '520ERT3': 'https://www.didchain.com/products/520ert3',
  '520MX': 'https://www.didchain.com/products/520mx',
  '520DZ2': 'https://www.didchain.com/products/520dz2',
  '520ERVT': 'https://www.didchain.com/products/520ervt',
  '520ATV2': 'https://www.didchain.com/products/520atv2',
  '520ERV7': 'https://www.didchain.com/products/520erv7',
  '520ZVM-X': 'https://www.didchain.com/products/520zvm-x',
  '525ZVM-X2': 'https://www.didchain.com/products/525zvm-x2',
  '530ZVM-X2': 'https://www.didchain.com/products/530zvm-x2',
  '428VX': 'https://www.didchain.com/products/428vx',
  '520VX3': 'https://www.didchain.com/products/520vx3',
  '525VX3': 'https://www.didchain.com/products/525vx3',
  '530VX3': 'https://www.didchain.com/products/530vx3',
  '420V': 'https://www.didchain.com/products/420v',
  '520VO': 'https://www.didchain.com/products/520vo',
  '525VO': 'https://www.didchain.com/products/525vo',
  '530VO': 'https://www.didchain.com/products/530vo',
  '630V': 'https://www.didchain.com/collections/didchains',
  '520NZ': 'https://www.didchain.com/products/520nz',
  '525NZ': 'https://www.didchain.com/products/525nz',
  '530NZ': 'https://www.didchain.com/products/530nz',
  '420D': 'https://www.didchain.com/collections/didchains',
  '428D': 'https://www.didchain.com/products/428d',
  '428HD': 'https://www.didchain.com/products/428hd',
  '520': 'https://www.didchain.com/products/520d-standard',
  '525': 'https://www.didchain.com/collections/didchains',
  '530': 'https://www.didchain.com/collections/didchains',
};

export const chainSpecGroups = [
  'Exclusive Racing Chains',
  'Super X-Ring Chains',
  'Pro X-Ring Chains',
  'Standard O-Ring Chains',
  'Super Non-O-Ring Chains',
  'Standard Non-O-Ring Chains',
] as const;

export const chainSpecs: ChainSpec[] = [
  { chain: '415ERZ', category: 'Mini MX', pinLength: 0.531, pinDia: 0.156, plateThicknessIn: 1.5, plateThicknessOut: 1.5, weight: 1.45, tensileStrength: 4540, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'Option', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 250, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/415erz-1' },
  { chain: '420NZ3', category: 'Mini MX', pinLength: 0.659, pinDia: 0.156, plateThicknessIn: 1.8, plateThicknessOut: 1.8, weight: 1.18, tensileStrength: 4930, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'N/A', masterLinkFJ: 'Option', masterLinkRJ: 'Included', maxCC: 150, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/420nz3' },
  { chain: '428NZ', category: 'Mini MX', pinLength: 0.744, pinDia: 0.177, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 2.2, tensileStrength: 5740, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'Option', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 100, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/428nz' },
  { chain: '520ERS3', category: 'Trial', pinLength: 0.659, pinDia: 0.206, plateThicknessIn: 1.8, plateThicknessOut: 1.8, weight: 2.59, tensileStrength: 5800, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'Option', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 250, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/520ers3' },
  { chain: '520ERT3', category: 'Motocross', pinLength: 0.693, pinDia: 0.210, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 2.99, tensileStrength: 8300, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'Option', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 450, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/520ert3' },
  { chain: '520MX', category: 'Motocross', pinLength: 0.732, pinDia: 0.210, plateThicknessIn: 2.2, plateThicknessOut: 2.2, weight: 3.43, tensileStrength: 8930, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'Option', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 500, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/520mx' },
  { chain: '520DZ2', category: 'Motocross', pinLength: 0.695, pinDia: 0.206, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 3.08, tensileStrength: 7870, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'Option', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 450, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/520dz2' },
  { chain: '520ERVT', category: 'Enduro', pinLength: 0.736, pinDia: 0.206, plateThicknessIn: 1.8, plateThicknessOut: 2.0, weight: 3.22, tensileStrength: 8440, seal: 'X', chainLifeIndex: 3500, masterLinkZJ: 'Option', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 500, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/520ervt' },
  { chain: '520ATV2', category: 'ATV', pinLength: 0.738, pinDia: 0.206, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 3.42, tensileStrength: 8430, seal: 'X', chainLifeIndex: 3250, masterLinkZJ: 'Option', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 750, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/520atv2' },
  { chain: '520ERV7', category: 'Baja/Super Sports', pinLength: 0.752, pinDia: 0.217, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 3.41, tensileStrength: 8800, seal: 'X', chainLifeIndex: 3500, masterLinkZJ: 'Included', masterLinkFJ: 'N/A', masterLinkRJ: 'N/A', maxCC: 1000, group: 'Exclusive Racing Chains', buyUrl: 'https://www.didchain.com/products/520erv7' },

  { chain: '520ZVM-X', category: 'Street', pinLength: 0.830, pinDia: 0.206, plateThicknessIn: 2.2, plateThicknessOut: 2.2, weight: 3.59, tensileStrength: 8745, seal: 'X', chainLifeIndex: 3500, masterLinkZJ: 'Included', masterLinkFJ: 'N/A', masterLinkRJ: 'N/A', maxCC: 1200, group: 'Super X-Ring Chains', buyUrl: 'https://www.didchain.com/products/520zvm-x' },
  { chain: '525ZVM-X2', category: 'Street', pinLength: 0.906, pinDia: 0.217, plateThicknessIn: 2.4, plateThicknessOut: 2.6, weight: 4.65, tensileStrength: 10100, seal: 'X', chainLifeIndex: 4000, masterLinkZJ: 'Included', masterLinkFJ: 'N/A', masterLinkRJ: 'N/A', maxCC: 1300, group: 'Super X-Ring Chains', buyUrl: 'https://www.didchain.com/products/525zvm-x2' },
  { chain: '530ZVM-X2', category: 'Street', pinLength: 0.965, pinDia: 0.217, plateThicknessIn: 2.4, plateThicknessOut: 2.6, weight: 4.85, tensileStrength: 10400, seal: 'X', chainLifeIndex: 4000, masterLinkZJ: 'Included', masterLinkFJ: 'N/A', masterLinkRJ: 'N/A', maxCC: 1400, group: 'Super X-Ring Chains', buyUrl: 'https://www.didchain.com/products/530zvm-x2' },

  { chain: '428VX', category: 'Street / ATV', pinLength: 0.813, pinDia: 0.197, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 2.66, tensileStrength: 7420, seal: 'X', chainLifeIndex: 2700, masterLinkZJ: 'Option', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 350, group: 'Pro X-Ring Chains', buyUrl: 'https://www.didchain.com/products/428vx' },
  { chain: '520VX3', category: 'Street / ATV', pinLength: 0.736, pinDia: 0.206, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 3.35, tensileStrength: 8210, seal: 'X', chainLifeIndex: 3500, masterLinkZJ: 'Option', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 800, group: 'Pro X-Ring Chains', buyUrl: 'https://www.didchain.com/products/520vx3' },
  { chain: '525VX3', category: 'Street', pinLength: 0.866, pinDia: 0.217, plateThicknessIn: 2.2, plateThicknessOut: 2.2, weight: 4.09, tensileStrength: 9980, seal: 'X', chainLifeIndex: 4000, masterLinkZJ: 'Included', masterLinkFJ: 'Option', masterLinkRJ: 'N/A', maxCC: 1000, group: 'Pro X-Ring Chains', buyUrl: 'https://www.didchain.com/products/525vx3' },
  { chain: '530VX3', category: 'Street', pinLength: 0.931, pinDia: 0.217, plateThicknessIn: 2.2, plateThicknessOut: 2.2, weight: 4.29, tensileStrength: 9980, seal: 'X', chainLifeIndex: 4000, masterLinkZJ: 'Included', masterLinkFJ: 'N/A', masterLinkRJ: 'N/A', maxCC: 1100, group: 'Pro X-Ring Chains', buyUrl: 'https://www.didchain.com/products/530vx3' },

  { chain: '420V', category: 'Commuter', pinLength: 0.665, pinDia: 0.156, plateThicknessIn: 1.5, plateThicknessOut: 1.5, weight: 1.6, tensileStrength: 3560, seal: 'O', chainLifeIndex: 700, masterLinkZJ: 'Option', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 100, group: 'Standard O-Ring Chains', buyUrl: 'https://www.didchain.com/products/420v' },
  { chain: '520VO', category: 'Street / ATV', pinLength: 0.795, pinDia: 0.200, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 3.31, tensileStrength: 8000, seal: 'O', chainLifeIndex: 2350, masterLinkZJ: 'Option', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 750, group: 'Standard O-Ring Chains', buyUrl: 'https://www.didchain.com/products/520vo' },
  { chain: '525VO', category: 'Street / ATV', pinLength: 0.886, pinDia: 0.206, plateThicknessIn: 2.2, plateThicknessOut: 2.2, weight: 3.88, tensileStrength: 9220, seal: 'O', chainLifeIndex: 2500, masterLinkZJ: 'Included', masterLinkFJ: 'Option', masterLinkRJ: 'N/A', maxCC: 900, group: 'Standard O-Ring Chains', buyUrl: 'https://www.didchain.com/products/525vo' },
  { chain: '530VO', category: 'Street / ATV', pinLength: 0.963, pinDia: 0.206, plateThicknessIn: 2.2, plateThicknessOut: 2.4, weight: 4.39, tensileStrength: 9220, seal: 'O', chainLifeIndex: 2500, masterLinkZJ: 'Included', masterLinkFJ: 'N/A', masterLinkRJ: 'N/A', maxCC: 1000, group: 'Standard O-Ring Chains', buyUrl: 'https://www.didchain.com/products/530vo' },
  { chain: '630V', category: 'Vintage Bikes', pinLength: 0.996, pinDia: 0.235, plateThicknessIn: 2.4, plateThicknessOut: 2.4, weight: 6.52, tensileStrength: 10820, seal: 'O', chainLifeIndex: 2050, masterLinkZJ: '(XJ)', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 1200, group: 'Standard O-Ring Chains', buyUrl: 'https://www.didchain.com/collections/didchains' },

  { chain: '520NZ', category: 'Vintage Bikes', pinLength: 0.722, pinDia: 0.206, plateThicknessIn: 2.2, plateThicknessOut: 2.2, weight: 3.54, tensileStrength: 8050, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'Option', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 250, group: 'Super Non-O-Ring Chains', buyUrl: 'https://www.didchain.com/products/520nz' },
  { chain: '525NZ', category: 'Vintage Bikes', pinLength: 0.811, pinDia: 0.206, plateThicknessIn: 2.4, plateThicknessOut: 2.4, weight: 3.99, tensileStrength: 8820, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'Option', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 400, group: 'Super Non-O-Ring Chains', buyUrl: 'https://www.didchain.com/products/525nz' },
  { chain: '530NZ', category: 'Vintage Bikes', pinLength: 0.888, pinDia: 0.206, plateThicknessIn: 2.4, plateThicknessOut: 2.4, weight: 4.07, tensileStrength: 8600, seal: 'N/A', chainLifeIndex: 410, masterLinkZJ: 'Option', masterLinkFJ: 'Included', masterLinkRJ: 'N/A', maxCC: 750, group: 'Super Non-O-Ring Chains', buyUrl: 'https://www.didchain.com/products/530nz' },

  { chain: '420D', category: 'Small Bikes', pinLength: 0.581, pinDia: 0.156, plateThicknessIn: 1.5, plateThicknessOut: 1.5, weight: 1.54, tensileStrength: 3970, seal: 'N/A', chainLifeIndex: 100, masterLinkZJ: 'N/A', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 80, group: 'Standard Non-O-Ring Chains', buyUrl: 'https://www.didchain.com/collections/didchains' },
  { chain: '428D', category: 'Small Bikes', pinLength: 0.657, pinDia: 0.177, plateThicknessIn: 1.5, plateThicknessOut: 1.5, weight: 1.84, tensileStrength: 4230, seal: 'N/A', chainLifeIndex: 100, masterLinkZJ: 'N/A', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 125, group: 'Standard Non-O-Ring Chains', buyUrl: 'https://www.didchain.com/products/428d' },
  { chain: '428HD', category: 'Small Bikes', pinLength: 0.744, pinDia: 0.177, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 2.2, tensileStrength: 5250, seal: 'N/A', chainLifeIndex: 100, masterLinkZJ: 'N/A', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 125, group: 'Standard Non-O-Ring Chains', buyUrl: 'https://www.didchain.com/products/428hd' },
  { chain: '520', category: 'Small Bikes', pinLength: 0.689, pinDia: 0.200, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 3.12, tensileStrength: 6700, seal: 'N/A', chainLifeIndex: 100, masterLinkZJ: 'N/A', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 250, group: 'Standard Non-O-Ring Chains', buyUrl: 'https://www.didchain.com/products/520d-standard' },
  { chain: '525', category: 'Small Bikes', pinLength: 0.732, pinDia: 0.200, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 3.28, tensileStrength: 6930, seal: 'N/A', chainLifeIndex: 100, masterLinkZJ: 'N/A', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 400, group: 'Standard Non-O-Ring Chains', buyUrl: 'https://www.didchain.com/collections/didchains' },
  { chain: '530', category: 'Small Bikes', pinLength: 0.799, pinDia: 0.200, plateThicknessIn: 2.0, plateThicknessOut: 2.0, weight: 3.71, tensileStrength: 6930, seal: 'N/A', chainLifeIndex: 100, masterLinkZJ: 'N/A', masterLinkFJ: 'N/A', masterLinkRJ: 'Included', maxCC: 400, group: 'Standard Non-O-Ring Chains', buyUrl: 'https://www.didchain.com/collections/didchains' },
];

export const chainApplications: ChainApplication[] = [
  { category: 'Street & Supersport', chain: '428VX', maxCC: 350, buyUrl: 'https://www.didchain.com/products/428vx' },
  { category: 'Street & Supersport', chain: '520VO', maxCC: 750, buyUrl: 'https://www.didchain.com/products/520vo' },
  { category: 'Street & Supersport', chain: '525VO', maxCC: 900, buyUrl: 'https://www.didchain.com/products/525vo' },
  { category: 'Street & Supersport', chain: '530VO', maxCC: 1000, buyUrl: 'https://www.didchain.com/products/530vo' },
  { category: 'Street & Supersport', chain: '520VX3', maxCC: 800, buyUrl: 'https://www.didchain.com/products/520vx3' },
  { category: 'Street & Supersport', chain: '525VX3', maxCC: 1000, buyUrl: 'https://www.didchain.com/products/525vx3' },
  { category: 'Street & Supersport', chain: '530VX3', maxCC: 1000, buyUrl: 'https://www.didchain.com/products/530vx3' },
  { category: 'Street & Supersport', chain: '520ZVM-X', maxCC: 1200, buyUrl: 'https://www.didchain.com/products/520zvm-x' },
  { category: 'Street & Supersport', chain: '525ZVM-X2', maxCC: 1300, buyUrl: 'https://www.didchain.com/products/525zvm-x2' },
  { category: 'Street & Supersport', chain: '530ZVM-X2', maxCC: 1400, buyUrl: 'https://www.didchain.com/products/530zvm-x2' },
  { category: 'Road Racing & Superbike', chain: '415ERZ', maxCC: 250, buyUrl: 'https://www.didchain.com/products/415erz-1' },
  { category: 'Road Racing & Superbike', chain: '520ERS3', maxCC: 250, buyUrl: 'https://www.didchain.com/products/520ers3' },
  { category: 'Road Racing & Superbike', chain: '520ERV7', maxCC: 1000, buyUrl: 'https://www.didchain.com/products/520erv7' },
  { category: 'Supercross & Motocross', chain: '415ERZ', maxCC: 250, buyUrl: 'https://www.didchain.com/products/415erz-1' },
  { category: 'Supercross & Motocross', chain: '420NZ3', maxCC: 150, buyUrl: 'https://www.didchain.com/products/420nz3' },
  { category: 'Supercross & Motocross', chain: '428NZ', maxCC: 100, buyUrl: 'https://www.didchain.com/products/428nz' },
  { category: 'Supercross & Motocross', chain: '520DZ2', maxCC: 450, buyUrl: 'https://www.didchain.com/products/520dz2' },
  { category: 'Supercross & Motocross', chain: '520ERT3', maxCC: 450, buyUrl: 'https://www.didchain.com/products/520ert3' },
  { category: 'Supercross & Motocross', chain: '520MX', maxCC: 500, buyUrl: 'https://www.didchain.com/products/520mx' },
  { category: 'Dual Purpose & Adventure', chain: '428VX', maxCC: 350, buyUrl: 'https://www.didchain.com/products/428vx' },
  { category: 'Dual Purpose & Adventure', chain: '520VX3', maxCC: 800, buyUrl: 'https://www.didchain.com/products/520vx3' },
  { category: 'Dual Purpose & Adventure', chain: '525VX3', maxCC: 1000, buyUrl: 'https://www.didchain.com/products/525vx3' },
  { category: 'Dual Purpose & Adventure', chain: '530VX3', maxCC: 1000, buyUrl: 'https://www.didchain.com/products/530vx3' },
  { category: 'Dual Purpose & Adventure', chain: '520ZVM-X', maxCC: 1200, buyUrl: 'https://www.didchain.com/products/520zvm-x' },
  { category: 'Dual Purpose & Adventure', chain: '525ZVM-X2', maxCC: 1300, buyUrl: 'https://www.didchain.com/products/525zvm-x2' },
  { category: 'Dual Purpose & Adventure', chain: '530ZVM-X2', maxCC: 1400, buyUrl: 'https://www.didchain.com/products/530zvm-x2' },
  { category: 'Trial', chain: '520ERS3', maxCC: 250, buyUrl: 'https://www.didchain.com/products/520ers3' },
  { category: 'Rally & Enduro', chain: '520ERVT', maxCC: 500, buyUrl: 'https://www.didchain.com/products/520ervt' },
  { category: 'Rally & Enduro', chain: '520VX3', maxCC: 800, buyUrl: 'https://www.didchain.com/products/520vx3' },
  { category: 'Rally & Enduro', chain: '520ERV7', maxCC: 750, buyUrl: 'https://www.didchain.com/products/520erv7' },
  { category: 'ATV', chain: '428VX', maxCC: 350, buyUrl: 'https://www.didchain.com/products/428vx' },
  { category: 'ATV', chain: '520VO', maxCC: 750, buyUrl: 'https://www.didchain.com/products/520vo' },
  { category: 'ATV', chain: '525VO', maxCC: 900, buyUrl: 'https://www.didchain.com/products/525vo' },
  { category: 'ATV', chain: '520VX3', maxCC: 800, buyUrl: 'https://www.didchain.com/products/520vx3' },
  { category: 'ATV', chain: '520ATV2', maxCC: 750, buyUrl: 'https://www.didchain.com/products/520atv2' },
];
