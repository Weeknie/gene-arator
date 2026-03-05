export class Legend {
  /**
   * @param {HTMLElement} container - The element to render the legend into
   */
  constructor(container) {
    this.container = container;
    this.entries = [
      { syntax: 'R+25',                    description: 'Produce protein R at rate 25' },
      { syntax: 'B-10',                    description: 'Consume protein B at rate 10' },
      { syntax: '(R>200)->G+25',           description: 'If R > 200, produce G at rate 25' },
      { syntax: '(R<100)->B-5',            description: 'If R < 100, consume B at rate 5' },
      { syntax: '(R>50)->(G<200)->B+10',   description: 'Multiple conditions -- chain with ->' },
      { syntax: 'R=diff(0.3)',             description: 'Set diffusion rate for R (0–1)' },
      { syntax: 'B=decay(0.15)',           description: 'Set decay rate for B (0–1)' },
      { syntax: '; or newline',            description: 'Separate multiple genes' },
    ];
  }

  render() {
    this.container.innerHTML = '';

    const heading = document.createElement('h3');
    heading.textContent = 'Syntax Guide';
    heading.className = 'legend-heading';
    this.container.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'legend-list';

    this.entries.forEach(entry => {
      const item = document.createElement('li');
      item.className = 'legend-item';

      const syntax = document.createElement('code');
      syntax.className = 'legend-syntax';
      syntax.textContent = entry.syntax;

      const description = document.createElement('span');
      description.className = 'legend-description';
      description.textContent = entry.description;

      item.appendChild(syntax);
      item.appendChild(description);
      list.appendChild(item);
    });

    this.container.appendChild(list);
  }
}

// CommonJS export for tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Legend };
}
