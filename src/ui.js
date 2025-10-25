/** UI helpers for DOM, summaries, and dividers */

/**
 * Create a styled section with title and intro paragraph.
 * @param {string} title
 * @param {string} intro
 * @returns {HTMLElement}
 */
export function createSection(title, intro) {
  const section = document.createElement('section');
  section.style.marginTop = '32px';
  section.style.padding = '24px';
  section.style.background = '#ffffff';
  section.style.borderRadius = '16px';
  section.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.08)';

  const heading = document.createElement('h2');
  heading.textContent = title;
  heading.style.marginTop = '0';
  section.appendChild(heading);

  const introPara = document.createElement('p');
  introPara.textContent = intro;
  section.appendChild(introPara);

  return section;
}

/**
 * Create a simple table from headers and row objects.
 * @param {string[]} headers
 * @param {Record<string, string|number>[]} rows
 * @returns {HTMLTableElement}
 */
export function createTable(headers, rows) {
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.margin = '16px 0';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headers.forEach((h) => {
    const th = document.createElement('th');
    th.textContent = h;
    th.style.textAlign = 'left';
    th.style.padding = '8px';
    th.style.borderBottom = '2px solid #cbd2d9';
    th.style.fontSize = '0.9rem';
    th.style.color = '#52606d';
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach((row, idx) => {
    const tr = document.createElement('tr');
    Object.values(row).forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      td.style.padding = '8px';
      td.style.borderBottom = '1px solid #e4e7eb';
      td.style.background = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
      td.style.fontSize = '0.9rem';
      td.style.color = '#243b53';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

/**
 * Format a number with fixed digits.
 * @param {number|string} value
 * @param {number} [digits=2]
 * @returns {string}
 */
export function formatNumber(value, digits = 2) {
  return Number.parseFloat(value).toFixed(digits);
}

/**
 * Build summary list for linear regression.
 * @param {{slope:number, intercept:number, error:number}} model
 */
export function summarizeLinearRegression(model) {
  const list = document.createElement('ul');
  list.innerHTML = `
    <li>Slope (how much sweetness rises per extra tasting hour): <strong>${formatNumber(model.slope)}</strong></li>
    <li>Intercept (sweetness before tasting even starts): <strong>${formatNumber(model.intercept)}</strong></li>
    <li>Average prediction error: <strong>${formatNumber(model.error)}</strong></li>
  `;
  return list;
}

/**
 * Build summary list for logistic regression.
 * @param {{weights:number[], bias:number, accuracy:number}} model
 */
export function summarizeLogisticRegression(model) {
  const list = document.createElement('ul');
  list.innerHTML = `
    <li>Weights learned for crunchiness & color depth: <strong>${model.weights.map((w) => formatNumber(w)).join(', ')}</strong></li>
    <li>Bias (baseline confidence): <strong>${formatNumber(model.bias)}</strong></li>
    <li>Accuracy on the tasting notes: <strong>${formatNumber(model.accuracy * 100)}%</strong></li>
  `;
  return list;
}

/**
 * Build summary list for the tiny neural net.
 * @param {{epochs:number, accuracy:number}} model
 */
export function summarizeNeuralNetwork(model) {
  const list = document.createElement('ul');
  list.innerHTML = `
    <li>Hidden taste detectors discovered: <strong>2 neurons</strong></li>
    <li>Training epochs completed: <strong>${model.epochs}</strong></li>
    <li>Accuracy on tricky surprises: <strong>${formatNumber(model.accuracy * 100)}%</strong></li>
  `;
  return list;
}

/**
 * Insert a decorative divider between story sections.
 * @param {HTMLElement} root
 */
export function addStoryDivider(root) {
  const divider = document.createElement('div');
  divider.style.height = '2px';
  divider.style.margin = '48px 0 24px';
  divider.style.background = 'linear-gradient(90deg, rgba(79, 70, 229, 0.25), rgba(14, 165, 233, 0.6))';
  root.appendChild(divider);
}

