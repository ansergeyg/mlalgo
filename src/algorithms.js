// Core learning algorithms
/**
 * Ordinary least squares for y = a + b x.
 * @param {{hours:number, score:number}[]} dataset
 * @returns {{slope:number, intercept:number, error:number}}
 */

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function linearRegression(dataset) {
  if (!Array.isArray(dataset) || dataset.length < 2) {
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

/**
 * Binary logistic regression with SGD.
 * @param {{features:number[], label:0|1}[]} dataset
 * @param {{learningRate?:number, epochs?:number}} [options]
 * @returns {{weights:number[], bias:number, accuracy:number}}
 */
export function logisticRegression(dataset, options = {}) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
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

/**
 * Tiny 2-2-1 neural network with sigmoid activations.
 * @param {{features:number[], label:0|1}[]} dataset
 * @param {{learningRate?:number, epochs?:number}} [options]
 * @returns {{predict:(features:number[])=>number, accuracy:number, epochs:number}}
 */
export function neuralNetwork(dataset, options = {}) {
  if (!Array.isArray(dataset) || dataset.length === 0) {
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

  return { predict, accuracy, epochs };
}
