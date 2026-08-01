import { IMPORT_BY_CODE, EXPORT_BY_CODE, HS4_YEARS } from '../lib/transforms.js';

// Curated pairings of imported inputs and the exported outputs they feed. Matched by product
// family — NOT an official input–output table — so they are directional illustrations.
export const VALUE_CHAINS = [
  {
    key: 'petroleum',
    name: 'Petroleum refining',
    inputs: ['2709'],
    outputs: ['2710'],
    story:
      'Imported crude is refined into diesel, petrol and jet fuel; part of the output is shipped back out, the rest fuels the domestic economy.',
    players: ['Reliance Industries', 'Indian Oil', 'BPCL', 'HPCL', 'Nayara Energy'],
  },
  {
    key: 'gems',
    name: 'Gems & jewellery',
    inputs: ['7108', '7102', '7106', '7103'],
    outputs: ['7113', '7102', '7103'],
    story:
      'Gold, silver, rough diamonds and stones come in; cut diamonds and finished jewellery go out. Diamonds appear on both sides — rough in, polished out — while most gold stays as domestic jewellery demand.',
    players: ['Kiran Gems', 'Shree Ramkrishna Exports', 'Rajesh Exports', 'Titan', 'Malabar Gold'],
  },
  {
    key: 'electronics',
    name: 'Phones & electronics',
    inputs: ['8542', '8541', '8524', '8507', '8534', '8525', '8504', '8529'],
    outputs: ['8517'],
    story:
      'Chips, display modules, batteries, circuit boards, camera modules and chargers come in; assembled phones and telecom gear go out — the clearest picture of assembly-led export growth.',
    players: [
      'Foxconn India',
      'Tata Electronics',
      'Samsung India',
      'Dixon Technologies',
      'Pegatron India',
    ],
  },
  {
    key: 'pharma',
    name: 'Pharmaceuticals',
    inputs: ['2933', '2934', '2941'],
    outputs: ['3004'],
    story:
      'Bulk drug intermediates and antibiotics come in; finished medicines go out at several times the input value — the deepest value-addition of any chain here.',
    players: ['Sun Pharma', "Dr. Reddy's", 'Cipla', 'Aurobindo Pharma', 'Lupin'],
  },
  {
    key: 'textiles',
    name: 'Cotton & textiles',
    inputs: ['5201'],
    outputs: ['5205', '6109'],
    story:
      'Raw cotton comes in (a recent reversal — India long exported it); spun yarn and knitwear go out.',
    players: ['Vardhman Textiles', 'Welspun', 'Trident', 'Arvind', 'Shahi Exports'],
  },
  {
    key: 'steel',
    name: 'Coal & steel',
    inputs: ['2701', '7204'],
    outputs: ['7208', '7210'],
    story:
      'Coking coal and scrap feed the mills, but most of the steel stays home — exports cover only a sliver of the input bill.',
    players: ['JSW Steel', 'Tata Steel', 'SAIL', 'ArcelorMittal Nippon', 'Jindal Steel'],
  },
];

// One categorical color per chain, shared by the map ribbons, the selector chips and the
// detail header so the same chain reads as the same thing everywhere.
export const CHAIN_COLOR = {
  petroleum: '#475569',
  gems: '#756783',
  electronics: '#46698f',
  pharma: '#4f756d',
  textiles: '#9a5868',
  steel: '#926b46',
};

// Latest-year totals per chain for the overview map, ordered by input size so both stacks share
// one order and the ribbons never cross.
export const CHAIN_FLOWS = (() => {
  const last = HS4_YEARS.length - 1;
  return VALUE_CHAINS.map((chain) => ({
    key: chain.key,
    name: chain.name,
    inVal: chain.inputs.reduce(
      (sum, code) => sum + (IMPORT_BY_CODE.get(code)?.series[last] ?? 0),
      0,
    ),
    outVal: chain.outputs.reduce(
      (sum, code) => sum + (EXPORT_BY_CODE.get(code)?.series[last] ?? 0),
      0,
    ),
  })).sort((a, b) => b.inVal - a.inVal);
})();
