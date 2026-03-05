/**
 * @jest-environment jsdom
 */

const { Legend } = require('../../src/adapters/Legend');

describe('Legend', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should render a heading with text "Syntax Guide"', () => {
    const legend = new Legend(container);
    legend.render();
    const heading = container.querySelector('.legend-heading');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe('Syntax Guide');
  });

  test('should render a UL with class legend-list', () => {
    const legend = new Legend(container);
    legend.render();
    const list = container.querySelector('.legend-list');
    expect(list).toBeTruthy();
    expect(list.tagName).toBe('UL');
  });

  test('should render 8 legend-item elements', () => {
    const legend = new Legend(container);
    legend.render();
    const items = container.querySelectorAll('.legend-item');
    expect(items.length).toBe(8);
  });

  test('each legend-item should have a legend-syntax code element', () => {
    const legend = new Legend(container);
    legend.render();
    const items = container.querySelectorAll('.legend-item');
    items.forEach(item => {
      const syntax = item.querySelector('.legend-syntax');
      expect(syntax).toBeTruthy();
      expect(syntax.tagName).toBe('CODE');
    });
  });

  test('each legend-item should have a legend-description span element', () => {
    const legend = new Legend(container);
    legend.render();
    const items = container.querySelectorAll('.legend-item');
    items.forEach(item => {
      const desc = item.querySelector('.legend-description');
      expect(desc).toBeTruthy();
      expect(desc.tagName).toBe('SPAN');
    });
  });

  test('should render syntax entry "R+25"', () => {
    const legend = new Legend(container);
    legend.render();
    const syntaxEls = container.querySelectorAll('.legend-syntax');
    const texts = Array.from(syntaxEls).map(el => el.textContent);
    expect(texts).toContain('R+25');
  });

  test('should render syntax entry "B-10"', () => {
    const legend = new Legend(container);
    legend.render();
    const syntaxEls = container.querySelectorAll('.legend-syntax');
    const texts = Array.from(syntaxEls).map(el => el.textContent);
    expect(texts).toContain('B-10');
  });

  test('should render syntax entry "(R>200)->G+25"', () => {
    const legend = new Legend(container);
    legend.render();
    const syntaxEls = container.querySelectorAll('.legend-syntax');
    const texts = Array.from(syntaxEls).map(el => el.textContent);
    expect(texts).toContain('(R>200)->G+25');
  });

  test('should render syntax entry "(R<100)->B-5"', () => {
    const legend = new Legend(container);
    legend.render();
    const syntaxEls = container.querySelectorAll('.legend-syntax');
    const texts = Array.from(syntaxEls).map(el => el.textContent);
    expect(texts).toContain('(R<100)->B-5');
  });

  test('should render syntax entry "(R>50)->(G<200)->B+10"', () => {
    const legend = new Legend(container);
    legend.render();
    const syntaxEls = container.querySelectorAll('.legend-syntax');
    const texts = Array.from(syntaxEls).map(el => el.textContent);
    expect(texts).toContain('(R>50)->(G<200)->B+10');
  });

  test('should render syntax entry "R=diff(0.3)"', () => {
    const legend = new Legend(container);
    legend.render();
    const syntaxEls = container.querySelectorAll('.legend-syntax');
    const texts = Array.from(syntaxEls).map(el => el.textContent);
    expect(texts).toContain('R=diff(0.3)');
  });

  test('should render syntax entry "B=decay(0.15)"', () => {
    const legend = new Legend(container);
    legend.render();
    const syntaxEls = container.querySelectorAll('.legend-syntax');
    const texts = Array.from(syntaxEls).map(el => el.textContent);
    expect(texts).toContain('B=decay(0.15)');
  });

  test('should render syntax entry "; or newline"', () => {
    const legend = new Legend(container);
    legend.render();
    const syntaxEls = container.querySelectorAll('.legend-syntax');
    const texts = Array.from(syntaxEls).map(el => el.textContent);
    expect(texts).toContain('; or newline');
  });

  test('should handle being called on an empty container without error', () => {
    const emptyContainer = document.createElement('div');
    const legend = new Legend(emptyContainer);
    expect(() => legend.render()).not.toThrow();
  });

  test('should replace content when render() is called twice (not append)', () => {
    const legend = new Legend(container);
    legend.render();
    legend.render();
    const items = container.querySelectorAll('.legend-item');
    expect(items.length).toBe(8);
    const headings = container.querySelectorAll('.legend-heading');
    expect(headings.length).toBe(1);
  });
});
