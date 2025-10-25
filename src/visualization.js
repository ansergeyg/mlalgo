// Visualization helpers and drawing routines
/** Create a canvas with consistent styling. */
export function createCanvas(width = 360, height = 260) {
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

/** Compute min/max with padding for nicer axes. */
export function getRange(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return { min: min - 1, max: max + 1 };
  }
  const padding = (max - min) * 0.1;
  return { min: min - padding, max: max + padding };
}

/** Linear scale mapping from domain to range. */
export function scale(value, domain, range) {
  const ratio = (value - domain.min) / (domain.max - domain.min);
  return range.min + ratio * (range.max - range.min);
}

/** Draw X/Y axes with labels. */
export function drawAxes(ctx, width, height, margin, xLabel, yLabel) {
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

/** Scatter and fitted line for linear regression. */
export function drawLinearRegressionPlot(canvas, dataset, model) {
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

/** Scatter and decision boundary for logistic regression. */
export function drawLogisticRegressionPlot(canvas, dataset, model) {
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
  const w1 = weights[0];
  const w2 = weights[1];
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

/** Confidence background and scatter for the tiny neural network. */
export function drawNeuralNetworkPlot(canvas, dataset, model) {
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
