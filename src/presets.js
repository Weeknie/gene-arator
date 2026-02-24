export const presets = [
  {
    name: 'Rainbow cycle',
    code: 'R+25\n(R>200)->G+25\n(G>200)->B+25\n(B>200)->R-25'
  },
  {
    name: 'Self sustaining cells',
    code: 'R-25\nG-25\nB-25\n(R>50)->R+100\n(G>50)->G+100\n(B>50)->B+100'
  }
];

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { presets };
}
