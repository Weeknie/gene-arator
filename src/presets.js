export const presets = [
  {
    name: 'Rainbow cycle',
    code: 'R+25;(R>200)->G+25;(G>200)->B+25;(B>200)->R-25'
  },
  {
    name: 'Self sustaining cells',
    code: 'R-25;G-25;B-25;(R>50)->R+100;(G>50)->G+100;(B>50)->B+100'
  }
];

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { presets };
}
