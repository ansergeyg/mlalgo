import { linearRegression, logisticRegression, neuralNetwork } from './algorithms';
import { createJsonTrainer, parseLinearDataset, parseLogisticDataset, parseNeuralDataset } from './data';
import { createCanvas, drawLinearRegressionPlot, drawLogisticRegressionPlot, drawNeuralNetworkPlot } from './visualization';
import { createSection, createTable, formatNumber, summarizeLinearRegression, summarizeLogisticRegression, summarizeNeuralNetwork, addStoryDivider } from './ui';

const root = document.createElement('div');
root.id = 'app';
root.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
root.style.maxWidth = '960px';
root.style.margin = '0 auto';
root.style.padding = '32px';
root.style.lineHeight = '1.6';
root.style.background = '#f9fbff';
root.style.color = '#1f2933';

document.body.style.margin = '0';
document.body.style.background = '#e5ecf5';
document.body.appendChild(root);

document.title = 'Machine Learning Mini Story';

const header = document.createElement('header');
header.innerHTML = `
  <h1 style="margin-bottom: 0.2em">A Tiny Machine Learning Journey</h1>
  <p style="margin-top: 0">Follow along as our orchard scientist, Ada, learns how data can guide better apple tasting!</p>
`;
root.appendChild(header);

// UI helpers now imported from ./ui

function buildLinearRegressionSection() {
  const defaultDataset = [
    { hours: 1, score: 52 },
    { hours: 2, score: 57 },
    { hours: 3, score: 63 },
    { hours: 4, score: 69 },
    { hours: 5, score: 75 },
    { hours: 6, score: 83 },
  ];

  const section = createSection(
    'Step 1 – Linear Regression — drawing the first tasting line',
    'Ada starts by scoring apples after different tasting sessions. She hopes a straight-line rule will explain how sweetness improves the more she trains her senses.'
  );

  const tableContainer = document.createElement('div');
  const insight = document.createElement('p');
  insight.style.marginTop = '8px';
  const canvasContainer = document.createElement('div');
  const summaryContainer = document.createElement('div');
  summaryContainer.style.marginTop = '16px';

  section.appendChild(tableContainer);
  section.appendChild(insight);
  section.appendChild(canvasContainer);
  section.appendChild(summaryContainer);

  const render = (dataset) => {
    tableContainer.innerHTML = '';
    const table = createTable(
      ['Session hours', 'Sweetness score'],
      dataset.map((d) => ({ Hours: formatNumber(d.hours, 2), Score: formatNumber(d.score, 2) }))
    );
    tableContainer.appendChild(table);

    canvasContainer.innerHTML = '';
    summaryContainer.innerHTML = '';

    try {
      const model = linearRegression(dataset);
      insight.style.color = '#1f2933';
      insight.innerHTML = `The line Ada finds is <code>sweetness = ${formatNumber(model.intercept)} + ${formatNumber(model.slope)} × hours</code>.<br>She now has a simple rule-of-thumb for planning practice time.`;
      const canvas = createCanvas();
      drawLinearRegressionPlot(canvas, dataset, model);
      canvasContainer.appendChild(canvas);
      summaryContainer.style.color = '#1f2933';
      summaryContainer.appendChild(summarizeLinearRegression(model));
    } catch (error) {
      insight.style.color = '#dc2626';
      insight.textContent = error.message;
      summaryContainer.style.color = '#dc2626';
      summaryContainer.textContent = 'Adjust the data and try again.';
      throw error;
    }
  };

  const trainer = createJsonTrainer({
    title: 'Bring your own tasting sessions',
    sample: defaultDataset,
    onTrain: (raw) => {
      const parsed = parseLinearDataset(raw);
      render(parsed);
      return `Trained on ${parsed.length} sessions!`;
    },
  });

  section.appendChild(trainer.wrapper);

  try {
    render(defaultDataset);
  } catch (error) {
    trainer.setStatus(error.message, true);
  }
  root.appendChild(section);
}

function buildLogisticRegressionSection() {
  const defaultDataset = [
    { features: [2, 2], label: 0 },
    { features: [3, 3], label: 0 },
    { features: [4, 2], label: 0 },
    { features: [6, 5], label: 1 },
    { features: [7, 6], label: 1 },
    { features: [8, 5], label: 1 },
    { features: [5, 7], label: 1 },
    { features: [3, 6], label: 0 },
  ];

  const section = createSection(
    'Step 2 – Logistic Regression — pass or fail the tasting?',
    'Sweetness scores were useful, but the orchard team now needs a yes/no decision: which apples are ready for the market? Ada collects two clues per apple: crunchiness and color depth.'
  );

  const tableContainer = document.createElement('div');
  const story = document.createElement('p');
  story.innerHTML = 'Ada\'s rule now predicts a probability between 0 and 1. Apples above <code>50%</code> probability are shipped. The decision boundary is the bright blue line — in 2D it looks straight, but it comes from the S-shaped logistic curve.';
  const canvasContainer = document.createElement('div');
  const summaryContainer = document.createElement('div');
  summaryContainer.style.marginTop = '16px';

  section.appendChild(tableContainer);
  section.appendChild(story);
  section.appendChild(canvasContainer);
  section.appendChild(summaryContainer);

  const render = (dataset) => {
    tableContainer.innerHTML = '';
    const table = createTable(
      ['Crunchiness (1-10)', 'Color depth (1-10)', 'Ready for market?'],
      dataset.map((d) => ({
        Crunchiness: formatNumber(d.features[0], 2),
        'Color depth': formatNumber(d.features[1], 2),
        Ready: d.label ? 'Yes' : 'No',
      }))
    );
    tableContainer.appendChild(table);

    canvasContainer.innerHTML = '';
    summaryContainer.innerHTML = '';
    summaryContainer.style.color = '#1f2933';

    try {
      const model = logisticRegression(dataset, { learningRate: 0.1, epochs: 2500 });
      const canvas = createCanvas();
      drawLogisticRegressionPlot(canvas, dataset, model);
      canvasContainer.appendChild(canvas);
      summaryContainer.appendChild(summarizeLogisticRegression(model));
    } catch (error) {
      summaryContainer.style.color = '#dc2626';
      summaryContainer.textContent = error.message;
      throw error;
    }
  };

  const trainer = createJsonTrainer({
    title: 'Experiment with your own apples',
    sample: defaultDataset,
    onTrain: (raw) => {
      const parsed = parseLogisticDataset(raw);
      render(parsed);
      return `Re-trained on ${parsed.length} apples!`;
    },
  });

  section.appendChild(trainer.wrapper);

  try {
    render(defaultDataset);
  } catch (error) {
    trainer.setStatus(error.message, true);
  }
  root.appendChild(section);
}

function buildNeuralNetworkSection() {
  const defaultDataset = [
    { features: [0, 0], label: 0 },
    { features: [0, 1], label: 1 },
    { features: [1, 0], label: 1 },
    { features: [1, 1], label: 0 },
  ];

  const section = createSection(
    'Step 3 – Neural Network — catching surprising flavor combos',
    'The final tasting challenge is trickier. Some apples only shine when either texture or flavor is surprising, but not both at the same time. Simple lines cannot describe this either/or rule, so Ada builds a tiny neural network with a hidden layer to spot the pattern.'
  );

  const tableContainer = document.createElement('div');
  const story = document.createElement('p');
  story.textContent = 'Two hidden neurons combine to build the familiar S-shapes, but stacking them lets Ada draw bends and corners. The colored background shows the network\'s confidence — orange for special batches, purple for ordinary ones.';
  const canvasContainer = document.createElement('div');
  const summaryContainer = document.createElement('div');
  summaryContainer.style.marginTop = '16px';

  section.appendChild(tableContainer);
  section.appendChild(story);
  section.appendChild(canvasContainer);
  section.appendChild(summaryContainer);

  const render = (dataset) => {
    tableContainer.innerHTML = '';
    const table = createTable(
      ['Flavor surprise', 'Texture surprise', 'Special batch?'],
      dataset.map((d) => ({
        'Flavor surprise': formatNumber(d.features[0], 2),
        'Texture surprise': formatNumber(d.features[1], 2),
        'Special batch?': d.label ? 'Yes' : 'No',
      }))
    );
    tableContainer.appendChild(table);

    canvasContainer.innerHTML = '';
    summaryContainer.innerHTML = '';
    summaryContainer.style.color = '#1f2933';

    try {
      const model = neuralNetwork(dataset, { learningRate: 0.8, epochs: 6000 });
      const canvas = createCanvas();
      drawNeuralNetworkPlot(canvas, dataset, model);
      canvasContainer.appendChild(canvas);
      summaryContainer.appendChild(summarizeNeuralNetwork(model));
    } catch (error) {
      summaryContainer.style.color = '#dc2626';
      summaryContainer.textContent = error.message;
      throw error;
    }
  };

  const trainer = createJsonTrainer({
    title: 'Invent new surprise combos',
    sample: defaultDataset,
    onTrain: (raw) => {
      const parsed = parseNeuralDataset(raw);
      render(parsed);
      return `Re-trained on ${parsed.length} flavor pairs!`;
    },
  });

  section.appendChild(trainer.wrapper);

  try {
    render(defaultDataset);
  } catch (error) {
    trainer.setStatus(error.message, true);
  }
  root.appendChild(section);
}

buildLinearRegressionSection();
addStoryDivider(root);
buildLogisticRegressionSection();
addStoryDivider(root);
buildNeuralNetworkSection();
