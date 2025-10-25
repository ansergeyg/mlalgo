/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
const root = document.createElement('div');
root.id = 'app';
root.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
root.style.maxWidth = '960px';
root.style.margin = '0 auto';
root.style.padding = '32px';
root.style.lineHeight = '1.6';
root.style.background = '#f9fbff';
root.style.color = '#1f2933';

if (!document.body.contains(root)) {
  document.body.style.margin = '0';
  document.body.style.background = '#e5ecf5';
  document.body.appendChild(root);
}

document.title = 'Machine Learning Mini Story';

const header = document.createElement('header');
header.innerHTML = `
  <h1 style="margin-bottom: 0.2em">A Tiny Machine Learning Journey</h1>
  <p style="margin-top: 0">Follow along as our orchard scientist, Ada, learns how data can guide better apple tasting!</p>
`;
root.appendChild(header);

const DEFAULT_LINEAR_TASTINGS = Object.freeze([
  { hours: 1, score: 52 },
  { hours: 2, score: 57 },
  { hours: 3, score: 63 },
  { hours: 4, score: 69 },
  { hours: 5, score: 75 },
  { hours: 6, score: 83 },
]);

const DEFAULT_LOGISTIC_APPLES = Object.freeze([
  { features: [2, 2], label: 0 },
  { features: [3, 3], label: 0 },
  { features: [4, 2], label: 0 },
  { features: [6, 5], label: 1 },
  { features: [7, 6], label: 1 },
  { features: [8, 5], label: 1 },
  { features: [5, 7], label: 1 },
  { features: [3, 6], label: 0 },
]);

const DEFAULT_NEURAL_SURPRISES = Object.freeze([
  { features: [0, 0], label: 0 },
  { features: [0, 1], label: 1 },
  { features: [1, 0], label: 1 },
  { features: [1, 1], label: 0 },
]);

function cloneDataset(dataset) {
  return dataset.map((item) => {
    const copy = { ...item };
    if (Array.isArray(item.features)) {
      copy.features = [...item.features];
    }
    return copy;
  });
}

function createSection(title, intro) {
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

  if (intro) {
    const introPara = document.createElement('p');
    introPara.textContent = intro;
    section.appendChild(introPara);
  }

  return section;
}

function createTable(headers, rows) {
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
    headers.forEach((headerLabel) => {
      const td = document.createElement('td');
      td.textContent = row[headerLabel];
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

function createCanvas(width = 360, height = 260) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.borderRadius = '12px';
  canvas.style.border = '1px solid #d9e2ec';
  canvas.style.background = '#fefeff';
  canvas.style.marginTop = '16px';
  return canvas;
}

function createJsonTrainer({ title, sample, onTrain, description, buttonLabel = 'Train on this data' }) {
  const wrapper = document.createElement('div');
  wrapper.style.marginTop = '24px';
  wrapper.style.padding = '16px';
  wrapper.style.border = '1px solid #cbd5f5';
  wrapper.style.background = '#f8f9ff';
  wrapper.style.borderRadius = '12px';

  const heading = document.createElement('h3');
  heading.textContent = title;
  heading.style.marginTop = '0';
  heading.style.marginBottom = '8px';
  heading.style.fontSize = '1.05rem';
  heading.style.color = '#4338ca';
  wrapper.appendChild(heading);

  const helper = document.createElement('p');
  helper.textContent = description
    || 'Paste a JSON array of examples and press “Train” to rerun the model on your own tasting notes. All values should be numeric.';
  helper.style.marginTop = '0';
  helper.style.fontSize = '0.9rem';
  helper.style.color = '#334155';
  wrapper.appendChild(helper);

  const textarea = document.createElement('textarea');
  let defaultValue = '[]';
  if (Array.isArray(sample)) {
    defaultValue = JSON.stringify(cloneDataset(sample), null, 2);
  } else if (sample && Array.isArray(sample.examples)) {
    defaultValue = JSON.stringify(sample.examples, null, 2);
  }
  textarea.value = defaultValue;
  textarea.style.width = '100%';
  textarea.style.minHeight = '160px';
  textarea.style.fontFamily = '"Fira Code", Consolas, monospace';
  textarea.style.fontSize = '0.85rem';
  textarea.style.padding = '12px';
  textarea.style.border = '1px solid #c7d2fe';
  textarea.style.borderRadius = '8px';
  textarea.style.boxSizing = 'border-box';
  textarea.style.background = '#ffffff';
  textarea.spellcheck = false;
  wrapper.appendChild(textarea);

  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.alignItems = 'center';
  controls.style.gap = '12px';
  controls.style.marginTop = '12px';
  wrapper.appendChild(controls);

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = buttonLabel;
  button.style.padding = '10px 18px';
  button.style.border = 'none';
  button.style.borderRadius = '999px';
  button.style.background = 'linear-gradient(90deg, #4c1d95, #2563eb)';
  button.style.color = '#ffffff';
  button.style.fontWeight = '600';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.25)';
  controls.appendChild(button);

  const status = document.createElement('span');
  status.style.fontSize = '0.85rem';
  status.style.fontWeight = '500';
  controls.appendChild(status);

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.style.color = isError ? '#dc2626' : '#047857';
  };

  button.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(textarea.value);
      const message = onTrain(parsed);
      if (typeof message === 'string' && message.trim().length > 0) {
        setStatus(message);
      } else {
        setStatus('Model updated successfully!');
      }
    } catch (error) {
      setStatus(error.message ?? 'Something went wrong while parsing the data.', true);
    }
  });

  return { wrapper, setStatus, textarea };
}

function toNumber(value) {
  const numeric = typeof value === 'string' && value.trim() === '' ? Number.NaN : Number(value);
  if (Number.isFinite(numeric)) {
    return numeric;
  }
  return Number.NaN;
}

function extractNumber(obj, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const numeric = toNumber(obj[key]);
      if (Number.isFinite(numeric)) {
        return numeric;
      }
    }
  }
  return undefined;
}

function parseBinaryLabel(value, description) {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (typeof value === 'number' && (value === 0 || value === 1)) {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'yes', 'y', 'true', 'ready', 'special'].includes(normalized)) {
      return 1;
    }
    if (['0', 'no', 'n', 'false', 'ordinary'].includes(normalized)) {
      return 0;
    }
  }
  throw new Error(`${description} should be either 0/1, yes/no, or true/false.`);
}

function parseLinearDataset(raw) {
  if (!Array.isArray(raw)) {
    throw new Error('Please provide a JSON array of tasting sessions.');
  }
  if (raw.length < 2) {
    throw new Error('Add at least two sessions so the line can be estimated.');
  }
  return raw.map((entry, index) => {
    if (entry == null || typeof entry !== 'object') {
      throw new Error(`Entry ${index + 1} must be an object with "hours" and "score".`);
    }
    const hours = extractNumber(entry, ['hours', 'Hours']);
    const score = extractNumber(entry, ['score', 'Score']);
    if (!Number.isFinite(hours)) {
      throw new Error(`Entry ${index + 1} needs a numeric "hours" value.`);
    }
    if (!Number.isFinite(score)) {
      throw new Error(`Entry ${index + 1} needs a numeric "score" value.`);
    }
    return { hours, score };
  });
}

function parseLogisticDataset(raw) {
  if (!Array.isArray(raw)) {
    throw new Error('Provide a JSON array where each item represents an apple.');
  }
  if (raw.length === 0) {
    throw new Error('Add at least one apple example to train the classifier.');
  }
  return raw.map((entry, index) => {
    if (entry == null || typeof entry !== 'object') {
      throw new Error(`Entry ${index + 1} must be an object with tasting clues.`);
    }
    let features;
    if (Array.isArray(entry.features) && entry.features.length >= 2) {
      const first = toNumber(entry.features[0]);
      const second = toNumber(entry.features[1]);
      if (Number.isFinite(first) && Number.isFinite(second)) {
        features = [first, second];
      }
    }
    if (!features) {
      const crunchiness = extractNumber(entry, ['crunchiness', 'Crunchiness']);
      const colorDepth = extractNumber(entry, ['color', 'Color', 'colorDepth', 'Color depth']);
      if (Number.isFinite(crunchiness) && Number.isFinite(colorDepth)) {
        features = [crunchiness, colorDepth];
      }
    }
    if (!features) {
      throw new Error(`Entry ${index + 1} needs either a "features" array or numeric "crunchiness" and "color depth" values.`);
    }
    const labelSource = entry.label ?? entry.ready ?? entry.Ready ?? entry['Ready for market?'];
    if (labelSource === undefined) {
      throw new Error(`Entry ${index + 1} needs a yes/no outcome ("label" or "ready").`);
    }
    const label = parseBinaryLabel(labelSource, `Entry ${index + 1} outcome`);
    return { features, label };
  });
}

function parseNeuralDataset(raw) {
  if (!Array.isArray(raw)) {
    throw new Error('Provide a JSON array describing the surprising flavor pairs.');
  }
  if (raw.length === 0) {
    throw new Error('Add at least one flavor pair so the network has something to learn.');
  }
  return raw.map((entry, index) => {
    if (entry == null || typeof entry !== 'object') {
      throw new Error(`Entry ${index + 1} must be an object with "features" or taste fields.`);
    }
    let features;
    if (Array.isArray(entry.features) && entry.features.length >= 2) {
      const first = toNumber(entry.features[0]);
      const second = toNumber(entry.features[1]);
      if (Number.isFinite(first) && Number.isFinite(second)) {
        features = [first, second];
      }
    }
    if (!features) {
      const flavor = extractNumber(entry, ['flavor', 'Flavor', 'flavorSurprise', 'Flavor surprise']);
      const texture = extractNumber(entry, ['texture', 'Texture', 'textureSurprise', 'Texture surprise']);
      if (Number.isFinite(flavor) && Number.isFinite(texture)) {
        features = [flavor, texture];
      }
    }
    if (!features) {
      throw new Error(`Entry ${index + 1} needs a "features" array or flavor & texture numbers.`);
    }
    const labelSource = entry.label ?? entry.special ?? entry.Special ?? entry['Special batch?'];
    if (labelSource === undefined) {
      throw new Error(`Entry ${index + 1} needs a yes/no label ("label" or "special").`);
    }
    const label = parseBinaryLabel(labelSource, `Entry ${index + 1} label`);
    return { features, label };
  });
}

function getRange(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return { min: min - 1, max: max + 1 };
  }
  const padding = (max - min) * 0.1;
  return { min: min - padding, max: max + padding };
}

function scale(value, domain, range) {
  const ratio = (value - domain.min) / (domain.max - domain.min);
  return range.min + ratio * (range.max - range.min);
}

function drawAxes(ctx, width, height, margin, xLabel, yLabel) {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#9aa5b1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin.left, height - margin.bottom);
  ctx.lineTo(width - margin.right, height - margin.bottom);
  ctx.moveTo(margin.left, height - margin.bottom);
  ctx.lineTo(margin.left, margin.top);
  ctx.stroke();

  ctx.fillStyle = '#52606d';
  ctx.font = '12px system-ui';
  ctx.fillText(xLabel, width - margin.right - 40, height - margin.bottom + 24);
  ctx.fillText(yLabel, margin.left - 30, margin.top + 12);
}

function drawLinearRegressionPlot(canvas, dataset, model) {
  const ctx = canvas.getContext('2d');
  const margin = { top: 16, right: 16, bottom: 32, left: 48 };
  const plotWidth = canvas.width;
  const plotHeight = canvas.height;

  const xRange = getRange(dataset.map((d) => d.hours));
  const yRange = getRange(dataset.map((d) => d.score));

  drawAxes(ctx, plotWidth, plotHeight, margin, 'Hours tasted', 'Sweetness score');

  dataset.forEach((point) => {
    const x = scale(point.hours, xRange, { min: margin.left, max: plotWidth - margin.right });
    const y = scale(point.score, yRange, { min: plotHeight - margin.bottom, max: margin.top });
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const xMin = xRange.min;
  const xMax = xRange.max;
  const yStart = model.intercept + model.slope * xMin;
  const yEnd = model.intercept + model.slope * xMax;
  const startX = scale(xMin, xRange, { min: margin.left, max: plotWidth - margin.right });
  const endX = scale(xMax, xRange, { min: margin.left, max: plotWidth - margin.right });
  const startY = scale(yStart, yRange, { min: plotHeight - margin.bottom, max: margin.top });
  const endY = scale(yEnd, yRange, { min: plotHeight - margin.bottom, max: margin.top });
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function drawLogisticRegressionPlot(canvas, dataset, model) {
  const ctx = canvas.getContext('2d');
  const margin = { top: 16, right: 16, bottom: 32, left: 48 };
  const plotWidth = canvas.width;
  const plotHeight = canvas.height;

  const xRange = getRange(dataset.map((d) => d.features[0]));
  const yRange = getRange(dataset.map((d) => d.features[1]));

  drawAxes(ctx, plotWidth, plotHeight, margin, 'Crunchiness', 'Color depth');

  dataset.forEach((point) => {
    const x = scale(point.features[0], xRange, { min: margin.left, max: plotWidth - margin.right });
    const y = scale(point.features[1], yRange, { min: plotHeight - margin.bottom, max: margin.top });
    ctx.fillStyle = point.label === 1 ? '#16a34a' : '#ef4444';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  const { weights, bias } = model;
  const [w1, w2] = weights;
  if (Math.abs(w2) > 1e-6) {
    const xStart = xRange.min;
    const xEnd = xRange.max;
    const yStart = (-bias - w1 * xStart) / w2;
    const yEnd = (-bias - w1 * xEnd) / w2;
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(
      scale(xStart, xRange, { min: margin.left, max: plotWidth - margin.right }),
      scale(yStart, yRange, { min: plotHeight - margin.bottom, max: margin.top }),
    );
    ctx.lineTo(
      scale(xEnd, xRange, { min: margin.left, max: plotWidth - margin.right }),
      scale(yEnd, yRange, { min: plotHeight - margin.bottom, max: margin.top }),
    );
    ctx.stroke();
  }
}

function drawNeuralNetworkPlot(canvas, dataset, model) {
  const ctx = canvas.getContext('2d');
  const margin = { top: 16, right: 16, bottom: 32, left: 48 };
  const plotWidth = canvas.width;
  const plotHeight = canvas.height;

  const xValues = dataset.map((d) => d.features[0]);
  const yValues = dataset.map((d) => d.features[1]);
  const xRange = xValues.length ? getRange(xValues) : { min: -0.1, max: 1.1 };
  const yRange = yValues.length ? getRange(yValues) : { min: -0.1, max: 1.1 };

  drawAxes(ctx, plotWidth, plotHeight, margin, 'Flavor surprise', 'Texture surprise');

  const gridSteps = 40;
  for (let gx = 0; gx <= gridSteps; gx += 1) {
    for (let gy = 0; gy <= gridSteps; gy += 1) {
      const xVal = xRange.min + (gx / gridSteps) * (xRange.max - xRange.min);
      const yVal = yRange.min + (gy / gridSteps) * (yRange.max - yRange.min);
      const prediction = model.predict([xVal, yVal]);
      const colorValue = Math.round(prediction * 200);
      ctx.fillStyle = `rgba(${colorValue}, ${220 - colorValue}, 255, 0.4)`;
      const xPixel = scale(xVal, xRange, { min: margin.left, max: plotWidth - margin.right });
      const yPixel = scale(yVal, yRange, { min: plotHeight - margin.bottom, max: margin.top });
      const cellWidth = (plotWidth - margin.left - margin.right) / gridSteps;
      const cellHeight = (plotHeight - margin.top - margin.bottom) / gridSteps;
      ctx.fillRect(xPixel - cellWidth / 2, yPixel - cellHeight / 2, cellWidth, cellHeight);
    }
  }

  dataset.forEach((point) => {
    const x = scale(point.features[0], xRange, { min: margin.left, max: plotWidth - margin.right });
    const y = scale(point.features[1], yRange, { min: plotHeight - margin.bottom, max: margin.top });
    ctx.fillStyle = point.label === 1 ? '#f97316' : '#7c3aed';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
  });
}

function formatNumber(value, digits = 2) {
  return Number.parseFloat(value).toFixed(digits);
}

function summarizeLinearRegression(model) {
  const list = document.createElement('ul');
  list.innerHTML = `
    <li>Slope (how much sweetness rises per extra tasting hour): <strong>${formatNumber(model.slope)}</strong></li>
    <li>Intercept (sweetness before tasting even starts): <strong>${formatNumber(model.intercept)}</strong></li>
    <li>Average prediction error: <strong>${formatNumber(model.error)}</strong></li>
  `;
  return list;
}

function summarizeLogisticRegression(model) {
  const list = document.createElement('ul');
  list.innerHTML = `
    <li>Weights learned for crunchiness & color depth: <strong>${model.weights.map((w) => formatNumber(w)).join(', ')}</strong></li>
    <li>Bias (baseline confidence): <strong>${formatNumber(model.bias)}</strong></li>
    <li>Accuracy on the tasting notes: <strong>${formatNumber(model.accuracy * 100)}%</strong></li>
  `;
  return list;
}

function summarizeNeuralNetwork(model) {
  const list = document.createElement('ul');
  list.innerHTML = `
    <li>Hidden taste detectors discovered: <strong>2 neurons</strong></li>
    <li>Training epochs completed: <strong>${model.epochs}</strong></li>
    <li>Accuracy on tricky surprises: <strong>${formatNumber(model.accuracy * 100)}%</strong></li>
  `;
  return list;
}

function linearRegression(dataset) {
  if (dataset.length < 2) {
    throw new Error('Linear regression needs at least two sessions with different hours.');
  }
  const n = dataset.length;
  const sumX = dataset.reduce((acc, d) => acc + d.hours, 0);
  const sumY = dataset.reduce((acc, d) => acc + d.score, 0);
  const sumXY = dataset.reduce((acc, d) => acc + d.hours * d.score, 0);
  const sumXX = dataset.reduce((acc, d) => acc + d.hours * d.hours, 0);
  const denominator = n * sumXX - sumX * sumX;
  if (Math.abs(denominator) < 1e-12) {
    throw new Error('Provide varied hour values so the line has a slope.');
  }
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  const error = dataset.reduce((acc, d) => {
    const prediction = intercept + slope * d.hours;
    return acc + Math.abs(prediction - d.score);
  }, 0) / n;
  return { slope, intercept, error };
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function logisticRegression(dataset, options = {}) {
  if (dataset.length === 0) {
    throw new Error('Logistic regression needs at least one labeled apple.');
  }
  const learningRate = options.learningRate ?? 0.05;
  const epochs = options.epochs ?? 2500;
  let weights = [0, 0];
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    let gradW = [0, 0];
    let gradB = 0;
    dataset.forEach(({ features, label }) => {
      const linear = weights[0] * features[0] + weights[1] * features[1] + bias;
      const prediction = sigmoid(linear);
      const error = prediction - label;
      gradW[0] += error * features[0];
      gradW[1] += error * features[1];
      gradB += error;
    });
    weights = weights.map((w, idx) => w - (learningRate / dataset.length) * gradW[idx]);
    bias -= (learningRate / dataset.length) * gradB;
  }

  const accuracy = dataset.reduce((acc, { features, label }) => {
    const prediction = sigmoid(weights[0] * features[0] + weights[1] * features[1] + bias);
    const predictedClass = prediction >= 0.5 ? 1 : 0;
    return acc + (predictedClass === label ? 1 : 0);
  }, 0) / dataset.length;

  return { weights, bias, accuracy };
}

function neuralNetwork(dataset, options = {}) {
  if (dataset.length === 0) {
    throw new Error('The neural network needs some labeled surprises to learn from.');
  }
  const learningRate = options.learningRate ?? 0.5;
  const epochs = options.epochs ?? 4000;
  let W1 = [
    [Math.random() - 0.5, Math.random() - 0.5],
    [Math.random() - 0.5, Math.random() - 0.5],
  ];
  let b1 = [0, 0];
  let W2 = [Math.random() - 0.5, Math.random() - 0.5];
  let b2 = 0;

  const sigmoidDerivative = (x) => {
    const s = sigmoid(x);
    return s * (1 - s);
  };

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    let gradW1 = [[0, 0], [0, 0]];
    let gradB1 = [0, 0];
    let gradW2 = [0, 0];
    let gradB2 = 0;

    dataset.forEach(({ features, label }) => {
      const z1 = [
        W1[0][0] * features[0] + W1[0][1] * features[1] + b1[0],
        W1[1][0] * features[0] + W1[1][1] * features[1] + b1[1],
      ];
      const a1 = [sigmoid(z1[0]), sigmoid(z1[1])];
      const z2 = W2[0] * a1[0] + W2[1] * a1[1] + b2;
      const prediction = sigmoid(z2);

      const error = prediction - label;
      gradW2[0] += error * a1[0];
      gradW2[1] += error * a1[1];
      gradB2 += error;

      const deltaHidden = [
        error * W2[0] * sigmoidDerivative(z1[0]),
        error * W2[1] * sigmoidDerivative(z1[1]),
      ];

      gradW1[0][0] += deltaHidden[0] * features[0];
      gradW1[0][1] += deltaHidden[0] * features[1];
      gradW1[1][0] += deltaHidden[1] * features[0];
      gradW1[1][1] += deltaHidden[1] * features[1];

      gradB1[0] += deltaHidden[0];
      gradB1[1] += deltaHidden[1];
    });

    const scaleFactor = learningRate / dataset.length;
    W1 = W1.map((row, i) => row.map((value, j) => value - scaleFactor * gradW1[i][j]));
    b1 = b1.map((value, i) => value - scaleFactor * gradB1[i]);
    W2 = W2.map((value, i) => value - scaleFactor * gradW2[i]);
    b2 -= scaleFactor * gradB2;
  }

  const predict = (features) => {
    const z1 = [
      W1[0][0] * features[0] + W1[0][1] * features[1] + b1[0],
      W1[1][0] * features[0] + W1[1][1] * features[1] + b1[1],
    ];
    const a1 = [sigmoid(z1[0]), sigmoid(z1[1])];
    const z2 = W2[0] * a1[0] + W2[1] * a1[1] + b2;
    return sigmoid(z2);
  };

  const accuracy = dataset.reduce((acc, { features, label }) => {
    const prediction = predict(features) >= 0.5 ? 1 : 0;
    return acc + (prediction === label ? 1 : 0);
  }, 0) / dataset.length;

  return {
    predict,
    accuracy,
    epochs,
  };
}

function addStoryDivider() {
  const divider = document.createElement('div');
  divider.style.height = '2px';
  divider.style.margin = '48px 0 24px';
  divider.style.background = 'linear-gradient(90deg, rgba(79, 70, 229, 0.25), rgba(14, 165, 233, 0.6))';
  root.appendChild(divider);
}

const lessons = [
  {
    key: 'linear',
    title: 'Step 1 · Linear Regression — drawing the first tasting line',
    intro: 'Ada starts by scoring apples after different tasting sessions. She hopes a straight-line rule will explain how sweetness improves the more she trains her senses.',
    defaultDataset: cloneDataset(DEFAULT_LINEAR_TASTINGS),
    parse: parseLinearDataset,
    trainerTitle: 'Bring your own tasting sessions',
    table: {
      headers: ['Session hours', 'Sweetness score'],
      mapRow: (d) => ({
        'Session hours': formatNumber(d.hours, 2),
        'Sweetness score': formatNumber(d.score, 2),
      }),
    },
    train: (dataset) => linearRegression(dataset),
    draw: (canvas, dataset, model) => drawLinearRegressionPlot(canvas, dataset, model),
    summarize: (model) => summarizeLinearRegression(model),
    story: (model) => `The line Ada finds is <code>sweetness = ${formatNumber(model.intercept)} + ${formatNumber(model.slope)} × hours</code>.<br>She now has a simple rule-of-thumb for planning practice time.`,
    successMessage: (dataset) => `Trained on ${dataset.length} sessions!`,
  },
  {
    key: 'logistic',
    title: 'Step 2 · Logistic Regression — pass or fail the tasting?',
    intro: 'Sweetness scores were useful, but the orchard team now needs a yes/no decision: which apples are ready for the market? Ada collects two clues per apple: crunchiness and color depth.',
    defaultDataset: cloneDataset(DEFAULT_LOGISTIC_APPLES),
    parse: parseLogisticDataset,
    trainerTitle: 'Experiment with your own apples',
    table: {
      headers: ['Crunchiness (1-10)', 'Color depth (1-10)', 'Ready for market?'],
      mapRow: (d) => ({
        'Crunchiness (1-10)': formatNumber(d.features[0], 2),
        'Color depth (1-10)': formatNumber(d.features[1], 2),
        'Ready for market?': d.label ? 'Yes' : 'No',
      }),
    },
    train: (dataset) => logisticRegression(dataset, { learningRate: 0.1, epochs: 2500 }),
    draw: (canvas, dataset, model) => drawLogisticRegressionPlot(canvas, dataset, model),
    summarize: (model) => summarizeLogisticRegression(model),
    story: 'Ada\'s rule now predicts a probability between 0 and 1. Apples above <code>50%</code> probability are shipped. The decision boundary is the bright blue line — in 2D it looks straight, but it comes from the S-shaped logistic curve.',
    successMessage: (dataset) => `Re-trained on ${dataset.length} apples!`,
  },
  {
    key: 'neural',
    title: 'Step 3 · Neural Network — catching surprising flavor combos',
    intro: 'The final tasting challenge is trickier. Some apples only shine when either texture or flavor is surprising, but not both at the same time. Simple lines cannot describe this “either/or” rule, so Ada builds a tiny neural network with a hidden layer to spot the pattern.',
    defaultDataset: cloneDataset(DEFAULT_NEURAL_SURPRISES),
    parse: parseNeuralDataset,
    trainerTitle: 'Invent new surprise combos',
    table: {
      headers: ['Flavor surprise', 'Texture surprise', 'Special batch?'],
      mapRow: (d) => ({
        'Flavor surprise': formatNumber(d.features[0], 2),
        'Texture surprise': formatNumber(d.features[1], 2),
        'Special batch?': d.label ? 'Yes' : 'No',
      }),
    },
    train: (dataset) => neuralNetwork(dataset, { learningRate: 0.8, epochs: 6000 }),
    draw: (canvas, dataset, model) => drawNeuralNetworkPlot(canvas, dataset, model),
    summarize: (model) => summarizeNeuralNetwork(model),
    story: 'Two hidden neurons combine to build the familiar “S-shapes”, but stacking them lets Ada draw bends and corners. The colored background shows the network\'s confidence — orange for special batches, purple for ordinary ones.',
    successMessage: (dataset) => `Re-trained on ${dataset.length} flavor pairs!`,
  },
];

function buildLesson(lesson) {
  const section = createSection(lesson.title, lesson.intro);

  const tableContainer = document.createElement('div');
  const insight = document.createElement('p');
  insight.style.marginTop = '8px';
  if (typeof lesson.story === 'string') {
    insight.innerHTML = lesson.story;
  }
  const canvasContainer = document.createElement('div');
  const summaryContainer = document.createElement('div');
  summaryContainer.style.marginTop = '16px';

  section.appendChild(tableContainer);
  section.appendChild(insight);
  section.appendChild(canvasContainer);
  section.appendChild(summaryContainer);

  const render = (dataset) => {
    const datasetCopy = cloneDataset(dataset);
    tableContainer.innerHTML = '';
    const table = createTable(
      lesson.table.headers,
      datasetCopy.map((entry) => lesson.table.mapRow(entry)),
    );
    tableContainer.appendChild(table);

    canvasContainer.innerHTML = '';
    summaryContainer.innerHTML = '';

    try {
      const model = lesson.train(datasetCopy);
      if (lesson.story) {
        if (typeof lesson.story === 'function') {
          insight.innerHTML = lesson.story(model, datasetCopy);
        } else {
          insight.innerHTML = lesson.story;
        }
        insight.style.color = '#1f2933';
      }
      const canvas = createCanvas();
      lesson.draw(canvas, datasetCopy, model);
      canvasContainer.appendChild(canvas);
      summaryContainer.style.color = '#1f2933';
      const summaryNode = lesson.summarize(model, datasetCopy);
      if (summaryNode) {
        summaryContainer.appendChild(summaryNode);
      }
      return model;
    } catch (error) {
      insight.style.color = '#dc2626';
      insight.textContent = error.message;
      summaryContainer.style.color = '#dc2626';
      summaryContainer.textContent = 'Adjust the data and try again.';
      canvasContainer.innerHTML = '';
      throw error;
    }
  };

  const trainer = createJsonTrainer({
    title: lesson.trainerTitle,
    sample: lesson.defaultDataset,
    onTrain: (raw) => {
      const parsed = lesson.parse(raw);
      render(parsed);
      return lesson.successMessage ? lesson.successMessage(parsed) : `Updated with ${parsed.length} entries.`;
    },
  });

  section.appendChild(trainer.wrapper);

  try {
    render(lesson.defaultDataset);
  } catch (error) {
    trainer.setStatus(error.message, true);
  }

  root.appendChild(section);
}

lessons.forEach((lesson, index) => {
  buildLesson(lesson);
  if (index < lessons.length - 1) {
    addStoryDivider();
  }
});

/******/ })()
;