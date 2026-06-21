import OilBarrelRounded from '@mui/icons-material/OilBarrelRounded';
import ScienceRounded from '@mui/icons-material/ScienceRounded';
import MemoryRounded from '@mui/icons-material/MemoryRounded';
import AgricultureRounded from '@mui/icons-material/AgricultureRounded';
import CheckroomRounded from '@mui/icons-material/CheckroomRounded';
import DiamondRounded from '@mui/icons-material/DiamondRounded';
import DirectionsCarRounded from '@mui/icons-material/DirectionsCarRounded';
import TerrainRounded from '@mui/icons-material/TerrainRounded';
import PrecisionManufacturingRounded from '@mui/icons-material/PrecisionManufacturingRounded';
import ViewInArRounded from '@mui/icons-material/ViewInArRounded';
import OpacityRounded from '@mui/icons-material/OpacityRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import FlightRounded from '@mui/icons-material/FlightRounded';
import DirectionsBoatRounded from '@mui/icons-material/DirectionsBoatRounded';
import MedicationRounded from '@mui/icons-material/MedicationRounded';
import CategoryRounded from '@mui/icons-material/CategoryRounded';

import hs2LabelMap from '../../data/labels/hs2-labels.json';

// One icon per commodity basket — a shape channel on top of color so baskets stay distinguishable
// for color-blind readers and when hues sit close together. Unmapped baskets fall back to null.
export const BASKET_ICON = {
  Petroleum: OilBarrelRounded,
  Chemicals: ScienceRounded,
  Electronics: MemoryRounded,
  Agriculture: AgricultureRounded,
  'Textiles & apparel': CheckroomRounded,
  'Gems & jewellery': DiamondRounded,
  'Transport equipment': DirectionsCarRounded,
  'Ores & minerals': TerrainRounded,
  Machinery: PrecisionManufacturingRounded,
  'Base metals': ViewInArRounded,
  'Plastics & rubber': OpacityRounded,
};

export const REST_ICON = MoreHorizRounded;
export const basketIconFor = (name, rest) => (rest ? REST_ICON : BASKET_ICON[name]) || null;

// White or ink, whichever contrasts better — for icons sitting on a filled slice/band.
export const iconInk = (hex) => {
  const c = String(hex).replace('#', '');
  if (c.length < 6) return '#fff';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#0b1220' : '#fff';
};

// HS-2 chapter icons — used on the partner butterfly and partner trend charts.
export const HS2_ICON = {
  27: OilBarrelRounded,
  71: DiamondRounded,
  84: PrecisionManufacturingRounded,
  85: MemoryRounded,
  30: MedicationRounded,
  87: DirectionsCarRounded,
  88: FlightRounded,
  89: DirectionsBoatRounded,
  25: TerrainRounded,
  26: TerrainRounded,
};
[28, 29, 31, 32, 33, 38, 90].forEach((ch) => {
  HS2_ICON[ch] = ScienceRounded;
});
[39, 40].forEach((ch) => {
  HS2_ICON[ch] = OpacityRounded;
});
[72, 73, 74, 75, 76, 78, 79, 80, 81, 82, 83].forEach((ch) => {
  HS2_ICON[ch] = ViewInArRounded;
});
[2, 3, 4, 7, 8, 9, 10, 11, 12, 15, 16, 17, 19, 20, 21, 23, 24].forEach((ch) => {
  HS2_ICON[ch] = AgricultureRounded;
});
[41, 42, 43].forEach((ch) => {
  HS2_ICON[ch] = CheckroomRounded;
});
for (let ch = 50; ch <= 67; ch += 1) HS2_ICON[ch] = CheckroomRounded;

export const hs2Icon = (hs2) => HS2_ICON[Number(hs2)] || CategoryRounded;

export const hs2Label = (chapter) => {
  if (hs2LabelMap[chapter.hs2]) return hs2LabelMap[chapter.hs2];
  const s = String(chapter.desc || '')
    .toLowerCase()
    .split(/[;,.]/)[0]
    .trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : `HS ${chapter.hs2}`;
};
