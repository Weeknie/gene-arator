export const presets = [
  {
    name: 'Rainbow cycle',
    code: 'R+25;\n(R>200)->G+50;(R>200)->R+25;(R>200)->B-100;\n(G>200)->B+50;(G>200)->G+25;(G>200)->R-100;\n(B>200)->R+50;(B>200)->B+25;(B>200)->G-100;'
  },
  {
    name: 'Self sustaining cells (place R, G or B to trigger)',
    code: 'R-25;\nG-25;\nB-25;\n(R>50)->R+100;\n(G>50)->G+100;\n(B>50)->B+100'
  },
  {
    name: 'Fading circles (place R to trigger)',
    code: 'R=diff(0.5);R=decay(0.005);\n(R>200)->R+60;\nB=diff(0);\n(R<5)->(R>3)->B+50'
  }
];

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { presets };
}
