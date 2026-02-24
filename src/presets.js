export const presets = [
  {
    name: 'Rainbow Cycle',
    code: 'R+25;(R>200)->G+25;(G>200)->B+25;(B>200)->R-25'
  },
  {
    name: 'Red Spread',
    code: 'R+10'
  },
  {
    name: 'Green Wave',
    code: 'G+15;(G>100)->R+5'
  },
  {
    name: 'Blue Pulse',
    code: 'B+20;(B>150)->B-10'
  },
  {
    name: 'RGB Balance',
    code: 'R+5;G+5;B+5'
  }
];

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { presets };
}
