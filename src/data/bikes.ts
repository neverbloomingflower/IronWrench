export interface Bike {
  id: string;
  name: string;
  year: string;
  engine: string;
  tag?: string;
}

export interface Mod {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'frame' | 'bars' | 'tank' | 'exhaust' | 'seat' | 'fork' | 'controls' | 'lights';
}

export interface GalleryBuild {
  id: string;
  title: string;
  bike: string;
  style: string;
  builder: string;
  location: string;
  totalCost: number;
  likes: number;
  mods: string[];
  featured?: boolean;
}

export const BIKES: Bike[] = [
  { id: 'sporty883', name: 'Harley Sportster 883', year: '1982–2003', engine: 'Air-cooled Evolution V-twin', tag: 'Popular' },
  { id: 'sporty1200', name: 'Harley Sportster 1200', year: '1988–2022', engine: 'Air-cooled Evolution V-twin' },
  { id: 'dyna', name: 'Harley Dyna Wide Glide', year: '1993–2017', engine: 'Twin Cam 88/96' },
  { id: 'softail', name: 'Harley Softail FXST', year: '1984–2017', engine: 'Hidden rear suspension', tag: 'Classic' },
  { id: 'shovel', name: 'Harley Shovelhead FLH', year: '1966–1984', engine: 'Shovelhead V-twin', tag: 'Old School' },
  { id: 'panhead', name: 'Harley Panhead FL', year: '1948–1965', engine: 'Panhead V-twin', tag: 'Rare' },
  { id: 'shadow750', name: 'Honda Shadow VT750', year: '1983–2009', engine: 'Liquid-cooled V-twin' },
  { id: 'shadow1100', name: 'Honda Shadow ACE 1100', year: '1995–2007', engine: 'Liquid-cooled V-twin' },
  { id: 'vstar650', name: 'Yamaha V-Star 650', year: '1998–2011', engine: 'Budget-friendly chopper base' },
  { id: 'vstar1100', name: 'Yamaha V-Star 1100', year: '1999–2009', engine: 'Air-cooled V-twin' },
  { id: 'vulcan900', name: 'Kawasaki Vulcan 900', year: '2006–present', engine: 'Air-cooled V-twin' },
  { id: 'intruder1500', name: 'Suzuki Intruder VS1500', year: '1998–2004', engine: 'V-twin 1458cc' },
];

export const BUILD_STYLES = [
  { id: 'hardtail', label: 'Hardtail Chop', icon: '⛓' },
  { id: 'bobber', label: 'Bobber', icon: '🏍' },
  { id: 'brat', label: 'Brat Style', icon: '🔧' },
  { id: 'cafe', label: 'Cafe Racer', icon: '☕' },
  { id: 'desert', label: 'Desert Sled', icon: '🌵' },
  { id: 'oldschool', label: 'Old School', icon: '🕯' },
];

export const MODS: Mod[] = [
  { id: 'hardtail_frame', name: 'Hardtail Frame Swap', description: 'Full rigid frame — backbone of any real chop', price: 2400, category: 'frame' },
  { id: 'softail_frame', name: 'Custom Softail Frame', description: 'Hidden rear suspension for clean lines', price: 3200, category: 'frame' },
  { id: 'stretched_frame', name: 'Stretched Frame', description: '4" stretch, 2" up for that long low look', price: 1800, category: 'frame' },
  { id: 'ape_hangers', name: 'Ape Hanger Bars', description: '16" rise pullback — signature chopper look', price: 890, category: 'bars' },
  { id: 'drag_bars', name: 'Drag Bars', description: 'Low flat bars for aggressive riding position', price: 320, category: 'bars' },
  { id: 'buckhorn', name: 'Buckhorn Bars', description: 'Classic mid-rise pulled-back cruiser bars', price: 280, category: 'bars' },
  { id: 'stretched_tank', name: 'Stretched Gas Tank', description: 'Tunnel tank for that long low profile', price: 1200, category: 'tank' },
  { id: 'peanut_tank', name: 'Peanut Tank', description: 'Small 2.2 gal bobber tank — clean & light', price: 680, category: 'tank' },
  { id: 'coffin_tank', name: 'Coffin Tank', description: 'Flat top coffin-shaped custom tank', price: 950, category: 'tank' },
  { id: 'drag_pipes', name: 'Drag Pipe Exhaust', description: 'Straight drag pipes — loud & raw', price: 650, category: 'exhaust' },
  { id: 'fishtails', name: 'Fishtail Exhaust', description: 'Classic fishtail tips — old school style', price: 720, category: 'exhaust' },
  { id: 'upswept', name: 'Upswept Shorties', description: '2-into-1 upswept for brat/scrambler look', price: 580, category: 'exhaust' },
  { id: 'solo_seat', name: 'Solo Tuck & Roll Seat', description: 'Hand-stitched leather solo saddle', price: 320, category: 'seat' },
  { id: 'spring_seat', name: 'Solo Spring Seat', description: 'Old school spring-mounted solo saddle', price: 280, category: 'seat' },
  { id: 'brat_seat', name: 'Brat Style Flat Seat', description: 'Flat foam & leather pad over rear fender', price: 220, category: 'seat' },
  { id: 'springer', name: 'Springer Front End', description: 'Classic pre-war springer fork', price: 780, category: 'fork' },
  { id: 'girder', name: 'Girder Fork', description: 'True rigid vintage girder fork', price: 1100, category: 'fork' },
  { id: 'extended_tubes', name: 'Extended Fork Tubes', description: '+6" tubes for that long chopper lean', price: 420, category: 'fork' },
  { id: 'suicide_clutch', name: 'Suicide Clutch Conversion', description: 'Hand clutch to foot clutch conversion', price: 240, category: 'controls' },
  { id: 'jockey_shift', name: 'Jockey Shift / Ratchet Top', description: 'Hand shift with ratchet top conversion', price: 310, category: 'controls' },
  { id: 'forward_controls', name: 'Forward Controls', description: 'Full forward control kit for stretch riding', price: 480, category: 'controls' },
  { id: 'bullet_headlight', name: 'Bullet Headlight Nacelle', description: 'Chrome bullet headlight with nacelle', price: 450, category: 'lights' },
  { id: 'tombstone_taillight', name: 'Tombstone Taillight', description: 'Classic tombstone-style LED tail light', price: 180, category: 'lights' },
  { id: 'cowl_headlight', name: 'Cowl Headlight', description: 'Retro cowl-mounted headlight', price: 390, category: 'lights' },
];

export const GALLERY_BUILDS: GalleryBuild[] = [
  { id: '1', title: 'Project Ironside', bike: '\'79 Shovelhead FLH', style: 'Hardtail Chop', builder: '@ironjaw_moto', location: 'Milwaukee, WI', totalCost: 11400, likes: 847, mods: ['Hardtail Frame', 'Ape Hangers', 'Coffin Tank', 'Drag Pipes', 'Springer Fork', 'Solo Seat'], featured: true },
  { id: '2', title: 'Widow Maker', bike: '\'87 Sporty 883', style: 'Bobber', builder: '@steel_sal', location: 'Detroit, MI', totalCost: 6200, likes: 423, mods: ['Softail Frame', 'Buckhorn Bars', 'Peanut Tank', 'Fishtails'] },
  { id: '3', title: 'Desert Rat', bike: '\'03 Shadow VT750', style: 'Brat Style', builder: '@mex_moto', location: 'El Paso, TX', totalCost: 4800, likes: 318, mods: ['Drag Bars', 'Upswept Shorties', 'Brat Seat', 'Extended Tubes', 'Bullet Headlight'] },
  { id: '4', title: 'Chrome Ghost', bike: '\'95 Softail FXST', style: 'Hardtail Chop', builder: '@chrome_dave', location: 'Phoenix, AZ', totalCost: 8900, likes: 612, mods: ['Hardtail Frame', 'Ape Hangers', 'Stretched Tank', 'Drag Pipes', 'Girder Fork', 'Suicide Clutch', 'Tombstone Taillight'] },
  { id: '5', title: 'The Pilgrim', bike: '\'92 Dyna Wide Glide', style: 'Old School', builder: '@road_rat', location: 'Nashville, TN', totalCost: 5500, likes: 289, mods: ['Buckhorn Bars', 'Peanut Tank', 'Fishtails', 'Solo Seat', 'Spring Seat'] },
  { id: '6', title: 'Nightfall', bike: '\'68 Panhead FL', style: 'Hardtail Chop', builder: '@panhead_pete', location: 'Austin, TX', totalCost: 18200, likes: 1204, mods: ['Hardtail Frame', 'Ape Hangers', 'Stretched Tank', 'Drag Pipes', 'Girder Fork', 'Jockey Shift', 'Cowl Headlight', 'Tombstone Taillight'] },
];

export const DIAGNOSTIC_SYMPTOMS = [
  'Ticking at idle',
  'Hard cold start',
  'Primary oil leak',
  'Vibration above 60mph',
  'Backfiring on decel',
  'Clutch slipping',
  'Electrical issues',
  'Carb flooding',
  'Overheating',
  'Oil consumption',
];
